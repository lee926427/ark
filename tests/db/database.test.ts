import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import initSqlJs, { type Database } from 'sql.js'
import { runMigrations, getSchemaVersion } from '@/lib/db/migrations'
import { AccountRepository } from '@/lib/db/repositories/accounts'
import { TransactionRepository } from '@/lib/db/repositories/transactions'
import { HoldingRepository } from '@/lib/db/repositories/holdings'

let db: Database

beforeEach(async () => {
  const SQL = await initSqlJs()
  db = new SQL.Database()
  db.run('PRAGMA foreign_keys = ON')
  runMigrations(db)
})

afterEach(() => {
  db.close()
})

// ========================================
// Migration Tests
// ========================================

describe('Migrations', () => {
  it('should migrate from version 0 to latest', async () => {
    const SQL = await initSqlJs()
    const freshDb = new SQL.Database()
    expect(getSchemaVersion(freshDb)).toBe(0)
    runMigrations(freshDb)
    expect(getSchemaVersion(freshDb)).toBe(1)
    freshDb.close()
  })

  it('should not re-run migrations on up-to-date database', () => {
    const versionBefore = getSchemaVersion(db)
    runMigrations(db)
    expect(getSchemaVersion(db)).toBe(versionBefore)
  })

  it('should create all 8 tables', () => {
    const tables = db.exec(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
    )
    const tableNames = tables[0].values.map((row: any[]) => row[0]) as string[]
    expect(tableNames).toContain('accounts')
    expect(tableNames).toContain('categories')
    expect(tableNames).toContain('transactions')
    expect(tableNames).toContain('securities')
    expect(tableNames).toContain('holdings')
    expect(tableNames).toContain('insurance_policies')
    expect(tableNames).toContain('budgets')
    expect(tableNames).toContain('sync_log')
  })

  it('should create all 3 views', () => {
    const views = db.exec("SELECT name FROM sqlite_master WHERE type='view'")
    const viewNames = views[0].values.map((row: any[]) => row[0]) as string[]
    expect(viewNames).toContain('v_assets_summary')
    expect(viewNames).toContain('v_account_balances')
    expect(viewNames).toContain('v_financial_health_check')
  })
})

// ========================================
// AccountRepository Tests
// ========================================

describe('AccountRepository', () => {
  let repo: AccountRepository

  beforeEach(() => {
    repo = new AccountRepository(db)
  })

  it('should create an account', () => {
    const account = repo.create({ name: '台新銀行', type: 'bank' })
    expect(account.name).toBe('台新銀行')
    expect(account.type).toBe('bank')
    expect(account.currency).toBe('TWD')
    expect(account.is_archived).toBe(0)
    expect(account.id).toBeTruthy()
  })

  it('should update an account', () => {
    const account = repo.create({ name: '台新銀行', type: 'bank' })
    const updated = repo.update(account.id, { name: '台新 Richart' })
    expect(updated.name).toBe('台新 Richart')
    expect(updated.type).toBe('bank')
  })

  it('should get account by id', () => {
    const account = repo.create({ name: '現金', type: 'cash' })
    const found = repo.getById(account.id)
    expect(found).not.toBeNull()
    expect(found!.name).toBe('現金')
  })

  it('should return null for non-existing id', () => {
    expect(repo.getById('nonexistent')).toBeNull()
  })

  it('should archive an account', () => {
    const account = repo.create({ name: '舊帳戶', type: 'bank' })
    repo.archive(account.id)
    const found = repo.getById(account.id)
    expect(found!.is_archived).toBe(1)
  })

  it('should exclude archived accounts from default list', () => {
    repo.create({ name: '活躍帳戶', type: 'bank' })
    const archived = repo.create({ name: '已封存', type: 'bank' })
    repo.archive(archived.id)

    const list = repo.list()
    expect(list).toHaveLength(1)
    expect(list[0].name).toBe('活躍帳戶')
  })

  it('should include archived accounts when requested', () => {
    repo.create({ name: '活躍帳戶', type: 'bank' })
    const archived = repo.create({ name: '已封存', type: 'bank' })
    repo.archive(archived.id)

    const list = repo.list({ includeArchived: true })
    expect(list).toHaveLength(2)
  })
})

