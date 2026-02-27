import type { Database } from '@/lib/db/client'
import type {
  InsurancePolicy,
  CreateInsurancePolicy,
  UpdateInsurancePolicy,
} from '@/lib/db/types'

function generateId(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export class InsuranceRepository {
  constructor(private db: Database) {}

  create(data: CreateInsurancePolicy): InsurancePolicy {
    const id = generateId()
    const now = new Date().toISOString()
    this.db.run(
      'INSERT INTO insurance_policies (id, account_id, policy_name, insurer, type, premium, premium_freq, sum_assured, cash_value, linked_fund_id, start_date, maturity_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        data.account_id,
        data.policy_name,
        data.insurer ?? null,
        data.type ?? null,
        data.premium ?? null,
        data.premium_freq ?? null,
        data.sum_assured ?? null,
        data.cash_value ?? null,
        data.linked_fund_id ?? null,
        data.start_date ?? null,
        data.maturity_date ?? null,
        now,
        now,
      ],
    )
    return this.getById(id)!
  }

  update(id: string, data: UpdateInsurancePolicy): InsurancePolicy {
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
      'UPDATE insurance_policies SET ' + sets.join(', ') + ' WHERE id = ?',
      values,
    )
    return this.getById(id)!
  }

  getById(id: string): InsurancePolicy | null {
    const stmt = this.db.prepare(
      'SELECT * FROM insurance_policies WHERE id = ?',
    )
    stmt.bind([id])
    const result = stmt.step()
      ? (stmt.getAsObject() as unknown as InsurancePolicy)
      : null
    stmt.free()
    return result
  }

  listByAccount(accountId: string): InsurancePolicy[] {
    const stmt = this.db.prepare(
      'SELECT * FROM insurance_policies WHERE account_id = ? ORDER BY policy_name',
    )
    stmt.bind([accountId])
    const results: InsurancePolicy[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject() as unknown as InsurancePolicy)
    }
    stmt.free()
    return results
  }
}
