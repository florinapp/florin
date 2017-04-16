from hashlib import md5
from ofxparse import OfxParser
from ofxparse.ofxparse import Transaction


HASH_FIELDS = (
    'date',
    'payee',
    'memo',
    'amount',
    'type',
)


def checksum(self):
    return md5('\n'.join([
        str(self.__dict__[field]) for field in HASH_FIELDS
    ]).encode('utf-8')).hexdigest()


def common_attrs(self):
    return {
        'date': self.__dict__['date'],
        'payee': self.__dict__['payee'],
        'memo': self.__dict__['memo'],
        'amount': self.__dict__['amount'],
        'transaction_type': self.__dict__['type'],
        'checksum': 'md5:{}'.format(self.checksum),
    }


Transaction.checksum = property(checksum)
Transaction.common_attrs = property(common_attrs)


class OFXImporter(object):
    def __init__(self):
        self.parser = OfxParser()

    def import_from(self, file_storage):
        result = self.parser.parse(file_storage)
        assert 1 == len(result.accounts)
        for t in result.accounts[0].statement.transactions:
            print(t.common_attrs)
        balance = {
            'balance': result.accounts[0].statement.balance,
            'date': result.accounts[0].statement.balance_date.date(),
        }
        return result.accounts[0].statement.transactions, balance
