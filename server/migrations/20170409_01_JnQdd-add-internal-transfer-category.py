"""
add internal transfer category
"""

from yoyo import step

__depends__ = {'20170406_04_ov0PW-add-category-id-field-to-transactions-table'}

steps = [
    step("UPDATE categories SET type='special' WHERE type='other'"),
    step("INSERT INTO categories VALUES(65534, 'Internal Transfer', NULL, 'other')")
]
