import pytest
import requests
from florin.database import db
from pony.orm import db_session, commit
from .utils import reset_database


@pytest.fixture
def td_chequing_account():
    return dict(id='1', institution='TD', name='Chequing', type='chequing')


@pytest.fixture
def cibc_savings_account():
    return dict(id='2', institution='CIBC', name='Primary Savings', type='savings')


@pytest.fixture
def bmo_chequing_account():
    return dict(id='3', institution='BMO', name='Chequing (USD)', type='chequing')


def setup_function(function):
    reset_database()


def test_accounts_get___empty():
    response = requests.get('http://localhost:7000/api/accounts')
    assert response.json() == {'accounts': []}


def test_accounts_get___one_account(td_chequing_account):
    with db_session:
        db.Account(**td_chequing_account)
        commit()
    response = requests.get('http://localhost:7000/api/accounts')
    assert response.json() == {
        'accounts': [
           td_chequing_account
        ]}


def test_accounts_get___ordered_by_institution_name_by_default(td_chequing_account,
                                                               cibc_savings_account,
                                                               bmo_chequing_account):
    with db_session:
        db.Account(**td_chequing_account)
        db.Account(**cibc_savings_account)
        db.Account(**bmo_chequing_account)
        commit()
    response = requests.get('http://localhost:7000/api/accounts')
    names = [r['institution'] for r in response.json()['accounts']]
    assert names == ['TD', 'CIBC', 'BMO']
