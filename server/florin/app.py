import flask
import logging
import datetime
from decimal import Decimal
from flask_cors import CORS
from flask.json import JSONEncoder
from pony.orm import commit, db_session, TransactionIntegrityError, CacheIndexError
from collections import defaultdict
from . import database
from .importer import get_importer


logging.basicConfig(level='DEBUG')


class MyJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        if isinstance(obj, datetime.date):
            return obj.strftime('%Y-%m-%d')

        return super(MyJSONEncoder, self).default(obj)


def create_app():
    app = flask.Flask(__name__)
    app.json_encoder = MyJSONEncoder
    CORS(app)
    database.init(app)
    return app


app = create_app()


# TODO: remove
# def transform_account_model_to_response(account):
#     AccountSnapshot = app.db.AccountSnapshot
#     with db_session:
#         latest_snapshot = account.snapshots.select().order_by(desc(AccountSnapshot.date))[:1]
#     return {
#         'id': account.id,
#         'name': account.name,
#         'type': account.type,
#         'currentValue': None if len(latest_snapshot) == 0 else str(latest_snapshot[0].value),
#     }


@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    with db_session:
        accounts = list(app.db.Account.select().order_by(app.db.Account.name.desc()))

    return flask.jsonify({
        'accounts': [account.to_dict() for account in accounts]
    })


@app.route('/api/categories', methods=['GET'])
def get_categories():
    with db_session:
        categories = list(app.db.Category.select())

    flat_categories = [category.to_dict() for category in categories]
    top_level_categories = [c for c in flat_categories if c['parent_id'] is None]
    for category in top_level_categories:
        category['subcategories'] = [c for c in flat_categories if c['parent_id'] == category['id']]
    return flask.jsonify({
        'categories': top_level_categories
    })


@app.route('/api/accounts/<account_id>/upload', methods=['POST'])
def upload_transactions(account_id):
    file_items = flask.request.files.items()
    assert len(file_items) == 1
    filename, file_storage = file_items[0]
    importer = get_importer(filename)
    if not importer:
        flask.abort(flask.make_response(flask.jsonify({
            'error': 'Unsupported file extension'
        }), 400))

    result = importer.import_from(file_storage)
    total_imported, total_skipped = 0, 0

    for t in result:
        with db_session:
            # THIS IS RIDICULOUS
            # b/c a `commit()` is issued, the account fetched before
            # is no longer in the session's cache. If I associate account with
            # another transaction, I'm going to get:
            #   TransactionError: An attempt to mix objects belonging to different transactions
            # I need to do a commit() because I want duplicated transactions
            # (unique checksum) to be detected and skipped, but I also want
            # new transactions to be imported, but doing all in one transaction
            # will rollback everything.
            Account, Transaction = app.db.Account, app.db.Transaction
            account = Account.select(lambda a: a.id == account_id)
            if account.count() != 1:
                flask.abort(404)
            account = account.get()

            common_attrs = dict(t.common_attrs)
            common_attrs['account'] = account
            try:
                Transaction(**common_attrs)
                commit()
            except (TransactionIntegrityError, CacheIndexError):
                total_skipped += 1
            else:
                total_imported += 1

    return flask.jsonify({
        'totalImported': total_imported,
        'totalSkipped': total_skipped
    })


@app.route('/api/accounts/<account_id>', methods=['GET'])
def get_transactions(account_id):
    start_date = flask.request.args.get('startDate', '1970-01-01')
    end_date = flask.request.args.get('endDate', '9999-12-31')

    start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
    end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()

    include_internal_transfer = flask.request.args.get('includeInternalTransfer', False)

    with db_session:
        Account, Transaction = app.db.Account, app.db.Transaction
        if account_id == '_all':
            transactions = list(Transaction.select(
                lambda t: t.date >= start_date
                and t.date <= end_date
                and t.is_internal_transfer == include_internal_transfer
            ).order_by(Transaction.date.desc()))
        else:
            account = Account.select(lambda a: a.id == account_id)
            if account.count() != 1:
                flask.abort(404)

            account = account.get()

            transactions = list(Transaction.select(
                lambda t: t.account == account
                and t.date >= start_date and t.date <= end_date
                and t.is_internal_transfer == include_internal_transfer
            ).order_by(Transaction.date.desc()))

    return flask.jsonify({'transactions': [txn.to_dict() for txn in transactions]})


@app.route('/api/transactions/<transaction_id>', methods=['POST'])
def update_transaction(transaction_id):
    Transaction = app.db.Transaction

    with db_session:
        transaction = Transaction.select(lambda t: t.id == transaction_id)
        if transaction.count() != 1:
            flask.abort(404)

        transaction = transaction.get()
        request = flask.request.json
        for key, value in request.items():
            setattr(transaction, key, value)
        commit()

    return flask.jsonify({'transactions': [transaction.to_dict()]})



@app.route('/api/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    Transaction = app.db.Transaction

    with db_session:
        transaction = Transaction.select(lambda t: t.id == transaction_id)
        if transaction.count() != 1:
            flask.abort(404)

        transaction = transaction.get()
        transaction.delete()
        commit()

    return flask.jsonify({})


@app.route('/api/charts/assets', methods=['GET'])
def get_asset_chart_data():
    with db_session:
        accounts = list(app.db.Account.select())

    accounts_lookup_table = {account.id: account.name for account in accounts}
    default = {account.id: None for account in accounts}
    data_by_date = defaultdict(lambda: dict(default))

    for account in accounts:
        with db_session:
            snapshots = list(account.snapshots.select())
        for snapshot in snapshots:
            data_by_date[snapshot.date].update({account.id: str(snapshot.value)})

    data = []
    for date, account_values in sorted(data_by_date.items()):
        if len(data) == 0:
            prev_data = dict(default)
        else:
            prev_data = data[-1]

        value = dict(account_values)
        value.update({'date': str(date)})

        for account_id, account_value in value.items():
            if account_value is None:
                value[account_id] = prev_data.get(account_id) or '0'

        data.append(value)

    return flask.jsonify({
        'accounts': accounts_lookup_table,
        'data': data,
    })
