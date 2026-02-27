// ========================================
// ARKARK Database — Public API
// ========================================

// Client
export { getDB, closeDB, persistDB } from '@/lib/db/client'

// Migrations
export {
  runMigrations,
  getSchemaVersion,
  SCHEMA_VERSION,
} from '@/lib/db/migrations'

// Repositories
export {
  AccountRepository,
  TransactionRepository,
  HoldingRepository,
  BudgetRepository,
  InsuranceRepository,
} from '@/lib/db/repositories'

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
} from '@/lib/db/types'
