import type { Database } from '@/lib/db/client'
import type {
  Transaction,
  CreateTransaction,
  UpdateTransaction,
} from '@/lib/db/types'

function generateId(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export class TransactionRepository {
  constructor(private db: Database) {}

  create(data: CreateTransaction): Transaction {
    const id = generateId()
    const now = new Date().toISOString()
    this.db.run(
      'INSERT INTO transactions (id, type, amount, currency, account_id, to_account_id, category_id, note, date, time, tags, receipt_uri, is_recurring, recurrence, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        data.type,
        data.amount,
        data.currency ?? 'TWD',
        data.account_id,
        data.to_account_id ?? null,
        data.category_id ?? null,
        data.note ?? null,
        data.date,
        data.time ?? null,
        data.tags ?? null,
        data.receipt_uri ?? null,
        data.is_recurring ?? 0,
        data.recurrence ?? null,
        now,
        now,
      ],
    )
    return this.getById(id)!
  }

  update(id: string, data: UpdateTransaction): Transaction {
    const sets: string[] = []
    const values: (string | number | null)[] = []

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        sets.push(key + ' = ?')
        values.push(value as string | number | null)
      }
    }

    if (sets.length === 0) return this.getById(id)!

    sets.push('updated_at = ?')
    values.push(new Date().toISOString())
    values.push(id)

    this.db.run(
      'UPDATE transactions SET ' + sets.join(', ') + ' WHERE id = ?',
      values,
    )
    return this.getById(id)!
  }

  delete(id: string): void {
    this.db.run('DELETE FROM transactions WHERE id = ?', [id])
  }

  getById(id: string): Transaction | null {
    const stmt = this.db.prepare('SELECT * FROM transactions WHERE id = ?')
    stmt.bind([id])
    const result = stmt.step()
      ? (stmt.getAsObject() as unknown as Transaction)
      : null
    stmt.free()
    return result
  }

  listByDate(
    startDate: string,
    endDate: string,
    limit = 100,
    offset = 0,
  ): Transaction[] {
    const stmt = this.db.prepare(
      'SELECT * FROM transactions WHERE date >= ? AND date <= ? ORDER BY date DESC, time DESC LIMIT ? OFFSET ?',
    )
    stmt.bind([startDate, endDate, limit, offset])
    const results: Transaction[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject() as unknown as Transaction)
    }
    stmt.free()
    return results
  }

  listByAccount(accountId: string, limit = 100, offset = 0): Transaction[] {
    const stmt = this.db.prepare(
      'SELECT * FROM transactions WHERE account_id = ? OR to_account_id = ? ORDER BY date DESC, time DESC LIMIT ? OFFSET ?',
    )
    stmt.bind([accountId, accountId, limit, offset])
    const results: Transaction[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject() as unknown as Transaction)
    }
    stmt.free()
    return results
  }
}
