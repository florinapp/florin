import os
import sqlalchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float, UnicodeText


Base = declarative_base()


class ToDictMixin(object):
    __export__ = []  # subclass must define

    def to_dict(self):
        assert hasattr(self, '__export__')
        return {
            k: self.__dict__[k] for k in self.__export__
        }


class Account(Base, ToDictMixin):
    __tablename__ = 'accounts'
    __export__ = ['id', 'institution', 'name', 'type']

    id = Column(Integer, primary_key=True, autoincrement=True)
    institution = Column(String(64), nullable=False)
    name = Column(String(64), nullable=False)
    type = Column(String(32), nullable=False)
    signature = Column(String(64), nullable=True)


class AccountBalance(Base):
    __tablename__ = 'account_balances'

    id = Column(Integer, primary_key=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey('accounts.id'), nullable=False)
    date = Column(Date, nullable=False)
    balance = Column(Float(as_decimal=True), nullable=False)


class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, nullable=False)
    info = Column(String(255))
    payee = Column(String(255))
    memo = Column(UnicodeText)
    amount = Column(Float(as_decimal=True), nullable=False)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    transaction_type = Column(String, nullable=False)
    account_id = Column(Integer, ForeignKey('accounts.id'), nullable=True)
    checksum = Column(String(64), nullable=False)


class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    parent_id = Column(Integer, ForeignKey('categories.id'), nullable=True)
    type = Column(String(16), nullable=False)


def get_engine(dbfile):
    return sqlalchemy.create_engine('sqlite:///{}'.format(dbfile))


def init(app, dbfile):
    engine = get_engine(dbfile)
    session = sessionmaker(bind=engine)()
    Base.session = session
    app.session = session
