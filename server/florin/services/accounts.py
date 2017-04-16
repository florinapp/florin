import uuid
import operator
from pony.orm import commit, db_session, TransactionIntegrityError, CacheIndexError
from florin.importer import get_importer
from decimal import Decimal
from collections import defaultdict
from .exceptions import ResourceNotFound, InvalidRequest
from .categories import INTERNAL_TRANSFER_CATEGORY_ID, TBD_CATEGORY_ID
from . import params


ALL_ACCOUNTS = object()


def get_by_id(app, account_id):
    if account_id == '_all':
        return ALL_ACCOUNTS

    account = app.db.Account.select(lambda a: a.id == account_id)
    if account.count() != 1:
        raise ResourceNotFound()

    return account.get()


def _get_income_category_summary(app, account_id, args):
    start_date, end_date = params.get_date_range_params(args)

    get_by_id(app, account_id)
    categories = {c.id: c.name for c in app.db.Category.select()[:]}

    result = app.db.select(
        'SELECT categories.id as id, SUM(transactions.amount) as amount '
        'FROM categories INNER JOIN transactions '
        'WHERE '
        'categories.id = transactions.category_id '
        'AND transactions.category_id <> $internal_transfer_category_id '  # excluding internal transfers
        'AND transactions.date >= $start_date AND transactions.date <= $end_date '
        'AND categories.type = "income" '
        'GROUP BY categories.id',
        {
            'start_date': start_date,
            'end_date': end_date,
            'internal_transfer_category_id': INTERNAL_TRANSFER_CATEGORY_ID
        })

    category_summary = [
        {
            'category_id': category_id,
            'category_name': categories[category_id],
            'amount': abs(amount)
        } for (category_id, amount) in sorted(result, key=operator.itemgetter(1))
    ]
    return category_summary


def _get_expense_category_summary(app, account_id, args):
    start_date, end_date = params.get_date_range_params(args)

    get_by_id(app, account_id)
    categories = {c.id: c.name for c in app.db.Category.select()[:]}

    result = app.db.select(
        'SELECT categories.id as id, categories.parent_id as parent_id, SUM(transactions.amount) as amount '
        'FROM categories INNER JOIN transactions '
        'WHERE '
        'categories.id = transactions.category_id '
        'AND transactions.category_id <> $internal_transfer_category_id '  # excluding internal transfers
        'AND transactions.date >= $start_date AND transactions.date <= $end_date '
        'AND categories.type = "expense" '
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
            'amount': abs(amount)
        } for (category_id, amount) in sorted(aggregated_result.items(), key=operator.itemgetter(1))
    ]
    return category_summary


def get_summary(app, account_id, args):
    return {
        'categorySummary': {
            'expense': _get_expense_category_summary(app, account_id, args),
            'income': _get_income_category_summary(app, account_id, args)
        }
    }


def get(app):
    accounts = list(app.db.Account.select().order_by(app.db.Account.institution.desc()))
    return {
        'accounts': [account.to_dict() for account in accounts]
    }


def post(app, request_json):
    try:
        request_json['account']['id'] = uuid.uuid4().hex
        account = app.db.Account(**request_json['account'])
    except IndexError:
        raise InvalidRequest()
    else:
        return {'account': account.to_dict()}


def upload(app, account_id, files):
    file_items = files.items()
    assert len(file_items) == 1
    filename, file_storage = file_items[0]
    importer = get_importer(filename)
    if not importer:
        raise InvalidRequest('Unsupported file extension')

    transactions, balance = importer.import_from(file_storage)
    total_imported, total_skipped = 0, 0

    account = get_by_id(app, account_id)
    for t in transactions:
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

    if balance is not None:
        balance.update({
            'id': uuid.uuid4().hex,
            'account_id': account.id,
        })
        app.db.AccountBalance(**balance)
        commit()

    return {
        'totalImported': total_imported,
        'totalSkipped': total_skipped
    }
