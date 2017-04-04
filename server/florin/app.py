import flask
import logging
import datetime
from decimal import Decimal
from flask_cors import CORS
from flask.json import JSONEncoder
from pony.orm import db_session, desc
from collections import defaultdict
from . import database


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


def transform_account_model_to_response(account):
    AccountSnapshot = app.db.AccountSnapshot
    with db_session:
        latest_snapshot = account.snapshots.select().order_by(desc(AccountSnapshot.date))[:1]
    return {
        'id': account.id,
        'name': account.name,
        'type': account.type,
        'currentValue': None if len(latest_snapshot) == 0 else str(latest_snapshot[0].value),
    }


@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    with db_session:
        accounts = list(app.db.Account.select().order_by(app.db.Account.name.desc()))

    return flask.jsonify({
        'accounts': [account.to_dict() for account in accounts]
    })


@app.route('/api/accounts/<account_id>', methods=['GET'])
def get_transactions(account_id):
    start_date = flask.request.args.get('startDate', '1970-01-01')
    end_date = flask.request.args.get('endDate', '9999-12-31')

    start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
    end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()

    with db_session:
        Account, Transaction = app.db.Account, app.db.Transaction
        account = Account.select(lambda a: a.id == account_id)
        if account.count() != 1:
            flask.abort(404)

        account = account.get()

        transactions = list(Transaction.select(lambda t: t.account == account
                                               and t.date >= start_date and t.date <= end_date
                                               ).order_by(Transaction.date.desc()))

    return flask.jsonify({'transactions': [txn.to_dict() for txn in transactions]})


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
