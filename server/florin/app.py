import functools
import math
import flask
import logging
import datetime
import operator
from asbool import asbool
from decimal import Decimal
from flask_cors import CORS
from flask.json import JSONEncoder
from pony.orm import commit, db_session, TransactionIntegrityError, CacheIndexError
from collections import defaultdict
from . import database
from .importer import get_importer
from .services import transactions, params, accounts


logging.basicConfig(level='DEBUG')


TBD_CATEGORY_ID = 65535
INTERNAL_TRANSFER_CATEGORY_ID = 65534

ALL_ACCOUNTS = object()


def handle_exceptions(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except ResourceNotFound:
            flask.abort(404)

    return wrapper


def jsonify(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        response = fn(*args, **kwargs)
        return flask.jsonify(response)
    return wrapper


class MyJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(round(obj, 2))
        if isinstance(obj, float):
            return str(round(Decimal(str(obj)), 2))
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

    account = accounts.get_by_id(app, account_id)
    for t in result:
        with db_session:
            Transaction = app.db.Transaction

            common_attrs = dict(t.common_attrs)
            common_attrs['account'] = account.id
            common_attrs['category_id'] = TBD_CATEGORY_ID
            try:
                Transaction(**common_attrs)
                commit()
            except (TransactionIntegrityError, CacheIndexError) as e:
                print(str(e))
                total_skipped += 1
            else:
                total_imported += 1

    return flask.jsonify({
        'totalImported': total_imported,
        'totalSkipped': total_skipped
    })


@app.route('/api/accounts/<account_id>', methods=['GET'])
@jsonify
@handle_exceptions
@db_session
def get_transactions(account_id):
    return transactions.get(app, account_id, flask.request.args)


@app.route('/api/accounts/<account_id>/categorySummary', methods=['GET'])
@db_session
def get_account_summary(account_id):
    start_date, end_date = params.get_date_range_params(flask.request.args)

    account = accounts.get_by_id(app, account_id)
    categories = {c.id: c.name for c in app.db.Category.select()[:]}

    result = app.db.select(
        'SELECT categories.id as id, categories.parent_id as parent_id, SUM(transactions.amount) as amount '
        'FROM categories INNER JOIN transactions '
        'WHERE '
        'categories.id = transactions.category_id '
        'AND transactions.category_id <> $internal_transfer_category_id '  # excluding internal transfers
        'AND transactions.date >= $start_date AND transactions.date <= $end_date '
        'GROUP BY categories.id',
        {
            'start_date': start_date,
            'end_date': end_date,
            'internal_transfer_category_id': INTERNAL_TRANSFER_CATEGORY_ID
        })

    aggregated_result = defaultdict(lambda: Decimal('0'))
    for category_id, category_parent_id, sum_amount in result:
        if category_parent_id is None:
            aggregated_result[category_id] += Decimal(str(sum_amount))
        else:
            aggregated_result[category_parent_id] += Decimal(str(sum_amount))

    category_summary = [
        {
            'category_id': category_id,
            'category_name': categories[category_id],
            'amount': amount
        } for (category_id, amount) in sorted(aggregated_result.items(), key=operator.itemgetter(1))
    ]

    return flask.jsonify({'categorySummary': category_summary})


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
