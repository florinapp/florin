import math
from asbool import asbool
from .params import get_date_range_params
from .categories import TBD_CATEGORY_ID, INTERNAL_TRANSFER_CATEGORY_ID
from . import accounts, exceptions
from pony.orm import commit


class Paginator(object):
    def __init__(self, args):
        self._args = args
        self.per_page = int(args.get('perPage', '10'))
        self.page = int(args.get('page', '1'))
        self.total = None

    def __call__(self, query):
        total = query.count()
        self.total_pages = int(math.ceil(1.0 * total / self.per_page))
        query = query.limit(self.per_page, offset=(self.page - 1) * self.per_page)
        return query


class TransactionFilter(object):
    def __init__(self, account, args):
        self._args = args
        self.start_date, self.end_date = get_date_range_params(args)
        self.include_internal_transfer = asbool(args.get('includeInternalTransfer', 'false'))
        self.only_uncategorized = asbool(args.get('onlyUncategorized', 'false'))
        self.account = account

    def __call__(self, query):
        query = query.filter(lambda t: t.date >= self.start_date and t.date <= self.end_date)

        if not self.include_internal_transfer:
            query = query.filter(lambda t: t.category_id != INTERNAL_TRANSFER_CATEGORY_ID)

        if self.only_uncategorized:
            query = query.filter(lambda t: t.category_id == TBD_CATEGORY_ID)

        if self.account is not accounts.ALL_ACCOUNTS:
            query = query.filter(lambda t: t.account == self.account.id)

        return query


def get(app, account_id, args):
    account = accounts.get_by_id(app, account_id)
    filter = TransactionFilter(account, args)
    paginator = Paginator(args)

    Transaction = app.db.Transaction

    query = Transaction.select()
    query = filter(query)

    query = query.order_by(Transaction.date.desc())
    query = paginator(query)
    transactions = query[:]

    return {
        'total_pages': paginator.total_pages,
        'current_page': paginator.page,
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
