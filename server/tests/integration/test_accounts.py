import requests
from florin.database import db
from pony.orm import db_session, commit


@db_session
def setup_function(function):
    for acct in db.Account.select()[:]:
        acct.delete()
    commit()


def test_accounts_get___empty():
    response = requests.get('http://localhost:7000/api/accounts')
    assert response.json() == {'accounts': []}


def test_accounts_get___one_account():
    with db_session:
        db.Account(id='1', institution='Toronto Dominion', name='Chequing', type='chequing')
        commit()
    response = requests.get('http://localhost:7000/api/accounts')
    assert response.json() == {
        'accounts': [
            {'id': '1', 'institution': 'Toronto Dominion', 'name': 'Chequing', 'type': 'chequing'}
        ]}
