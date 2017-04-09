"""
fix derp
"""

from yoyo import step

__depends__ = {'20170409_01_JnQdd-add-internal-transfer-category'}

steps = [
    step("UPDATE categories SET type='special' WHERE type='other'")
]
