import { formatCurrency } from '@/lib/utils/currency'

interface AmountDisplayProps {
  amount: number
  currency?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showSign?: boolean
  className?: string
}

const SIZE_CLASSES = {
  sm: 'text-sm font-medium',
  md: 'text-base font-semibold',
  lg: 'text-xl font-bold',
  xl: 'text-3xl font-bold tracking-tight',
} as const

export function AmountDisplay({
  amount,
  currency = 'TWD',
  size = 'md',
  showSign = false,
  className = '',
}: AmountDisplayProps) {
  const formatted = formatCurrency(amount, currency)
  const displayText = showSign && amount > 0 ? '+' + formatted : formatted

  const colorClass =
    amount > 0
      ? 'text-positive-foreground'
      : amount < 0
        ? 'text-negative-foreground'
        : 'text-muted-foreground'

  return (
    <span
      className={[
        SIZE_CLASSES[size],
        colorClass,
        'tabular-nums',
        className,
      ].join(' ')}
    >
      {displayText}
    </span>
  )
}
