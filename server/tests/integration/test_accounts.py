import pytest
import requests
from florin.database import db
from .utils import reset_database, db_fixture


@pytest.fixture
@db_fixture(db.Account)
def td_chequing_account():
    return dict(id='1', institution='TD', name='Chequing', type='Chequing')


@pytest.fixture
@db_fixture(db.Account)
def cibc_savings_account():
    return dict(id='2', institution='CIBC', name='Primary Savings', type='Savings')


@pytest.fixture
@db_fixture(db.Account)
def bmo_chequing_account():
    return dict(id='3', institution='BMO', name='Chequing (USD)', type='Chequing')


@pytest.fixture
@db_fixture(db.Account)
def tangerine_credit_card_account():
    return dict(id='4', institution='Tangerine', name='MasterCard', type='CreditCard')


@pytest.fixture
@db_fixture(db.Account)
def rogers_bank_credit_card_account():
    return dict(id='5', institution='Rogers Bank', name='MasterCard', type='CreditCard')


def setup_function(function):
    reset_database()


def test_accounts_get___empty():
    response = requests.get('http://localhost:7000/api/accounts')
    assert response.json() == {'accounts': []}


def test_accounts_get___one_account(td_chequing_account):
    response = requests.get('http://localhost:7000/api/accounts')
    assert response.json() == {
        'accounts': [
            td_chequing_account
        ]}


def test_accounts_get___ordered_by_institution_name_by_default(td_chequing_account,
                                                               cibc_savings_account,
                                                               bmo_chequing_account):
    response = requests.get('http://localhost:7000/api/accounts')
    names = [r['institution'] for r in response.json()['accounts']]
    assert names == ['TD', 'CIBC', 'BMO']


def test_accounts_upload___file_extension_not_supported(tangerine_credit_card_account):
    response = requests.post('http://localhost:7000/api/accounts/4/upload', files=[
        ('requirements.txt', ('requirements.txt', open('requirements.txt', 'r'), 'text/plain'))
    ])
    assert response.status_code == 400
    assert response.json() == {'error': 'Unsupported file extension'}
