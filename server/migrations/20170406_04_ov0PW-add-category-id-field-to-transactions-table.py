"""
Add category_id field to transactions table
"""

from yoyo import step

__depends__ = {'20170406_03_wiTeb-add-special-tbd-category'}

steps = [
    step("ALTER TABLE transactions ADD COLUMN category_id INTEGER NOT NULL DEFAULT 65535")
]
