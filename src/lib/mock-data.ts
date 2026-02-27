// Mock data for ARK demo/preview
// This will be replaced with real database queries when the DB module is integrated

export const MOCK_ACCOUNTS = [
  {
    id: 'acc-1',
    name: '台新 Richart',
    type: 'bank' as const,
    currency: 'TWD',
    color: '#4f7cff',
    balance: 156800,
  },
  {
    id: 'acc-2',
    name: '現金',
    type: 'cash' as const,
    currency: 'TWD',
    color: '#22c55e',
    balance: 3200,
  },
  {
    id: 'acc-3',
    name: 'Line Pay',
    type: 'e_payment' as const,
    currency: 'TWD',
    color: '#06c755',
    balance: 1500,
  },
  {
    id: 'acc-4',
    name: '國泰信用卡',
    type: 'credit_card' as const,
    currency: 'TWD',
    color: '#ef4444',
    balance: -12500,
  },
  {
    id: 'acc-5',
    name: '元大台灣50',
    type: 'investment' as const,
    currency: 'TWD',
    color: '#f59e0b',
    balance: 450000,
  },
]

export const MOCK_RECENT_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'expense' as const,
    amount: -85,
    note: '全家咖啡',
    category: '飲食',
    categoryIcon: '☕',
    date: '今天',
    accountName: '現金',
  },
  {
    id: 'tx-2',
    type: 'expense' as const,
    amount: -350,
    note: '午餐便當',
    category: '飲食',
    categoryIcon: '🍱',
    date: '今天',
    accountName: 'Line Pay',
  },
  {
    id: 'tx-3',
    type: 'income' as const,
    amount: 52000,
    note: '3月薪水',
    category: '薪資',
    categoryIcon: '💰',
    date: '昨天',
    accountName: '台新 Richart',
  },
  {
    id: 'tx-4',
    type: 'expense' as const,
    amount: -1280,
    note: '捷運月票',
    category: '交通',
    categoryIcon: '🚇',
    date: '昨天',
    accountName: '台新 Richart',
  },
  {
    id: 'tx-5',
    type: 'transfer' as const,
    amount: -5000,
    note: '轉帳至 Line Pay',
    category: '轉帳',
    categoryIcon: '↔️',
    date: '3/25',
    accountName: '台新 Richart',
  },
]

export const MOCK_MONTHLY_SPENDING = [
  { name: '10月', income: 52000, expense: 38000 },
  { name: '11月', income: 53000, expense: 41000 },
  { name: '12月', income: 65000, expense: 55000 },
  { name: '1月', income: 52000, expense: 36000 },
  { name: '2月', income: 52000, expense: 42000 },
  { name: '3月', income: 52000, expense: 28000 },
]

export const MOCK_ASSET_DISTRIBUTION = [
  { name: '銀行存款', value: 156800, color: '#4f7cff' },
  { name: '投資', value: 450000, color: '#f59e0b' },
  { name: '現金', value: 3200, color: '#22c55e' },
  { name: '電子支付', value: 1500, color: '#06c755' },
]

export const MOCK_HOLDINGS = [
  {
    id: 'h-1',
    name: '元大台灣50',
    symbol: '0050',
    units: 3000,
    avgCost: 135.5,
    currentPrice: 150.0,
    change: +10.7,
    marketValue: 450000,
  },
  {
    id: 'h-2',
    name: '元大高股息',
    symbol: '0056',
    units: 2000,
    avgCost: 32.5,
    currentPrice: 36.8,
    change: +13.2,
    marketValue: 73600,
  },
  {
    id: 'h-3',
    name: '國泰永續高股息',
    symbol: '00878',
    units: 5000,
    avgCost: 19.2,
    currentPrice: 21.5,
    change: +12.0,
    marketValue: 107500,
  },
]

export function getNetWorth(): number {
  return MOCK_ACCOUNTS.reduce((sum, acc) => sum + acc.balance, 0)
}

export function getTotalAssets(): number {
  return MOCK_ACCOUNTS.filter((a) => a.balance > 0).reduce(
    (sum, a) => sum + a.balance,
    0,
  )
}

export function getTotalLiabilities(): number {
  return Math.abs(
    MOCK_ACCOUNTS.filter((a) => a.balance < 0).reduce(
      (sum, a) => sum + a.balance,
      0,
    ),
  )
}
