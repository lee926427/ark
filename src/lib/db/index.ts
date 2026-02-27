// ========================================
// ARKARK Database — Public API
// ========================================

// Client
export { getDB, closeDB, persistDB } from './client'

// Migrations
export { runMigrations, getSchemaVersion, SCHEMA_VERSION } from './migrations'

// Repositories
export { AccountRepository } from './repositories/accounts'
export { TransactionRepository } from './repositories/transactions'
export { HoldingRepository } from './repositories/holdings'
export { BudgetRepository } from './repositories/budgets'
export { InsuranceRepository } from './repositories/insurance'

// Types
export type {
  // Entities
  Account,
  Category,
  Transaction,
  Security,
  Holding,
  InsurancePolicy,
  Budget,
  SyncLog,
  // View results
  AssetsSummary,
  AccountBalance,
  FinancialHealthCheck,
  // Input types
  CreateAccount,
  UpdateAccount,
  CreateTransaction,
  UpdateTransaction,
  CreateHolding,
  UpdateHolding,
  CreateBudget,
  UpdateBudget,
  CreateInsurancePolicy,
  UpdateInsurancePolicy,
  // Enriched types
  HoldingWithSecurity,
  BudgetWithSpent,
  // Enums
  AccountType,
  CategoryType,
  TransactionType,
  SecurityType,
  InsuranceType,
  PremiumFrequency,
  BudgetPeriod,
} from './types'
