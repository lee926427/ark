import type { Database } from '@/lib/db/client'
import type {
  Budget,
  CreateBudget,
  UpdateBudget,
  BudgetWithSpent,
} from '@/lib/db/types'

function generateId(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export class BudgetRepository {
  constructor(private db: Database) {}

  create(data: CreateBudget): Budget {
    const id = generateId()
    const now = new Date().toISOString()
    this.db.run(
      'INSERT INTO budgets (id, category_id, amount, period, start_date, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [
        id,
        data.category_id ?? null,
        data.amount,
        data.period,
        data.start_date,
        now,
      ],
    )
    return this.getById(id)!
  }

  update(id: string, data: UpdateBudget): Budget {
    const sets: string[] = []
    const values: (string | number | null)[] = []

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        sets.push(key + ' = ?')
        values.push(value as string | number | null)
      }
    }

    if (sets.length === 0) return this.getById(id)!
    values.push(id)

    this.db.run(
      'UPDATE budgets SET ' + sets.join(', ') + ' WHERE id = ?',
      values,
    )
    return this.getById(id)!
  }

  getById(id: string): Budget | null {
    const stmt = this.db.prepare('SELECT * FROM budgets WHERE id = ?')
    stmt.bind([id])
    const result = stmt.step()
      ? (stmt.getAsObject() as unknown as Budget)
      : null
    stmt.free()
    return result
  }

  getByCategory(categoryId: string): Budget[] {
    const stmt = this.db.prepare(
      'SELECT * FROM budgets WHERE category_id = ? ORDER BY start_date DESC',
    )
    stmt.bind([categoryId])
    const results: Budget[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject() as unknown as Budget)
    }
    stmt.free()
    return results
  }

  getActive(): BudgetWithSpent[] {
    const stmt = this.db.prepare(
      "SELECT b.*, c.name AS category_name, COALESCE(spent.total, 0) AS spent, b.amount - COALESCE(spent.total, 0) AS remaining FROM budgets b LEFT JOIN categories c ON c.id = b.category_id LEFT JOIN (SELECT t.category_id, SUM(t.amount) AS total FROM transactions t WHERE t.type = 'expense' AND t.date >= date('now', 'start of month') GROUP BY t.category_id) spent ON spent.category_id = b.category_id WHERE b.start_date <= date('now') ORDER BY b.amount DESC",
    )
    const results: BudgetWithSpent[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject() as unknown as BudgetWithSpent)
    }
    stmt.free()
    return results
  }
}
