from florin.database import db
from pony.orm import commit, db_session


@db_session
def reset_database():
    for acct in db.Account.select()[:]:
        acct.delete()
    for category in db.Category.select()[:]:
        category.delete()
    for transaction in db.Transaction.select()[:]:
        transaction.delete()
    commit()


def db_fixture(db_class):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            response = fn(*args, **kwargs)
            with db_session:
                db_class(**response)
                commit()
            return response
        return wrapper
    return decorator
