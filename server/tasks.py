import datetime
import uuid
import florin.app
from decimal import Decimal
from invoke import task
from pony.orm import db_session, commit


@db_session
def _seed_accounts():
    app = florin.app.app
    Account = app.db.Account
    AccountSnapshot = app.db.AccountSnapshot

    a1 = Account(id=uuid.uuid4().hex, institution='Tangerine', name='Tangerine Investment Fund', type='TFSA')
    AccountSnapshot(account=a1, date=datetime.date(2016, 1, 1), value=Decimal('35500')),
    AccountSnapshot(account=a1, date=datetime.date(2017, 2, 21), value=Decimal('39638.83')),
    AccountSnapshot(account=a1, date=datetime.date(2017, 3, 4), value=Decimal('40046.28')),
    commit()

    a2 = Account(id=uuid.uuid4().hex, institution='WealthSimple', name='WealthSimple TFSA', type='TFSA')
    AccountSnapshot(account=a2, date=datetime.date(2017, 1, 1), value=Decimal('5000')),
    AccountSnapshot(account=a2, date=datetime.date(2017, 2, 1), value=Decimal('5068.41')),
    AccountSnapshot(account=a2, date=datetime.date(2017, 2, 21), value=Decimal('5127.81')),
    commit()

    Account(id=uuid.uuid4().hex, institution='Questrade', name='Questrade RESP', type='RESP')
    commit()


@task
def clean(ctx):
    ctx.run('rm florin.sqlite')


@task
def seed(ctx):
    _seed_accounts()


@task
def run(ctx):
    ctx.run('gunicorn --access-logfile=- --error-logfile=- --timeout=9999 -b 0.0.0.0:9000 --reload florin.app:app',
            pty=True)
