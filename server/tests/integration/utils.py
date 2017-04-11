from florin.database import db
from pony.orm import commit, db_session


@db_session
def reset_database():
    for acct in db.Account.select()[:]:
        acct.delete()
    for category in db.Category.select()[:]:
        category.delete()
    commit()