// ========================================
// TransactionRepository Tests
// ========================================

describe('TransactionRepository', () => {
  let txRepo: TransactionRepository
  let accountId: string

  beforeEach(() => {
    txRepo = new TransactionRepository(db)
    const accountRepo = new AccountRepository(db)
    const account = accountRepo.create({ name: '銀行帳戶', type: 'bank' })
    accountId = account.id
  })

  it('should create a transaction', () => {
    const tx = txRepo.create({
      type: 'income',
      amount: 50000,
      account_id: accountId,
      date: '2026-03-01',
    })
    expect(tx.type).toBe('income')
    expect(tx.amount).toBe(50000)
    expect(tx.currency).toBe('TWD')
  })

  it('should update a transaction', () => {
    const tx = txRepo.create({
      type: 'expense',
      amount: 100,
      account_id: accountId,
      date: '2026-03-01',
    })
    const updated = txRepo.update(tx.id, { amount: 200 })
    expect(updated.amount).toBe(200)
  })

  it('should delete a transaction', () => {
    const tx = txRepo.create({
      type: 'expense',
      amount: 100,
      account_id: accountId,
      date: '2026-03-01',
    })
    txRepo.delete(tx.id)
    expect(txRepo.getById(tx.id)).toBeNull()
  })

  it('should list transactions by date range', () => {
    txRepo.create({
      type: 'expense',
      amount: 100,
      account_id: accountId,
      date: '2026-02-15',
    })
    txRepo.create({
      type: 'expense',
      amount: 200,
      account_id: accountId,
      date: '2026-03-10',
    })
    txRepo.create({
      type: 'expense',
      amount: 300,
      account_id: accountId,
      date: '2026-04-01',
    })

    const marchTxs = txRepo.listByDate('2026-03-01', '2026-03-31')
    expect(marchTxs).toHaveLength(1)
    expect(marchTxs[0].amount).toBe(200)
  })

  it('should list transactions by account', () => {
    const accountRepo = new AccountRepository(db)
    const account2 = accountRepo.create({ name: '另一帳戶', type: 'cash' })

    txRepo.create({
      type: 'expense',
      amount: 100,
      account_id: accountId,
      date: '2026-03-01',
    })
    txRepo.create({
      type: 'expense',
      amount: 200,
      account_id: account2.id,
      date: '2026-03-01',
    })

    const txs = txRepo.listByAccount(accountId)
    expect(txs).toHaveLength(1)
    expect(txs[0].amount).toBe(100)
  })
})

// ========================================
// View Tests
// ========================================

