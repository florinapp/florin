from asbool import asbool
from .params import get_date_range_params
from .categories import TBD_CATEGORY_ID, INTERNAL_TRANSFER_CATEGORY_ID
from . import accounts, exceptions
from pony.orm import commit, db_session, TransactionIntegrityError, CacheIndexError


def get(app, account_id, args):
    start_date, end_date = get_date_range_params(args)

    include_internal_transfer = asbool(args.get('includeInternalTransfer', 'false'))

    only_uncategorized = asbool(args.get('onlyUncategorized', 'false'))

    per_page = int(args.get('perPage', '10'))

    page = int(args.get('page', '1'))

    Transaction = app.db.Transaction

    query = Transaction.select(
        lambda t: t.date >= start_date
        and t.date <= end_date
    )

    if not include_internal_transfer:
        query = query.filter(lambda t: t.category_id != INTERNAL_TRANSFER_CATEGORY_ID)

    if only_uncategorized:
        query = query.filter(lambda t: t.category_id == TBD_CATEGORY_ID)

    account = accounts.get_by_id(app, account_id)
    if account is not accounts.ALL_ACCOUNTS:
        query = query.filter(lambda t: t.account == account.id)

    total = query.count()
    query = query.order_by(Transaction.date.desc()).limit(per_page, offset=(page - 1) * per_page)
    transactions = query[:]

    return {
        'total_pages': int(total / per_page) + 1,
        'current_page': page,
        'transactions': [txn.to_dict() for txn in transactions]
    }


def delete(app, transaction_id):
    Transaction = app.db.Transaction

    transaction = Transaction.select(lambda t: t.id == transaction_id)
    if transaction.count() != 1:
        raise exceptions.ResourceNotFound()

    transaction = transaction.get()
    transaction.delete()
    commit()

    return {}


def update(app, transaction_id, request_json):
    Transaction = app.db.Transaction

    transaction = Transaction.select(lambda t: t.id == transaction_id)
    if transaction.count() != 1:
        raise exceptions.ResourceNotFound()

    transaction = transaction.get()
    for key, value in request_json.items():
        setattr(transaction, key, value)
    commit()

    return {'transactions': [transaction.to_dict()]}
