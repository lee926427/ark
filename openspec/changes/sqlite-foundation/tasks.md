## Tasks

### 1. Setup sql.js WASM engine

- [ ] Install `sql.js` dependency: `pnpm add sql.js`
- [ ] Configure Vite to handle WASM files (add `optimizeDeps.exclude` and `assetsInclude` in `vite.config.ts`)
- [ ] Create `src/lib/db/client.ts` with lazy singleton `getDB()` and `closeDB()`
- [ ] Implement OPFS persistence layer with fallback detection
- [ ] Verify WASM loads correctly in dev server

**Specs**: sqlite-client

### 2. Define database schema and migrations

- [ ] Create `src/lib/db/types.ts` with all entity TypeScript types (Account, Category, Transaction, Security, Holding, InsurancePolicy, Budget, SyncLog)
- [ ] Create `src/lib/db/schema.ts` with all 8 CREATE TABLE DDL statements and indexes
- [ ] Create `src/lib/db/migrations.ts` with version-based migration runner using `PRAGMA user_version`
- [ ] Wire migrations into `getDB()` initialization flow

**Specs**: db-schema

### 3. Implement SQLite Views

- [ ] Create `src/lib/db/views.ts` with 3 CREATE VIEW statements
- [ ] `v_assets_summary`: join accounts + transactions (balance) + holdings (market value) + insurance (cash value)
- [ ] `v_account_balances`: accounts + transactions with bi-directional transfer handling
- [ ] `v_financial_health_check`: aggregate metrics from v_assets_summary + 6-month expense average

**Specs**: db-views

### 4. Build Repository layer

- [ ] Create `src/lib/db/repositories/accounts.ts` — create, update, archive, list, getById
- [ ] Create `src/lib/db/repositories/transactions.ts` — create, update, delete, listByDate, listByAccount
- [ ] Create `src/lib/db/repositories/holdings.ts` — create, update, delete, listByAccount (with security join)
- [ ] Create `src/lib/db/repositories/budgets.ts` — create, update, getByCategory, getActive (with spent calc)
- [ ] Create `src/lib/db/repositories/insurance.ts` — create, update, listByAccount
- [ ] Create barrel export `src/lib/db/index.ts`

**Specs**: db-repositories

### 5. Write unit tests

- [ ] Test migrations: fresh init, re-run, intermediate version, failure rollback
- [ ] Test AccountRepository: CRUD, archive, list filtering
- [ ] Test TransactionRepository: CRUD, date range queries, account filtering
- [ ] Test HoldingRepository: CRUD, security join with prices
- [ ] Test BudgetRepository: active budget with spent calculation
- [ ] Test v_assets_summary: with/without data, transfer balance correctness
- [ ] Test v_account_balances: income/expense/transfer scenarios
- [ ] Test v_financial_health_check: emergency fund months, risk ratio, no-data edge case

**Specs**: sqlite-client, db-schema, db-views, db-repositories
