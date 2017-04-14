import pytest
from florin.database import db
from ..utils import db_fixture


@pytest.fixture
@db_fixture(db.Category)
def automobile():
    return dict(id=1, name='Automobile', parent_id=None, type='expense')


@pytest.fixture
@db_fixture(db.Category)
def gasoline():
    return dict(id=2, name='Gasoline', parent_id=1, type='expense')


@pytest.fixture
@db_fixture(db.Category)
def insurance():
    return dict(id=3, name='Insurance', parent_id=1, type='expense')