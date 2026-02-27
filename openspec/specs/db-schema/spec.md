# db-schema Specification

## Purpose
TBD - created by archiving change sqlite-foundation. Update Purpose after archive.
## Requirements
### Requirement: Schema defines 8 core tables

The system SHALL create 8 tables: accounts, categories, transactions, securities, holdings, insurance_policies, budgets, sync_log with all columns, constraints, and indexes as defined in the implementation plan.

#### Scenario: Fresh database initialization

- **WHEN** the database is opened for the first time (version 0)
- **THEN** all 8 tables and their indexes SHALL be created without errors

### Requirement: Version-based migration

The system SHALL use `PRAGMA user_version` to track schema version and apply migrations sequentially.

#### Scenario: Database at version 0

- **WHEN** `runMigrations()` is called on a version 0 database
- **THEN** all migrations up to the latest version SHALL be applied in order

#### Scenario: Database already at latest version

- **WHEN** `runMigrations()` is called on an up-to-date database
- **THEN** no migrations SHALL be executed and no errors SHALL occur

#### Scenario: Database at intermediate version

- **WHEN** `runMigrations()` is called on a database at version N (where N < latest)
- **THEN** only migrations from N+1 to latest SHALL be applied

### Requirement: Migration atomicity

Each migration SHALL run inside a transaction. If any statement fails, the entire migration SHALL be rolled back.

#### Scenario: Migration failure

- **WHEN** a migration statement fails
- **THEN** the transaction SHALL be rolled back and `user_version` SHALL remain unchanged

