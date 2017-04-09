"""
Add new categories
"""

from yoyo import step

__depends__ = {'20170409_03_LZ0jm-move-is-internal-transfer-to-the-category-internal-transfer'}

steps = [
    step("INSERT INTO categories VALUES(1005, 'Parking', 1, 'expense') "),
    step("INSERT INTO categories VALUES(3006, 'Property Tax', 3, 'expense') "),
    step("INSERT INTO categories VALUES(50004, 'Tax Rebate', 50, 'income') ")
]
