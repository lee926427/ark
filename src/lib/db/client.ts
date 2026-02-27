import initSqlJs, { type Database } from 'sql.js'
import { runMigrations } from '@/lib/db/migrations'

let dbInstance: Database | null = null
let initPromise: Promise<Database> | null = null

/**
 * Get the SQLite database instance (lazy singleton).
 * On first call, initializes sql.js WASM and runs migrations.
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
  // Load existing data from persistence (if available)
  const savedData = await loadFromPersistence()

  // Initialize sql.js WASM
  const SQL = await initSqlJs({
    locateFile: (file: string) => 'https://sql.js.org/dist/' + file,
  })

  // Create database (from saved data or fresh)
  const db = savedData ? new SQL.Database(savedData) : new SQL.Database()

  // Enable WAL mode for better performance
  db.run('PRAGMA journal_mode = WAL')
  db.run('PRAGMA foreign_keys = ON')

  // Run pending migrations
  runMigrations(db)

  // Persist after migrations
  await saveToPersistence(db)

  return db
}

/**
 * Close the database and release WASM resources.
 * After closing, the next getDB() call will re-initialize.
 */
export async function closeDB(): Promise<void> {
  if (dbInstance) {
    await saveToPersistence(dbInstance)
    dbInstance.close()
    dbInstance = null
  }
}

/**
 * Persist the current database state.
 * Call after batch writes to ensure durability.
 */
export async function persistDB(): Promise<void> {
  if (dbInstance) {
    await saveToPersistence(dbInstance)
  }
}

// ========================================
// Persistence Layer (OPFS with fallback)
// ========================================

const DB_FILE_NAME = 'arkark.db'
const IDB_STORE_NAME = 'arkark-db'

/**
 * Check if OPFS is available in the current browser.
 */
function isOPFSAvailable(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    'storage' in navigator &&
    'getDirectory' in (navigator.storage || {})
  )
}

/**
 * Save database to OPFS (preferred) or IndexedDB (fallback).
 */
async function saveToPersistence(db: Database): Promise<void> {
  const data = db.export()
  const uint8Array = new Uint8Array(data)

  if (isOPFSAvailable()) {
    try {
      const root = await navigator.storage.getDirectory()
      const fileHandle = await root.getFileHandle(DB_FILE_NAME, {
        create: true,
      })
      const writable = await fileHandle.createWritable()
      await writable.write(uint8Array)
      await writable.close()
      return
    } catch {
      // Fall through to IndexedDB
    }
  }

  // IndexedDB fallback
  await saveToIndexedDB(uint8Array)
}

/**
 * Load database from OPFS (preferred) or IndexedDB (fallback).
 */
async function loadFromPersistence(): Promise<Uint8Array | null> {
  if (isOPFSAvailable()) {
    try {
      const root = await navigator.storage.getDirectory()
      const fileHandle = await root.getFileHandle(DB_FILE_NAME)
      const file = await fileHandle.getFile()
      const buffer = await file.arrayBuffer()
      return new Uint8Array(buffer)
    } catch {
      // File doesn't exist or OPFS error, try IndexedDB
    }
  }

  return loadFromIndexedDB()
}

// ========================================
// IndexedDB Helpers
// ========================================

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(IDB_STORE_NAME, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore('data')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function saveToIndexedDB(data: Uint8Array): Promise<void> {
  const idb = await openIDB()
  return new Promise((resolve, reject) => {
    const tx = idb.transaction('data', 'readwrite')
    tx.objectStore('data').put(data, 'db')
    tx.oncomplete = () => {
      idb.close()
      resolve()
    }
    tx.onerror = () => {
      idb.close()
      reject(tx.error)
    }
  })
}

async function loadFromIndexedDB(): Promise<Uint8Array | null> {
  try {
    const idb = await openIDB()
    return new Promise((resolve, reject) => {
      const tx = idb.transaction('data', 'readonly')
      const request = tx.objectStore('data').get('db')
      request.onsuccess = () => {
        idb.close()
        resolve(request.result ?? null)
      }
      request.onerror = () => {
        idb.close()
        reject(request.error)
      }
    })
  } catch {
    return null
  }
}
