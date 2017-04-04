import os
import datetime
from decimal import Decimal
from pony.orm import Database, Optional, Required, PrimaryKey, Set, sql_debug


db = Database()


class Account(db.Entity):
    _table_ = 'accounts'

    id = PrimaryKey(str)
    institution = Required(str)
    name = Required(str)
    type = Required(str)
    # snapshots = Set('AccountSnapshot')
    transactions = Set('Transaction')


# class AccountSnapshot(db.Entity):
#     account = Required(Account)
#     value = Required(Decimal)
#     date = Required(datetime.date)


class Transaction(db.Entity):
    _table_ = 'transactions'

    date = Required(datetime.date)
    info = Optional(str)
    payee = Required(str)
    memo = Required(str)
    amount = Required(Decimal)
    category = Required(str, default='TBD')
    tags = Optional(str)
    transaction_type = Required(str)
    account = Required(Account)
    is_internal_transfer = Required(bool, default=False)
    checksum = Required(str, unique=True)


def init(app):
    app.db = db
    db.bind('sqlite', os.path.join(os.getcwd(), 'florin.sqlite'), create_db=True)
    db.generate_mapping(create_tables=True)
    sql_debug(True)
