import operator
from decimal import Decimal
from collections import defaultdict
from .exceptions import ResourceNotFound
from .categories import INTERNAL_TRANSFER_CATEGORY_ID
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
