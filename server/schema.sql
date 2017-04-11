CREATE TABLE IF NOT EXISTS "accounts" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "institution" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "categories" (id INT, name STRING, parent_id INT DEFAULT NULL, type STRING NOT NULL DEFAULT 'expense', PRIMARY KEY (id));
CREATE TABLE IF NOT EXISTS "transactions" (
        `id`    INTEGER PRIMARY KEY AUTOINCREMENT,
        `date`  DATE NOT NULL,
        `info`  TEXT NOT NULL,
        `payee` TEXT NOT NULL,
        `memo`  TEXT NOT NULL,
        `amount`        DECIMAL(12,2) NOT NULL,
        `category`      TEXT,
        `tags`  TEXT NOT NULL,
        `transaction_type`      TEXT NOT NULL,
        `account`       TEXT NOT NULL,
        `is_internal_transfer`  BOOLEAN,
        `checksum`      TEXT NOT NULL UNIQUE,
        `category_id`   INTEGER NOT NULL DEFAULT 65535
);
CREATE INDEX "idx_transactions__account" ON "transactions" ("account")
;
