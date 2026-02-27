import type { Database } from 'sql.js'
import type { Account, CreateAccount, UpdateAccount } from '@/lib/db/types'

function generateId(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export class AccountRepository {
  constructor(private db: Database) {}

  create(data: CreateAccount): Account {
    const id = generateId()
    const now = new Date().toISOString()
    this.db.run(
      'INSERT INTO accounts (id, name, type, currency, institution, icon, color, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        data.name,
        data.type,
        data.currency ?? 'TWD',
        data.institution ?? null,
        data.icon ?? null,
        data.color ?? null,
        data.sort_order ?? 0,
        now,
        now,
      ],
    )
    return this.getById(id)!
  }

  update(id: string, data: UpdateAccount): Account {
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
      'UPDATE accounts SET ' + sets.join(', ') + ' WHERE id = ?',
      values,
    )
    return this.getById(id)!
  }

  archive(id: string): void {
    this.db.run(
      'UPDATE accounts SET is_archived = 1, updated_at = ? WHERE id = ?',
      [new Date().toISOString(), id],
    )
  }

  list(options?: { includeArchived?: boolean }): Account[] {
    const where = options?.includeArchived ? '' : 'WHERE is_archived = 0'
    const stmt = this.db.prepare(
      'SELECT * FROM accounts ' + where + ' ORDER BY sort_order, name',
    )
    const results: Account[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject() as unknown as Account)
    }
    stmt.free()
    return results
  }

  getById(id: string): Account | null {
    const stmt = this.db.prepare('SELECT * FROM accounts WHERE id = ?')
    stmt.bind([id])
    const result = stmt.step()
      ? (stmt.getAsObject() as unknown as Account)
      : null
    stmt.free()
    return result
  }
}
