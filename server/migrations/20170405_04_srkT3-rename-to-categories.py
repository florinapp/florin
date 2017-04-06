"""
rename to categories
"""

from yoyo import step

__depends__ = {'20170405_03_6L7uU-fix-case'}

steps = [
    step("ALTER TABLE category RENAME TO categories")
]
