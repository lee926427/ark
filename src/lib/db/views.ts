// ========================================
// ARKARK SQLite Views
// ========================================

/**
 * View 1: v_assets_summary
 * Per-account asset summary: cash balance + holdings market value + insurance value
 */
export const VIEW_ASSETS_SUMMARY = `
CREATE VIEW IF NOT EXISTS v_assets_summary AS
SELECT
  a.id AS account_id,
  a.name AS account_name,
  a.type AS account_type,
  a.currency,

  COALESCE(bal.balance, 0) AS cash_balance,
  COALESCE(hv.market_value, 0) AS holdings_value,
  COALESCE(hv.market_value - hv.total_cost, 0) AS unrealized_pnl,
  COALESCE(ins.total_cash_value, 0) AS insurance_value,

  COALESCE(bal.balance, 0) +
  COALESCE(hv.market_value, 0) +
  COALESCE(ins.total_cash_value, 0) AS total_value

FROM accounts a

LEFT JOIN (
  SELECT account_id,
    SUM(CASE
      WHEN type = 'income'  THEN amount
      WHEN type = 'expense' THEN -amount
      WHEN type = 'transfer' THEN -amount
      ELSE 0
    END) AS balance
  FROM transactions
  GROUP BY account_id
) bal ON bal.account_id = a.id

LEFT JOIN (
  SELECT h.account_id,
    SUM(h.units * COALESCE(s.last_price, h.avg_cost)) AS market_value,
    SUM(h.units * h.avg_cost) AS total_cost
  FROM holdings h
  JOIN securities s ON s.id = h.security_id
  GROUP BY h.account_id
) hv ON hv.account_id = a.id

LEFT JOIN (
  SELECT account_id,
    SUM(COALESCE(cash_value, 0)) AS total_cash_value
  FROM insurance_policies
  GROUP BY account_id
) ins ON ins.account_id = a.id

WHERE a.is_archived = 0;
`

/**
 * View 2: v_account_balances
 * Account balances calculated from transaction flow, with bi-directional transfer handling
 */
export const VIEW_ACCOUNT_BALANCES = `
CREATE VIEW IF NOT EXISTS v_account_balances AS
SELECT
  a.id,
  a.name,
  a.type,
  a.currency,
  a.institution,
  a.icon,
  a.color,
  COALESCE(
    SUM(CASE
      WHEN t.type = 'income'   THEN t.amount
      WHEN t.type = 'expense'  THEN -t.amount
      WHEN t.type = 'transfer' AND t.account_id = a.id THEN -t.amount
      WHEN t.type = 'transfer' AND t.to_account_id = a.id THEN t.amount
      ELSE 0
    END),
    0
  ) AS balance,
  COUNT(t.id) AS transaction_count,
  MAX(t.date) AS last_transaction_date
FROM accounts a
LEFT JOIN transactions t
  ON t.account_id = a.id OR t.to_account_id = a.id
WHERE a.is_archived = 0
GROUP BY a.id;
`

/**
 * View 3: v_financial_health_check
 * Aggregate financial health metrics
 */
export const VIEW_FINANCIAL_HEALTH_CHECK = `
CREATE VIEW IF NOT EXISTS v_financial_health_check AS
SELECT
  SUM(total_value) AS total_assets,

  SUM(CASE WHEN account_type IN ('bank', 'cash', 'e_payment')
    THEN cash_balance ELSE 0 END) AS liquid_cash,

  SUM(CASE WHEN account_type = 'investment'
    THEN holdings_value ELSE 0 END) AS risk_assets,

  SUM(insurance_value) AS total_insurance,

  SUM(CASE WHEN account_type IN ('loan', 'credit_card')
    THEN ABS(cash_balance) ELSE 0 END) AS total_liabilities,

  SUM(total_value) -
  SUM(CASE WHEN account_type IN ('loan', 'credit_card')
    THEN ABS(cash_balance) ELSE 0 END) AS net_worth,

  (SELECT COALESCE(AVG(monthly_expense), 0) FROM (
    SELECT strftime('%Y-%m', date) AS month,
           SUM(amount) AS monthly_expense
    FROM transactions
    WHERE type = 'expense'
      AND date >= date('now', '-6 months')
    GROUP BY month
  )) AS avg_monthly_expense,

  CASE WHEN (SELECT COALESCE(AVG(monthly_expense), 0) FROM (
    SELECT strftime('%Y-%m', date) AS month,
           SUM(amount) AS monthly_expense
    FROM transactions
    WHERE type = 'expense'
      AND date >= date('now', '-6 months')
    GROUP BY month
  )) > 0
  THEN
    ROUND(
      SUM(CASE WHEN account_type IN ('bank', 'cash', 'e_payment')
        THEN cash_balance ELSE 0 END) /
      (SELECT AVG(monthly_expense) FROM (
        SELECT strftime('%Y-%m', date) AS month,
               SUM(amount) AS monthly_expense
        FROM transactions
        WHERE type = 'expense'
          AND date >= date('now', '-6 months')
        GROUP BY month
      )),
      1
    )
  ELSE NULL END AS emergency_fund_months,

  CASE WHEN SUM(total_value) > 0
  THEN ROUND(
    SUM(CASE WHEN account_type = 'investment'
      THEN holdings_value ELSE 0 END) * 100.0 / SUM(total_value),
    1
  ) ELSE 0 END AS risk_asset_ratio

FROM v_assets_summary;
`

/** All view DDL statements in creation order */
export const ALL_VIEWS = [
  VIEW_ASSETS_SUMMARY,
  VIEW_ACCOUNT_BALANCES,
  VIEW_FINANCIAL_HEALTH_CHECK,
]
