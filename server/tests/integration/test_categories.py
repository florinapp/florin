import pytest
import requests
from florin.database import db
from pony.orm import db_session, commit
from .utils import reset_database


def setup_function(function):
    reset_database()


@pytest.fixture
def automobile():
    with db_session:
        category = db.Category(id=1, name='Automobile', parent_id=None, type='expense')
        commit()
        return category.to_dict()


@pytest.fixture
def automobile_with_subc():
    with db_session:
        category = db.Category(id=1, name='Automobile', parent_id=None, type='expense')
        db.Category(id=2, name='Gasoline', parent_id=1, type='expense')
        db.Category(id=3, name='Insurance', parent_id=1, type='expense')
        return category.to_dict()


def test_categories_get___empty():
    response = requests.get('http://localhost:7000/api/categories')
    assert response.json() == {'categories': []}


def test_categories_get___top_level_category(automobile):
    response = requests.get('http://localhost:7000/api/categories')
    automobile.update({'subcategories': []})
    assert response.json() == {'categories': [automobile]}


def test_categories_get___with_subcategories(automobile_with_subc):
    response = requests.get('http://localhost:7000/api/categories')
    automobile_with_subc.update({'subcategories': []})
    assert 1 == len(response.json()['categories'])
    actual = response.json()['categories'][0]
    actual_subcategories = actual.pop('subcategories')
    automobile_with_subc.pop('subcategories')
    assert actual == automobile_with_subc
    assert actual_subcategories == [
        {'id': 2, 'name': 'Gasoline', 'parent_id': 1, 'type': 'expense'},
        {'id': 3, 'name': 'Insurance', 'parent_id': 1, 'type': 'expense'}
    ]
