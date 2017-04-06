"""
fix case
"""

from yoyo import step

__depends__ = {'20170405_02_Va3i2-update-category-schema'}

steps = [
    step("DROP TABLE category"),
    step("CREATE TABLE category (id INT, name STRING, parent_id INT DEFAULT NULL, PRIMARY KEY (id))"),
]
