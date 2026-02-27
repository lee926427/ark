/**
 * Represents the structure of AES-256-GCM encrypted data.
 */
export interface EncryptedPayload {
  /** Base64 encoded ciphertext */
  ciphertext: string
  /** Base64 encoded Initialization Vector (12 bytes) */
  iv: string
  /** Base64 encoded random salt used for key derivation */
  salt: string
}

/**
 * A 64-character hex string representing the SHA-256 hash of normalized data.
 */
export type DataFingerprint = string

/**
 * Normalized financial health metrics used to generate a data fingerprint.
 * These metrics specifically exclude any absolute monetary values to preserve privacy.
 */
export interface HealthMetrics {
  /** The number of months the current emergency fund can cover expenses */
  emergencyFundMonths: number | null
  /** Ratio of monthly savings to income (percentage or decimal) */
  savingsRate: number
  /** Ratio of total debt to total assets */
  debtToAssetRatio: number
  /** Ratio of liquid assets to total assets */
  liquidityRatio?: number
  /** Score or category for spending health (e.g. Needs/Wants/Savings distribution) */
  spendingHealthScore?: number
}
