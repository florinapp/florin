import flask
import logging
from flask_cors import CORS
from pony.orm import db_session, desc
from collections import defaultdict
from . import database


logging.basicConfig()

app = flask.Flask(__name__)

CORS(app)

database.init(app)


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
        accounts = list(app.db.Account.select())

    return flask.jsonify({
        'accounts': map(transform_account_model_to_response, accounts)
    })


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
