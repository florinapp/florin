"""
add accountbalance
"""

from yoyo import step

__depends__ = {'20170409_04_Md0hE-add-new-categories'}

steps = [
    step("""
CREATE TABLE IF NOT EXISTS "account_balances" (
"id" INTEGER NOT NULL PRIMARY KEY,
"account_id" TEXT NOT NULL,
"date" DATE NOT NULL,
"balance" DECIMAL(12, 2) NOT NULL
);
""")
]
