import type { Database } from 'sql.js'
import { SCHEMA_DDL, SCHEMA_VERSION } from '@/lib/db/schema'
import { ALL_VIEWS } from '@/lib/db/views'

/**
 * Migration definition
 */
interface Migration {
  version: number
  description: string
  sql: string
}

/**
 * All migrations in sequential order.
 * Each migration brings the DB from version N-1 to version N.
 */
const MIGRATIONS: Migration[] = [
  {
    version: 1,
    description: 'Initial schema: 8 tables + indexes + 3 views',
    sql: SCHEMA_DDL + '\n' + ALL_VIEWS.join('\n'),
  },
]

/**
 * Get the current schema version from the database.
 */
export function getSchemaVersion(db: Database): number {
  const result = db.exec('PRAGMA user_version')
  if (result.length === 0 || result[0].values.length === 0) return 0
  return result[0].values[0][0] as number
}

/**
 * Run all pending migrations.
 * Migrations are applied in order within transactions.
 * On failure, the transaction is rolled back and the version remains unchanged.
 */
export function runMigrations(db: Database): void {
  const currentVersion = getSchemaVersion(db)

  const pendingMigrations = MIGRATIONS.filter((m) => m.version > currentVersion)

  for (const migration of pendingMigrations) {
    try {
      db.run('BEGIN TRANSACTION')
      db.run(migration.sql)
      db.run('PRAGMA user_version = ' + migration.version)
      db.run('COMMIT')
    } catch (error) {
      db.run('ROLLBACK')
      const msg = error instanceof Error ? error.message : String(error)
      throw new Error(
        'Migration to version ' +
          migration.version +
          ' failed (' +
          migration.description +
          '): ' +
          msg,
      )
    }
  }
}

/** The target schema version */
export { SCHEMA_VERSION }
