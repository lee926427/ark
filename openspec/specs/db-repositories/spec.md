# db-repositories Specification

## Purpose
TBD - created by archiving change sqlite-foundation. Update Purpose after archive.
## Requirements
### Requirement: Type-safe CRUD operations

Each repository SHALL provide create, read, update, and delete methods that accept and return TypeScript-typed objects matching the table schema.

#### Scenario: Create an account

- **WHEN** `AccountRepository.create({ name: "台新銀行", type: "bank" })` is called
- **THEN** a new row SHALL be inserted with auto-generated id and timestamps, and the created object SHALL be returned

#### Scenario: Update a transaction

- **WHEN** `TransactionRepository.update(id, { amount: 500 })` is called
- **THEN** the row SHALL be updated with new amount and `updated_at` SHALL be refreshed

### Requirement: AccountRepository specific operations

AccountRepository SHALL provide `archive(id)` to soft-delete and `list({ includeArchived })` to filter.

#### Scenario: Archive an account

- **WHEN** `AccountRepository.archive(id)` is called
- **THEN** `is_archived` SHALL be set to 1 and the account SHALL not appear in default `list()` results

### Requirement: TransactionRepository query methods

TransactionRepository SHALL provide `listByDate(startDate, endDate)` and `listByAccount(accountId)` with pagination support.

#### Scenario: Query transactions by date range

- **WHEN** `listByDate("2026-03-01", "2026-03-31")` is called
- **THEN** only transactions within that date range SHALL be returned, ordered by date DESC

### Requirement: HoldingRepository with security join

HoldingRepository SHALL provide `listByAccount(accountId)` that joins with securities table to include current price and symbol.

#### Scenario: List holdings with prices

- **WHEN** `HoldingRepository.listByAccount(accountId)` is called
- **THEN** each holding SHALL include `security_name`, `symbol`, `last_price`, and computed `market_value`

### Requirement: BudgetRepository active budget queries

BudgetRepository SHALL provide `getActive()` to return current period budgets with spent amounts.

#### Scenario: Get active monthly budget

- **WHEN** a monthly budget exists for the current month
- **THEN** `getActive()` SHALL return the budget with `spent` computed from matching expense transactions

