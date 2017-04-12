import pytest
import requests
from .utils import reset_database
from .fixtures.transactions import create
from .fixtures.accounts import tangerine_credit_card_account


def setup_function(function):
    reset_database()


def test_transactions_get___empty():
    response = requests.get('http://localhost:7000/api/accounts/_all')
    assert response.status_code == 200
    assert response.json() == {'transactions': [], 'total_pages': 0, 'current_page': 1}


def test_transactions_get___tangerine_account(tangerine_credit_card_account):
    for _ in xrange(5):
        create(account=tangerine_credit_card_account['id'])
    response = requests.get('http://localhost:7000/api/accounts/4')
    assert response.status_code == 200
    response_json = response.json()
    assert 5 == len(response_json['transactions'])
    assert response_json['current_page'] == 1
    assert response_json['total_pages'] == 1


def test_transactions_get___pagination(tangerine_credit_card_account):
    for _ in xrange(5):
        create(account=tangerine_credit_card_account['id'])
    response = requests.get('http://localhost:7000/api/accounts/4?perPage=4&page=1')
    assert response.status_code == 200
    response_json = response.json()
    assert response_json['current_page'] == 1
    assert response_json['total_pages'] == 2


def test_transactions_get___pagination___edge_case(tangerine_credit_card_account):
    for _ in xrange(6):
        create(account=tangerine_credit_card_account['id'])
    response = requests.get('http://localhost:7000/api/accounts/4?perPage=2&page=3')
    assert response.status_code == 200
    response_json = response.json()
    assert response_json['current_page'] == 3
    assert response_json['total_pages'] == 3
