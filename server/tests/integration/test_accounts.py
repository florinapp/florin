import json
import datetime
import os
import requests
from decimal import Decimal
from florin import db
from .utils import reset_database
from pony.orm import db_session
from .fixtures.accounts import (td_chequing_account,
                                cibc_savings_account,
                                bmo_chequing_account,
                                tangerine_credit_card_account,
                                rogers_bank_credit_card_account)


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


def assert_transaction(transaction, expected_dict):
    for key, value in expected_dict.items():
        assert getattr(transaction, key) == value


def test_accounts_upload___csv___tangerine(tangerine_credit_card_account):
    response = requests.post('http://localhost:7000/api/accounts/4/upload', files=[
        ('tangerine.csv', ('tangerine.csv', open(os.path.join(
            os.path.dirname(__file__), 'fixtures/tangerine.csv'), 'r'), 'text/csv'))
    ])
    assert response.status_code == 200
    assert response.json() == {'totalImported': 2, 'totalSkipped': 0}

    transactions = db.Transaction.session.query(db.Transaction).all()
    assert len(transactions) == 2
    assert_transaction(transactions[0],
                        {
                            'info': 'Completed transfer to Tangerine DDA account XXXXXXXXXXXX~ Internet Withdrawal',
                            'account_id': 4,
                            "transaction_type": "debit",
                            'payee': 'Internet Withdrawal to Tangerine',
                            'amount': Decimal('-1000.00'),
                            'date': datetime.date(2017, 3, 7),
                            'category_id': 65535,
                        })
    assert_transaction(transactions[1],
                        {'info': 'From FOOINC.COM INC',
                        'account_id': 4,
                        'amount': Decimal('3000.00'),
                        'date': datetime.date(2017, 3, 14),
                        'category_id': 65535
                        })


def test_accounts_upload___csv___tangerine___skip_duplicates(tangerine_credit_card_account):
    response = requests.post('http://localhost:7000/api/accounts/4/upload', files=[
        ('tangerine.csv', ('tangerine.csv', open(os.path.join(
            os.path.dirname(__file__), 'fixtures/tangerine.csv'), 'r'), 'text/csv'))
    ])
    assert response.status_code == 200
    assert response.json() == {'totalImported': 2, 'totalSkipped': 0}

    response = requests.post('http://localhost:7000/api/accounts/4/upload', files=[
        ('tangerine.csv', ('tangerine.csv', open(os.path.join(
            os.path.dirname(__file__), 'fixtures/tangerine.csv'), 'r'), 'text/csv'))
    ])
    assert response.status_code == 200
    assert response.json() == {'totalImported': 0, 'totalSkipped': 2}


def test_accounts_upload___ofx(tangerine_credit_card_account):
    response = requests.post('http://localhost:7000/api/accounts/4/upload', files=[
        ('reports.ofx', ('reports.ofx', open(os.path.join(
            os.path.dirname(__file__), 'fixtures/reports.ofx'), 'r'), 'application/ofx'))
    ])
    assert response.status_code == 200

    txns = db.Transaction.session.query(db.Transaction).all()
    assert 6 == len(txns)


def test_accounts_new():
    response = requests.post('http://localhost:7000/api/accounts',
                             headers={'content-type': 'application/json'},
                             data=json.dumps({
                                 'account': {
                                     'institution': 'BAH',
                                     'name': 'DOH',
                                     'type': 'chequing',
                                 }
                             }))
    assert response.status_code == 201
    response_json = response.json()
    assert response_json['account']['institution'] == 'BAH'
    assert response_json['account']['name'] == 'DOH'
    assert response_json['account']['type'] == 'chequing'
    # with db_session:
    #     balances = db.AccountBalance.select()[:]
    # assert 1 == len(balances)
