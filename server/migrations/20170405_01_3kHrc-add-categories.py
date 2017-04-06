"""
Add categories
"""

from yoyo import step

__depends__ = {}

steps = [
    step("CREATE TABLE category (id INT, name STRING, PRIMARY KEY (id))")
]
