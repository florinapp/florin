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
    data_by_date = defaultdict(dict)

    for account in accounts:
        with db_session:
            snapshots = list(account.snapshots.select())
        for snapshot in snapshots:
            data_by_date[snapshot.date].update({account.id: str(snapshot.value)})

    data = []
    for date, account_values in data_by_date.items():
        account_values.update({'date': str(date)})
        data.append(account_values)

    return flask.jsonify({
        'accounts': accounts_lookup_table,
        'data': data,
    })
