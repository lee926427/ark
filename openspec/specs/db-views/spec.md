# db-views Specification

## Purpose
TBD - created by archiving change sqlite-foundation. Update Purpose after archive.
## Requirements
### Requirement: v_assets_summary provides per-account totals

The view SHALL return each non-archived account with its cash balance, holdings market value, unrealized P&L, insurance value, and total value.

#### Scenario: Account with transactions and holdings

- **WHEN** an account has income/expense transactions and holdings with updated prices
- **THEN** the view SHALL return correct cash_balance (from transactions), holdings_value (units × last_price), and total_value (sum of all)

#### Scenario: Account with no activity

- **WHEN** an account has no transactions, holdings, or insurance
- **THEN** the view SHALL return 0 for all value columns

### Requirement: v_account_balances provides running balances

The view SHALL calculate each account's balance from the sum of its transactions, correctly handling income, expense, and bi-directional transfers.

#### Scenario: Transfer between accounts

- **WHEN** a transfer of $1000 is made from account A to account B
- **THEN** account A balance SHALL decrease by $1000 and account B balance SHALL increase by $1000

### Requirement: v_financial_health_check provides aggregate metrics

The view SHALL compute total_assets, liquid_cash, risk_assets, net_worth, avg_monthly_expense, emergency_fund_months, and risk_asset_ratio.

#### Scenario: Standard financial data

- **WHEN** user has bank accounts, investment holdings, and 6 months of expense data
- **THEN** emergency_fund_months SHALL equal liquid_cash / avg_monthly_expense (rounded to 1 decimal)

#### Scenario: No expense data

- **WHEN** no expense transactions exist
- **THEN** avg_monthly_expense SHALL be 0 and emergency_fund_months SHALL be NULL

