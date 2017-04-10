from asbool import asbool
from .params import get_date_range_params
from .categories import TBD_CATEGORY_ID, INTERNAL_TRANSFER_CATEGORY_ID
from . import accounts, exceptions
from pony.orm import commit, db_session, TransactionIntegrityError, CacheIndexError
from florin.importer import get_importer


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


def upload(app, account_id, files):
    file_items = files.items()
    assert len(file_items) == 1
    filename, file_storage = file_items[0]
    importer = get_importer(filename)
    if not importer:
        raise exceptions.InvalidRequest('Unsupported file extension')

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

    return {
        'totalImported': total_imported,
        'totalSkipped': total_skipped
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
