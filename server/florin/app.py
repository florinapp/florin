import functools
import flask
import logging
import datetime
from decimal import Decimal
from flask_cors import CORS
from flask.json import JSONEncoder
from pony.orm import db_session
from collections import defaultdict
from . import database
from .services import transactions, exceptions, accounts


logging.basicConfig(level='DEBUG')


def handle_exceptions(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except exceptions.ResourceNotFound:
            flask.abort(404)
        except exceptions.InvalidRequest as e:
            flask.abort(flask.make_response(flask.jsonify({
                'error': str(e)
            }), 400))

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
        accounts = list(app.db.Account.select().order_by(app.db.Account.institution.desc()))

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
@handle_exceptions
@jsonify
def upload_transactions(account_id):
    return transactions.upload(app, account_id, flask.request.files)


@app.route('/api/accounts/<account_id>', methods=['GET'])
@jsonify
@handle_exceptions
@db_session
def get_transactions(account_id):
    return transactions.get(app, account_id, flask.request.args)


@app.route('/api/accounts/<account_id>/categorySummary', methods=['GET'])
@jsonify
@handle_exceptions
@db_session
def get_account_summary(account_id):
    return accounts.get_summary(app, account_id, flask.request.args)


@app.route('/api/transactions/<transaction_id>', methods=['POST'])
@jsonify
@handle_exceptions
@db_session
def update_transaction(transaction_id):
    return transactions.update(app, transaction_id, flask.request.json)


@app.route('/api/transactions/<transaction_id>', methods=['DELETE'])
@jsonify
@handle_exceptions
@db_session
def delete_transaction(transaction_id):
    return transactions.delete(app, transaction_id)


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
