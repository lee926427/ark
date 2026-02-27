import { createFileRoute } from '@tanstack/react-router'
import { AmountDisplay } from '@/components/ui/AmountDisplay'
import {
  MOCK_ASSET_DISTRIBUTION,
  MOCK_HOLDINGS,
  getTotalAssets,
  getTotalLiabilities,
  getNetWorth,
} from '@/lib/mock-data'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

export const Route = createFileRoute('/assets')({
  component: AssetsPage,
})

function AssetsPage() {
  const totalAssets = getTotalAssets()
  const totalLiabilities = getTotalLiabilities()
  const netWorth = getNetWorth()

  return (
    <div className="space-y-6 rise-in">
      {/* Summary Cards */}
      <section className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp size={12} className="text-positive-foreground" />
            <span className="text-[0.65rem] text-muted-foreground">總資產</span>
          </div>
          <AmountDisplay amount={totalAssets} size="sm" />
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingDown size={12} className="text-negative-foreground" />
            <span className="text-[0.65rem] text-muted-foreground">總負債</span>
          </div>
          <AmountDisplay amount={-totalLiabilities} size="sm" />
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Wallet size={12} className="text-primary" />
            <span className="text-[0.65rem] text-muted-foreground">淨值</span>
          </div>
          <AmountDisplay amount={netWorth} size="sm" />
        </div>
      </section>

      {/* Distribution Chart */}
      <section className="p-4 rounded-xl bg-card border border-border">
        <h2 className="text-sm font-semibold mb-3">資產分佈</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_ASSET_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {MOCK_ASSET_DISTRIBUTION.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {MOCK_ASSET_DISTRIBUTION.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[0.65rem] text-muted-foreground">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Financial Health */}
      <section className="p-4 rounded-xl bg-card border border-border">
        <h2 className="text-sm font-semibold mb-3">財務健康</h2>
        <div className="space-y-3">
          <HealthIndicator
            label="緊急預備金覆蓋"
            value="3.7 個月"
            target="6 個月"
            progress={62}
            color="var(--chart-2)"
          />
          <HealthIndicator
            label="儲蓄率"
            value="46%"
            target="30%"
            progress={100}
            color="var(--positive)"
          />
          <HealthIndicator
            label="負債比"
            value="2%"
            target="< 30%"
            progress={7}
            color="var(--primary)"
          />
        </div>
      </section>

      {/* Holdings */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">持倉</h2>
          <span className="text-xs text-primary font-medium">查看全部</span>
        </div>
        <div className="space-y-2">
          {MOCK_HOLDINGS.map((holding) => (
            <div
              key={holding.id}
              className="p-3 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-sm font-medium">{holding.name}</span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    {holding.symbol}
                  </span>
                </div>
                <AmountDisplay amount={holding.marketValue} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {holding.units.toLocaleString()} 股 × NT$
                  {holding.currentPrice}
                </span>
                <span
                  className={[
                    'text-xs font-medium',
                    holding.change >= 0
                      ? 'text-positive-foreground'
                      : 'text-negative-foreground',
                  ].join(' ')}
                >
                  {holding.change >= 0 ? '+' : ''}
                  {holding.change.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function HealthIndicator({
  label,
  value,
  target,
  progress,
  color,
}: {
  label: string
  value: string
  target: string
  progress: number
  color: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold">{value}</span>
          <span className="text-[0.6rem] text-muted-foreground">
            / {target}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: Math.min(progress, 100) + '%',
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}
