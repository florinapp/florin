"""
update category schema
"""

from yoyo import step

__depends__ = {'20170405_01_3kHrc-add-categories'}

steps = [
    step("ALTER TABLE category ADD COLUMN parentId INT DEFAULT NULL")
]
