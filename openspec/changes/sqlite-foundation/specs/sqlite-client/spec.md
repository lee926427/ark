## ADDED Requirements

### Requirement: SQLite WASM engine initialization

The system SHALL initialize sql.js WASM engine as a lazy singleton, loading the WASM binary only on first database access.

#### Scenario: First database access

- **WHEN** any module calls `getDB()` for the first time
- **THEN** sql.js WASM binary SHALL be loaded and a new Database instance SHALL be returned

#### Scenario: Subsequent database access

- **WHEN** any module calls `getDB()` after initialization
- **THEN** the same Database instance SHALL be returned without re-loading WASM

### Requirement: OPFS persistence

The system SHALL persist SQLite database to OPFS (Origin Private File System) when available, with graceful fallback.

#### Scenario: Browser supports OPFS

- **WHEN** the browser supports OPFS
- **THEN** database writes SHALL be persisted to OPFS and survive page reloads

#### Scenario: Browser does not support OPFS

- **WHEN** the browser does not support OPFS
- **THEN** the system SHALL fall back to in-memory database with IndexedDB export

### Requirement: Database cleanup

The system SHALL provide a `closeDB()` function to release WASM resources.

#### Scenario: Close database

- **WHEN** `closeDB()` is called
- **THEN** the database SHALL be closed, resources released, and subsequent `getDB()` calls SHALL re-initialize
