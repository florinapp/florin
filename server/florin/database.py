import os
import datetime
from decimal import Decimal
from pony.orm import Database, Optional, Required, PrimaryKey


db = Database()


class Account(db.Entity):
    _table_ = 'accounts'

    id = PrimaryKey(str)
    institution = Required(str)
    name = Required(str)
    type = Required(str)


class AccountBalance(db.Entity):
    _table_ = 'account_balances'

    id = PrimaryKey(str)
    account_id = Required(str)
    date = Required(datetime.date)
    balance = Required(Decimal)


class Transaction(db.Entity):
    _table_ = 'transactions'

    date = Required(datetime.date)
    info = Optional(str)
    payee = Required(str)
    memo = Optional(str)
    amount = Required(Decimal)
    category_id = Required(int)
    tags = Optional(str)
    transaction_type = Required(str)
    account = Required(str)
    checksum = Required(str, unique=True)


class Category(db.Entity):
    _table_ = 'categories'

    id = PrimaryKey(int)
    name = Required(str)
    parent_id = Optional(int)
    type = Required(str)


def init(app):
    app.db = db
    if 'DBFILE' not in os.environ:
        raise AssertionError('Missing environment variable DBFILE')
    dbfile = os.path.join(os.getcwd(), os.getenv('DBFILE'))
    db.bind('sqlite', dbfile, create_db=True)
    db.generate_mapping(create_tables=True)
