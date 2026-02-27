import { createFileRoute } from '@tanstack/react-router'
import { AmountDisplay } from '@/components/ui/AmountDisplay'
import { AccountIcon } from '@/components/ui/AccountIcon'
import {
  MOCK_ACCOUNTS,
  MOCK_RECENT_TRANSACTIONS,
  MOCK_MONTHLY_SPENDING,
  getNetWorth,
} from '@/lib/mock-data'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const netWorth = getNetWorth()
  const thisMonth = MOCK_MONTHLY_SPENDING[MOCK_MONTHLY_SPENDING.length - 1]
  const savingsRate = Math.round(
    ((thisMonth.income - thisMonth.expense) / thisMonth.income) * 100,
  )

  return (
    <div className="space-y-6 rise-in">
      {/* Net Worth Hero */}
      <section className="text-center py-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          淨資產
        </p>
        <AmountDisplay amount={netWorth} currency="TWD" size="xl" />
        <div className="flex items-center justify-center gap-1 mt-2">
          <TrendingUp size={14} className="text-positive-foreground" />
          <span className="text-xs text-positive-foreground font-medium">
            +2.3% 本月
          </span>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ArrowUpRight size={12} className="text-positive-foreground" />
            <span className="text-[0.65rem] text-muted-foreground">收入</span>
          </div>
          <AmountDisplay amount={thisMonth.income} size="sm" />
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ArrowDownRight size={12} className="text-negative-foreground" />
            <span className="text-[0.65rem] text-muted-foreground">支出</span>
          </div>
          <AmountDisplay amount={-thisMonth.expense} size="sm" />
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp size={12} className="text-primary" />
            <span className="text-[0.65rem] text-muted-foreground">儲蓄率</span>
          </div>
          <span className="text-sm font-semibold text-primary">
            {savingsRate}%
          </span>
        </div>
      </section>

      {/* Monthly Chart */}
      <section className="p-4 rounded-xl bg-card border border-border">
        <h2 className="text-sm font-semibold mb-3">收支趨勢</h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_MONTHLY_SPENDING} barGap={2}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: any) =>
                  'NT$' + Number(value).toLocaleString()
                }
              />
              <Bar
                dataKey="income"
                fill="var(--positive)"
                radius={[4, 4, 0, 0]}
                name="收入"
              />
              <Bar
                dataKey="expense"
                fill="var(--negative)"
                radius={[4, 4, 0, 0]}
                name="支出"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-positive" />
            <span className="text-[0.65rem] text-muted-foreground">收入</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-negative" />
            <span className="text-[0.65rem] text-muted-foreground">支出</span>
          </div>
        </div>
      </section>

      {/* Accounts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">帳戶</h2>
          <span className="text-xs text-primary font-medium">查看全部</span>
        </div>
        <div className="space-y-2">
          {MOCK_ACCOUNTS.map((account) => (
            <div
              key={account.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border transition-colors hover:bg-accent/50"
            >
              <AccountIcon type={account.type} color={account.color} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{account.name}</p>
                <p className="text-xs text-muted-foreground">
                  {account.type === 'bank'
                    ? '銀行'
                    : account.type === 'cash'
                      ? '現金'
                      : account.type === 'e_payment'
                        ? '電子支付'
                        : account.type === 'credit_card'
                          ? '信用卡'
                          : '投資'}
                </p>
              </div>
              <AmountDisplay amount={account.balance} size="sm" />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">最近交易</h2>
          <span className="text-xs text-primary font-medium">查看全部</span>
        </div>
        <div className="space-y-1">
          {MOCK_RECENT_TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors hover:bg-accent/50"
            >
              <span className="text-lg w-8 text-center flex-shrink-0">
                {tx.categoryIcon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.note}</p>
                <p className="text-xs text-muted-foreground">
                  {tx.accountName} · {tx.date}
                </p>
              </div>
              <AmountDisplay
                amount={tx.amount}
                size="sm"
                showSign={tx.type === 'income'}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
