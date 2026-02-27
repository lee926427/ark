## Tasks

### 1. Setup sql.js WASM engine

- [x] Install `sql.js` dependency: `pnpm add sql.js`
- [x] Configure Vite to handle WASM files (add `optimizeDeps.exclude` and `assetsInclude` in `vite.config.ts`)
- [x] Create `src/lib/db/client.ts` with lazy singleton `getDB()` and `closeDB()`
- [x] Implement OPFS persistence layer with fallback detection
- [x] Verify WASM loads correctly in dev server

**Specs**: sqlite-client

### 2. Define database schema and migrations

- [x] Create `src/lib/db/types.ts` with all entity TypeScript types (Account, Category, Transaction, Security, Holding, InsurancePolicy, Budget, SyncLog)
- [x] Create `src/lib/db/schema.ts` with all 8 CREATE TABLE DDL statements and indexes
- [x] Create `src/lib/db/migrations.ts` with version-based migration runner using `PRAGMA user_version`
- [x] Wire migrations into `getDB()` initialization flow

**Specs**: db-schema

### 3. Implement SQLite Views

- [x] Create `src/lib/db/views.ts` with 3 CREATE VIEW statements
- [x] `v_assets_summary`: join accounts + transactions (balance) + holdings (market value) + insurance (cash value)
- [x] `v_account_balances`: accounts + transactions with bi-directional transfer handling
- [x] `v_financial_health_check`: aggregate metrics from v_assets_summary + 6-month expense average

**Specs**: db-views

### 4. Build Repository layer

- [x] Create `src/lib/db/repositories/accounts.ts` — create, update, archive, list, getById
- [x] Create `src/lib/db/repositories/transactions.ts` — create, update, delete, listByDate, listByAccount
- [x] Create `src/lib/db/repositories/holdings.ts` — create, update, delete, listByAccount (with security join)
- [x] Create `src/lib/db/repositories/budgets.ts` — create, update, getByCategory, getActive (with spent calc)
- [x] Create `src/lib/db/repositories/insurance.ts` — create, update, listByAccount
- [x] Create barrel export `src/lib/db/index.ts`

**Specs**: db-repositories

### 5. Write unit tests

- [x] Test migrations: fresh init, re-run, intermediate version, failure rollback
- [x] Test AccountRepository: CRUD, archive, list filtering
- [x] Test TransactionRepository: CRUD, date range queries, account filtering
- [x] Test HoldingRepository: CRUD, security join with prices
- [x] Test BudgetRepository: active budget with spent calculation
- [x] Test v_assets_summary: with/without data, transfer balance correctness
- [x] Test v_account_balances: income/expense/transfer scenarios
- [x] Test v_financial_health_check: emergency fund months, risk ratio, no-data edge case

**Specs**: sqlite-client, db-schema, db-views, db-repositories
