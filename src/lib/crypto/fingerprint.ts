import type { DataFingerprint, HealthMetrics } from './types'

/**
 * Creates a deterministic, normalized JSON string representation of health metrics.
 * Ensures consistent ordering of keys, replacing undefined with null, and rounds decimals
 * to 4 places to avoid floating point precision differences across platforms.
 * @param metrics The health metrics containing only normalized or ratio-based values
 * @returns {string} The normalized JSON string representation
 */
export function generateFingerprint(metrics: HealthMetrics): string {
  // Explicitly extract specifically defined properties to avoid including hidden ones
  // or accidentally including absolute monetary values if mistakenly passed.
  // We also sort the keys alphabetically by constructing a predictable object.
  const payload = {
    debtToAssetRatio:
      metrics.debtToAssetRatio !== undefined &&
      metrics.debtToAssetRatio !== null
        ? Number(metrics.debtToAssetRatio.toFixed(4))
        : null,
    emergencyFundMonths:
      metrics.emergencyFundMonths !== undefined &&
      metrics.emergencyFundMonths !== null
        ? Number(metrics.emergencyFundMonths.toFixed(4))
        : null,
    liquidityRatio:
      metrics.liquidityRatio !== undefined && metrics.liquidityRatio !== null
        ? Number(metrics.liquidityRatio.toFixed(4))
        : null,
    savingsRate:
      metrics.savingsRate !== undefined && metrics.savingsRate !== null
        ? Number(metrics.savingsRate.toFixed(4))
        : null,
    spendingHealthScore:
      metrics.spendingHealthScore !== undefined &&
      metrics.spendingHealthScore !== null
        ? Number(metrics.spendingHealthScore.toFixed(4))
        : null,
  }

  return JSON.stringify(payload)
}

/**
 * Hashes a fingerprint string using SHA-256 into a fixed-length 64-character hex string.
 * @param fingerprintString The deterministic, normalized JSON string
 * @returns {Promise<DataFingerprint>} A SHA-256 hex string
 */
export async function hashFingerprint(
  fingerprintString: string,
): Promise<DataFingerprint> {
  const enc = new TextEncoder()
  const data = enc.encode(fingerprintString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
