import sqlite3InitModule from '@sqlite.org/sqlite-wasm'
import { runMigrations } from '@/lib/db/migrations'

// A wrapper class to bridge `sql.js` API to `@sqlite.org/sqlite-wasm` API.
// This allows us to keep the repositories and migrations unchanged.
export class DbFacade {
  constructor(private db: any) {}

  exec(sql: string, params?: unknown[]): any[] {
    const columnNames: string[] = []
    const execOpts: any = {
      sql,
      returnValue: 'resultRows',
      rowMode: 'array',
      columnNames,
    }
    if (params && params.length > 0) {
      execOpts.bind = params
    }
    const resultRows = this.db.exec(execOpts)
    if (resultRows.length === 0) return []
    return [{ columns: columnNames, values: resultRows }]
  }

  run(sql: string, params?: unknown[]): void {
    if (params && params.length > 0) {
      this.db.exec({ sql, bind: params })
    } else {
      this.db.exec(sql)
    }
  }

  prepare(sql: string) {
    const stmt = this.db.prepare(sql)
    return {
      bind: (params: unknown[]) => stmt.bind(params),
      step: () => stmt.step(),
      getAsObject: () => stmt.get({}),
      free: () => stmt.finalize(),
    }
  }

  close(): void {
    this.db.close()
  }

  export(): Uint8Array {
    // With OPFS, manual export/persist is no longer needed.
    // Return empty array just to satisfy any legacy signatures if any.
    return new Uint8Array()
  }
}

// Export DbFacade as Database for the rest of the application
export type Database = DbFacade

let dbInstance: Database | null = null
let initPromise: Promise<Database> | null = null

/**
 * Get the SQLite database instance (lazy singleton).
 * On first call, initializes sqlite-wasm and runs migrations.
 * Subsequent calls return the same instance.
 */
export async function getDB(): Promise<Database> {
  if (dbInstance) return dbInstance

  if (initPromise) return initPromise

  initPromise = initializeDB()
  try {
    dbInstance = await initPromise
    return dbInstance
  } finally {
    initPromise = null
  }
}

async function initializeDB(): Promise<Database> {
  // Initialize sqlite3 WASM module
  // @ts-ignore - The types from @sqlite.org/sqlite-wasm are not exporting the correct options interface for init
  const sqlite3 = await sqlite3InitModule({
    locateFile: (file: string) => `/${file}`,
  })

  let rawDb: any

  // Try to use OPFS for persistent storage in browser
  if (sqlite3.oo1.OpfsDb) {
    try {
      rawDb = new sqlite3.oo1.OpfsDb('/arkark.sqlite3')
      console.log('SQL: OPFS database opened successfully.')
    } catch (e) {
      console.error(
        'SQL: Failed to open OPFS database, falling back to memory DB.',
        e,
      )
      rawDb = new sqlite3.oo1.DB('/arkark-fallback.sqlite3', 'c')
    }
  } else {
    console.log(
      'SQL: OPFS not supported in this environment, using transient memory DB.',
    )
    rawDb = new sqlite3.oo1.DB('/arkark-transient.sqlite3', 'c')
  }

  const db = new DbFacade(rawDb)

  // Enable WAL mode for better performance
  db.exec('PRAGMA journal_mode = WAL')
  db.exec('PRAGMA foreign_keys = ON')

  // Run pending migrations
  runMigrations(db)

  return db
}

/**
 * Close the database and release resources.
 */
export async function closeDB(): Promise<void> {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

/**
 * Persist the current database state.
 * With OPFS in sqlite-wasm, persistence is automatic for every statement.
 * This is just a no-op for backward compatibility.
 */
export async function persistDB(): Promise<void> {
  // SQLite WASM OPFS VFS handles durability automatically out of the box.
}
