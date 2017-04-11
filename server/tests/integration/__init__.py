import os
from florin.database import db


TEST_DBFILE = os.path.join(os.path.dirname(__name__), '..', '..', 'test.sqlite')


db.bind('sqlite', TEST_DBFILE, create_db=True)
db.generate_mapping(create_tables=True)
