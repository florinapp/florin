import pytest
import requests
from florin.database import db
from .utils import reset_database, db_fixture


def setup_function(function):
    reset_database()


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


def test_categories_get___empty():
    response = requests.get('http://localhost:7000/api/categories')
    assert response.json() == {'categories': []}


def test_categories_get___top_level_category(automobile):
    response = requests.get('http://localhost:7000/api/categories')
    automobile.update({'subcategories': []})
    assert response.json() == {'categories': [automobile]}


def test_categories_get___with_subcategories(automobile, gasoline, insurance):
    response = requests.get('http://localhost:7000/api/categories')
    assert 1 == len(response.json()['categories'])
    actual = response.json()['categories'][0]
    actual_subcategories = actual.pop('subcategories')
    assert actual == automobile
    assert actual_subcategories == [
        {'id': 2, 'name': 'Gasoline', 'parent_id': 1, 'type': 'expense'},
        {'id': 3, 'name': 'Insurance', 'parent_id': 1, 'type': 'expense'}
    ]
