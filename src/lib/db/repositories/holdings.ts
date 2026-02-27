import type { Database } from 'sql.js'
import type {
  CreateHolding,
  UpdateHolding,
  HoldingWithSecurity,
  Holding,
} from '@/lib/db/types'

function generateId(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export class HoldingRepository {
  constructor(private db: Database) {}

  create(data: CreateHolding): Holding {
    const id = generateId()
    const now = new Date().toISOString()
    this.db.run(
      'INSERT INTO holdings (id, account_id, security_id, units, avg_cost, purchase_date, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        data.account_id,
        data.security_id,
        data.units,
        data.avg_cost,
        data.purchase_date ?? null,
        data.note ?? null,
        now,
        now,
      ],
    )
    return this.getById(id)!
  }

  update(id: string, data: UpdateHolding): Holding {
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
      'UPDATE holdings SET ' + sets.join(', ') + ' WHERE id = ?',
      values,
    )
    return this.getById(id)!
  }

  delete(id: string): void {
    this.db.run('DELETE FROM holdings WHERE id = ?', [id])
  }

  getById(id: string): Holding | null {
    const stmt = this.db.prepare('SELECT * FROM holdings WHERE id = ?')
    stmt.bind([id])
    const result = stmt.step()
      ? (stmt.getAsObject() as unknown as Holding)
      : null
    stmt.free()
    return result
  }

  listByAccount(accountId: string): HoldingWithSecurity[] {
    const stmt = this.db.prepare(
      'SELECT h.*, s.name AS security_name, s.symbol, s.type AS security_type, s.last_price, (h.units * COALESCE(s.last_price, h.avg_cost)) AS market_value FROM holdings h JOIN securities s ON s.id = h.security_id WHERE h.account_id = ? ORDER BY market_value DESC',
    )
    stmt.bind([accountId])
    const results: HoldingWithSecurity[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject() as unknown as HoldingWithSecurity)
    }
    stmt.free()
    return results
  }
}
