// ========================================
// ARKARK SQLite Schema DDL
// ========================================

export const SCHEMA_VERSION = 1

/**
 * All CREATE TABLE statements for the ARKARK database.
 * Tables are created in dependency order.
 */
export const SCHEMA_DDL = `
-- ========================================
-- 1. Accounts
-- ========================================
CREATE TABLE IF NOT EXISTS accounts (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  name          TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN (
                  'bank', 'cash', 'e_payment',
                  'credit_card', 'investment',
                  'insurance', 'loan'
                )),
  currency      TEXT NOT NULL DEFAULT 'TWD',
  institution   TEXT,
  icon          TEXT,
  color         TEXT,
  is_archived   INTEGER NOT NULL DEFAULT 0,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ========================================
-- 2. Categories
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  name          TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  icon          TEXT,
  color         TEXT,
  parent_id     TEXT REFERENCES categories(id),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_system     INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ========================================
-- 3. Transactions
-- ========================================
CREATE TABLE IF NOT EXISTS transactions (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  type          TEXT NOT NULL CHECK (type IN (
                  'income', 'expense', 'transfer'
                )),
  amount        REAL NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'TWD',
  account_id    TEXT NOT NULL REFERENCES accounts(id),
  to_account_id TEXT REFERENCES accounts(id),
  category_id   TEXT REFERENCES categories(id),
  note          TEXT,
  date          TEXT NOT NULL,
  time          TEXT,
  tags          TEXT,
  receipt_uri   TEXT,
  is_recurring  INTEGER NOT NULL DEFAULT 0,
  recurrence    TEXT,
  synced_at     TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ========================================
-- 4. Securities
-- ========================================
CREATE TABLE IF NOT EXISTS securities (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  symbol        TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN (
                  'stock', 'etf', 'fund', 'bond', 'crypto'
                )),
  currency      TEXT NOT NULL DEFAULT 'TWD',
  last_price    REAL,
  price_updated TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ========================================
-- 5. Holdings
-- ========================================
CREATE TABLE IF NOT EXISTS holdings (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  account_id    TEXT NOT NULL REFERENCES accounts(id),
  security_id   TEXT NOT NULL REFERENCES securities(id),
  units         REAL NOT NULL,
  avg_cost      REAL NOT NULL,
  purchase_date TEXT,
  note          TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ========================================
-- 6. Insurance Policies
-- ========================================
CREATE TABLE IF NOT EXISTS insurance_policies (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  account_id    TEXT NOT NULL REFERENCES accounts(id),
  policy_name   TEXT NOT NULL,
  insurer       TEXT,
  type          TEXT CHECK (type IN (
                  'life', 'savings', 'investment_linked',
                  'medical', 'accident', 'annuity'
                )),
  premium       REAL,
  premium_freq  TEXT CHECK (premium_freq IN (
                  'monthly', 'quarterly', 'semi_annual', 'annual'
                )),
  sum_assured   REAL,
  cash_value    REAL,
  linked_fund_id TEXT REFERENCES securities(id),
  start_date    TEXT,
  maturity_date TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ========================================
-- 7. Budgets
-- ========================================
CREATE TABLE IF NOT EXISTS budgets (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  category_id   TEXT REFERENCES categories(id),
  amount        REAL NOT NULL,
  period        TEXT NOT NULL CHECK (period IN ('monthly', 'weekly')),
  start_date    TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ========================================
-- 8. Sync Log
-- ========================================
CREATE TABLE IF NOT EXISTS sync_log (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  action        TEXT NOT NULL,
  entity_type   TEXT NOT NULL,
  entity_id     TEXT NOT NULL,
  fingerprint   TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ========================================
-- Indexes
-- ========================================
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_holdings_account ON holdings(account_id);
CREATE INDEX IF NOT EXISTS idx_holdings_security ON holdings(security_id);
`
