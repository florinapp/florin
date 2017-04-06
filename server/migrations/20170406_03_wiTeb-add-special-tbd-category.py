"""
Add special TBD category
"""

from yoyo import step

__depends__ = {'20170406_02_aL8iO-add-stock-categories'}

steps = [
    step('INSERT INTO categories VALUES(65535, "TBD", NULL, "other")')
]
