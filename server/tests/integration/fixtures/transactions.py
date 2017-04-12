import pytest
import datetime
from decimal import Decimal
from florin.database import db
from florin.services.categories import TBD_CATEGORY_ID
from ..utils import db_fixture
from .accounts import tangerine_credit_card_account


@pytest.fixture
@db_fixture(db.Transaction)
def tangerine_txns():
    acct = tangerine_credit_card_account()
    return [
        {
            'date': datetime.date(2017, 1, 1),
            'payee': 'Uber',
            'memo': 'Uber',
            'amount': Decimal('-16.34'),
            'category_id': TBD_CATEGORY_ID,
            'account': acct['id'],
            'transaction_type': 'debit',
            'checksum': '00000',
        },
        {
            'date': datetime.date(2017, 1, 2),
            'payee': 'Walmart',
            'memo': 'Walmart ON CA',
            'amount': Decimal('-84.55'),
            'category_id': TBD_CATEGORY_ID,
            'account': acct['id'],
            'transaction_type': 'debit',
            'checksum': '11111',
        },
        {
            'date': datetime.date(2017, 1, 5),
            'payee': 'Costco',
            'memo': 'Costco ON CA',
            'amount': Decimal('-84.55'),
            'category_id': TBD_CATEGORY_ID,
            'account': acct['id'],
            'transaction_type': 'debit',
            'checksum': '22222',
        },
        {
            'date': datetime.date(2017, 2, 1),
            'payee': 'Costco',
            'memo': 'Costco ON CA',
            'amount': Decimal('-84.99'),
            'category_id': TBD_CATEGORY_ID,
            'account': acct['id'],
            'transaction_type': 'debit',
            'checksum': '33333',
        },
        {
            'date': datetime.date(2017, 3, 13),
            'payee': 'Costco',
            'memo': 'Costco ON CA',
            'amount': Decimal('-84.99'),
            'category_id': TBD_CATEGORY_ID,
            'account': acct['id'],
            'transaction_type': 'debit',
            'checksum': '44444',
        },
        {
            'date': datetime.date(2017, 3, 28),
            'payee': 'Costco',
            'memo': 'Costco ON CA',
            'amount': Decimal('-84.99'),
            'category_id': TBD_CATEGORY_ID,
            'account': acct['id'],
            'transaction_type': 'debit',
            'checksum': '55555',
        },
    ]
