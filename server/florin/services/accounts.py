from .exceptions import ResourceNotFound


ALL_ACCOUNTS = object()


def get_by_id(app, account_id):
    if account_id == '_all':
        return ALL_ACCOUNTS

    account = app.db.Account.select(lambda a: a.id == account_id)
    if account.count() != 1:
        raise ResourceNotFound()

    return account.get()
