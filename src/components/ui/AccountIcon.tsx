import {
  Building2,
  Banknote,
  Smartphone,
  CreditCard,
  TrendingUp,
  Shield,
  Landmark,
} from 'lucide-react'

const ACCOUNT_ICONS = {
  bank: Building2,
  cash: Banknote,
  e_payment: Smartphone,
  credit_card: CreditCard,
  investment: TrendingUp,
  insurance: Shield,
  loan: Landmark,
} as const

type AccountType = keyof typeof ACCOUNT_ICONS

interface AccountIconProps {
  type: AccountType
  color?: string
  size?: number
  className?: string
}

export function AccountIcon({
  type,
  color,
  size = 20,
  className = '',
}: AccountIconProps) {
  const Icon = ACCOUNT_ICONS[type] ?? Building2

  return (
    <div
      className={[
        'flex items-center justify-center rounded-lg',
        'w-9 h-9',
        className,
      ].join(' ')}
      style={{
        backgroundColor: color
          ? color + '1a' // 10% opacity
          : 'var(--secondary)',
      }}
    >
      <Icon size={size} style={{ color: color ?? 'var(--primary)' }} />
    </div>
  )
}
