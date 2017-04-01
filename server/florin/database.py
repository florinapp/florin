import os
import datetime
from decimal import Decimal
from pony.orm import Database, Required, PrimaryKey, Set


db = Database()


class Account(db.Entity):
    id = PrimaryKey(str)
    name = Required(str)
    type = Required(str)
    snapshots = Set('AccountSnapshot')


class AccountSnapshot(db.Entity):
    account = Required(Account)
    value = Required(Decimal)
    date = Required(datetime.date)


def init(app):
    app.db = db
    db.bind('sqlite', os.path.join(os.getcwd(), 'florin.sqlite'), create_db=True)
    db.generate_mapping(create_tables=True)
