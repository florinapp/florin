"""
move is_internal_transfer to the category internal transfer
"""

from yoyo import step

__depends__ = {'20170409_02_50q7m-fix-derp'}

steps = [
    step("UPDATE transactions SET category_id=65534 WHERE is_internal_transfer=1")
]