describe('Views', () => {
  it('v_account_balances should return 0 for empty account', () => {
    const accountRepo = new AccountRepository(db)
    accountRepo.create({ name: '空帳戶', type: 'bank' })

    const result = db.exec('SELECT * FROM v_account_balances')
    expect(result).toHaveLength(1)
    const row = result[0]
    const balanceIdx = row.columns.indexOf('balance')
    expect(row.values[0][balanceIdx]).toBe(0)
  })

  it('v_account_balances should compute income - expense', () => {
    const accountRepo = new AccountRepository(db)
    const txRepo = new TransactionRepository(db)

    const account = accountRepo.create({ name: '銀行', type: 'bank' })
    txRepo.create({
      type: 'income',
      amount: 50000,
      account_id: account.id,
      date: '2026-03-01',
    })
    txRepo.create({
      type: 'expense',
      amount: 5000,
      account_id: account.id,
      date: '2026-03-02',
    })

    const result = db.exec(
      'SELECT balance FROM v_account_balances WHERE id = ?',
      [account.id],
    )
    expect(result[0].values[0][0]).toBe(45000)
  })

  it('v_account_balances should handle transfers correctly', () => {
    const accountRepo = new AccountRepository(db)
    const txRepo = new TransactionRepository(db)

    const a1 = accountRepo.create({ name: '帳戶A', type: 'bank' })
    const a2 = accountRepo.create({ name: '帳戶B', type: 'bank' })

    txRepo.create({
      type: 'income',
      amount: 10000,
      account_id: a1.id,
      date: '2026-03-01',
    })
    txRepo.create({
      type: 'transfer',
      amount: 3000,
      account_id: a1.id,
      to_account_id: a2.id,
      date: '2026-03-02',
    })

    const res = db.exec(
      'SELECT id, balance FROM v_account_balances ORDER BY name',
    )
    const balances = Object.fromEntries(
      res[0].values.map((r: any[]) => [r[0], r[1]]),
    )
    expect(balances[a1.id]).toBe(7000)
    expect(balances[a2.id]).toBe(3000)
  })

  it('v_assets_summary should return 0 for empty account', () => {
    const accountRepo = new AccountRepository(db)
    accountRepo.create({ name: '空帳戶', type: 'bank' })

    const result = db.exec('SELECT total_value FROM v_assets_summary')
    expect(result[0].values[0][0]).toBe(0)
  })

  it('v_financial_health_check should return null emergency_fund_months when no expenses', () => {
    const accountRepo = new AccountRepository(db)
    const txRepo = new TransactionRepository(db)

    const account = accountRepo.create({ name: '銀行', type: 'bank' })
    txRepo.create({
      type: 'income',
      amount: 100000,
      account_id: account.id,
      date: '2026-03-01',
    })

    const result = db.exec(
      'SELECT emergency_fund_months FROM v_financial_health_check',
    )
    expect(result[0].values[0][0]).toBeNull()
  })
})

// ========================================
// HoldingRepository Tests
// ========================================

describe('HoldingRepository', () => {
  let holdingRepo: HoldingRepository
  let accountId: string
  const securityId = 'sec1'

  beforeEach(() => {
    holdingRepo = new HoldingRepository(db)
    const accountRepo = new AccountRepository(db)
    const account = accountRepo.create({ name: '投資帳戶', type: 'investment' })
    accountId = account.id

    db.run(
      "INSERT INTO securities (id, symbol, name, type, currency, last_price, price_updated) VALUES ('sec1', '0050', '元大台灣50', 'etf', 'TWD', 150.5, datetime('now'))",
    )
  })

  it('should create a holding', () => {
    const holding = holdingRepo.create({
      account_id: accountId,
      security_id: securityId,
      units: 100,
      avg_cost: 140.0,
    })
    expect(holding.units).toBe(100)
    expect(holding.avg_cost).toBe(140)
  })

  it('should list holdings with security info', () => {
    holdingRepo.create({
      account_id: accountId,
      security_id: securityId,
      units: 100,
      avg_cost: 140.0,
    })

    const holdings = holdingRepo.listByAccount(accountId)
    expect(holdings).toHaveLength(1)
    expect(holdings[0].security_name).toBe('元大台灣50')
    expect(holdings[0].symbol).toBe('0050')
    expect(holdings[0].market_value).toBe(100 * 150.5)
  })

  it('should update a holding', () => {
    const holding = holdingRepo.create({
      account_id: accountId,
      security_id: securityId,
      units: 100,
      avg_cost: 140.0,
    })
    const updated = holdingRepo.update(holding.id, { units: 200 })
    expect(updated.units).toBe(200)
  })

  it('should delete a holding', () => {
    const holding = holdingRepo.create({
      account_id: accountId,
      security_id: securityId,
      units: 100,
      avg_cost: 140.0,
    })
    holdingRepo.delete(holding.id)
    expect(holdingRepo.getById(holding.id)).toBeNull()
  })
})
