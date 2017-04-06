"""
Add type column to categories
"""

from yoyo import step

__depends__ = {'20170405_04_srkT3-rename-to-categories'}

steps = [
    step("ALTER TABLE categories ADD COLUMN type STRING NOT NULL DEFAULT 'expense'")
]
