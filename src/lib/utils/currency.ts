const CURRENCY_CONFIG: Record<string, { symbol: string; decimals: number }> = {
  TWD: { symbol: 'NT$', decimals: 0 },
  USD: { symbol: '$', decimals: 2 },
  EUR: { symbol: '\u20AC', decimals: 2 },
  JPY: { symbol: '\u00A5', decimals: 0 },
  GBP: { symbol: '\u00A3', decimals: 2 },
  CNY: { symbol: '\u00A5', decimals: 2 },
}

/**
 * Format a number as currency with thousand separators.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'TWD',
): string {
  const config = CURRENCY_CONFIG[currency] ?? {
    symbol: currency + ' ',
    decimals: 2,
  }

  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  })

  const sign = amount < 0 ? '-' : ''
  return sign + config.symbol + formatted
}

/**
 * Format a number as compact (e.g. 1.2M, 45K).
 */
export function formatCompact(
  amount: number,
  currency: string = 'TWD',
): string {
  const config = CURRENCY_CONFIG[currency] ?? {
    symbol: currency + ' ',
    decimals: 0,
  }

  const abs = Math.abs(amount)
  let compact: string

  if (abs >= 1_000_000) {
    compact = (abs / 1_000_000).toFixed(1) + 'M'
  } else if (abs >= 10_000) {
    compact = (abs / 1_000).toFixed(0) + 'K'
  } else {
    compact = abs.toLocaleString('en-US', {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    })
  }

  const sign = amount < 0 ? '-' : ''
  return sign + config.symbol + compact
}
