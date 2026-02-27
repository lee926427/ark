// ========================================
// ARKARK Database Entity Types
// ========================================

export type AccountType =
  | 'bank'
  | 'cash'
  | 'e_payment'
  | 'credit_card'
  | 'investment'
  | 'insurance'
  | 'loan'

export type CategoryType = 'income' | 'expense'

export type TransactionType = 'income' | 'expense' | 'transfer'

export type SecurityType = 'stock' | 'etf' | 'fund' | 'bond' | 'crypto'

export type InsuranceType =
  | 'life'
  | 'savings'
  | 'investment_linked'
  | 'medical'
  | 'accident'
  | 'annuity'

export type PremiumFrequency =
  | 'monthly'
  | 'quarterly'
  | 'semi_annual'
  | 'annual'

export type BudgetPeriod = 'monthly' | 'weekly'

// ========================================
// Entity Interfaces
// ========================================

export interface Account {
  id: string
  name: string
  type: AccountType
  currency: string
  institution: string | null
  icon: string | null
  color: string | null
  is_archived: number // SQLite boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  type: CategoryType
  icon: string | null
  color: string | null
  parent_id: string | null
  sort_order: number
  is_system: number
  created_at: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: string
  account_id: string
  to_account_id: string | null
  category_id: string | null
  note: string | null
  date: string // YYYY-MM-DD
  time: string | null // HH:MM
  tags: string | null // JSON array
  receipt_uri: string | null
  is_recurring: number
  recurrence: string | null // JSON
  synced_at: string | null
  created_at: string
  updated_at: string
}

export interface Security {
  id: string
  symbol: string
  name: string
  type: SecurityType
  currency: string
  last_price: number | null
  price_updated: string | null
  created_at: string
}

export interface Holding {
  id: string
  account_id: string
  security_id: string
  units: number
  avg_cost: number
  purchase_date: string | null
  note: string | null
  created_at: string
  updated_at: string
}

export interface InsurancePolicy {
  id: string
  account_id: string
  policy_name: string
  insurer: string | null
  type: InsuranceType | null
  premium: number | null
  premium_freq: PremiumFrequency | null
  sum_assured: number | null
  cash_value: number | null
  linked_fund_id: string | null
  start_date: string | null
  maturity_date: string | null
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  category_id: string | null
  amount: number
  period: BudgetPeriod
  start_date: string
  created_at: string
}

export interface SyncLog {
  id: string
  action: 'push' | 'pull'
  entity_type: string
  entity_id: string
  fingerprint: string | null
  status: string
  error_message: string | null
  created_at: string
}

// ========================================
// View Result Types
// ========================================

export interface AssetsSummary {
  account_id: string
  account_name: string
  account_type: AccountType
  currency: string
  cash_balance: number
  holdings_value: number
  unrealized_pnl: number
  insurance_value: number
  total_value: number
}

export interface AccountBalance {
  id: string
  name: string
  type: AccountType
  currency: string
  institution: string | null
  icon: string | null
  color: string | null
  balance: number
  transaction_count: number
  last_transaction_date: string | null
}

export interface FinancialHealthCheck {
  total_assets: number
  liquid_cash: number
  risk_assets: number
  total_insurance: number
  total_liabilities: number
  net_worth: number
  avg_monthly_expense: number
  emergency_fund_months: number | null
  risk_asset_ratio: number
}

// ========================================
// Input Types (for create/update)
// ========================================

export type CreateAccount = Pick<Account, 'name' | 'type'> &
  Partial<
    Pick<Account, 'currency' | 'institution' | 'icon' | 'color' | 'sort_order'>
  >

export type UpdateAccount = Partial<
  Pick<
    Account,
    | 'name'
    | 'type'
    | 'currency'
    | 'institution'
    | 'icon'
    | 'color'
    | 'sort_order'
  >
>

export type CreateTransaction = Pick<
  Transaction,
  'type' | 'amount' | 'account_id' | 'date'
> &
  Partial<
    Pick<
      Transaction,
      | 'currency'
      | 'to_account_id'
      | 'category_id'
      | 'note'
      | 'time'
      | 'tags'
      | 'receipt_uri'
      | 'is_recurring'
      | 'recurrence'
    >
  >

export type UpdateTransaction = Partial<
  Pick<
    Transaction,
    | 'type'
    | 'amount'
    | 'currency'
    | 'account_id'
    | 'to_account_id'
    | 'category_id'
    | 'note'
    | 'date'
    | 'time'
    | 'tags'
  >
>

export type CreateHolding = Pick<
  Holding,
  'account_id' | 'security_id' | 'units' | 'avg_cost'
> &
  Partial<Pick<Holding, 'purchase_date' | 'note'>>

export type UpdateHolding = Partial<
  Pick<Holding, 'units' | 'avg_cost' | 'purchase_date' | 'note'>
>

export type CreateBudget = Pick<Budget, 'amount' | 'period' | 'start_date'> &
  Partial<Pick<Budget, 'category_id'>>

export type UpdateBudget = Partial<
  Pick<Budget, 'amount' | 'period' | 'category_id'>
>

export type CreateInsurancePolicy = Pick<
  InsurancePolicy,
  'account_id' | 'policy_name'
> &
  Partial<
    Pick<
      InsurancePolicy,
      | 'insurer'
      | 'type'
      | 'premium'
      | 'premium_freq'
      | 'sum_assured'
      | 'cash_value'
      | 'linked_fund_id'
      | 'start_date'
      | 'maturity_date'
    >
  >

export type UpdateInsurancePolicy = Partial<
  Pick<
    InsurancePolicy,
    | 'policy_name'
    | 'insurer'
    | 'type'
    | 'premium'
    | 'premium_freq'
    | 'sum_assured'
    | 'cash_value'
    | 'linked_fund_id'
    | 'start_date'
    | 'maturity_date'
  >
>

// ========================================
// Holding with joined security info
// ========================================

export interface HoldingWithSecurity extends Holding {
  security_name: string
  symbol: string
  security_type: SecurityType
  last_price: number | null
  market_value: number
}

// ========================================
// Budget with spent calculation
// ========================================

export interface BudgetWithSpent extends Budget {
  spent: number
  remaining: number
  category_name: string | null
}
