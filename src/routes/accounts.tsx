import { createFileRoute } from '@tanstack/react-router'
import { Wallet, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AccountIcon } from '@/components/ui/AccountIcon'
import { AmountDisplay } from '@/components/ui/AmountDisplay'
import { CreateAccountSheet } from '@/components/features/accounts/CreateAccountSheet'
import { EditAccountSheet } from '@/components/features/accounts/EditAccountSheet'
import { useAccountBalances } from '@/lib/query/accounts'
import { useState } from 'react'
import type { AccountBalance } from '@/lib/db/types'

export const Route = createFileRoute('/accounts')({
  component: AccountsRoute,
})

function AccountsRoute() {
  const { data: accounts, isLoading } = useAccountBalances()
  const [editingAccount, setEditingAccount] = useState<AccountBalance | null>(
    null,
  )

  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) ?? 0

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 container mx-auto py-6 pb-24 px-4 sm:px-6">
        <div className="h-24 w-full animate-pulse bg-muted rounded-xl" />
        <div className="space-y-4">
          <div className="h-16 w-full animate-pulse bg-muted rounded-xl" />
          <div className="h-16 w-full animate-pulse bg-muted rounded-xl" />
        </div>
      </div>
    )
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex-1 container mx-auto py-12 px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-6">
          <Wallet className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-2">
          沒有任何帳戶
        </h2>
        <p className="text-muted-foreground mb-8 max-w-[250px]">
          建立你的第一個帳戶，開始追蹤資金流向。可以先從現金或銀行帳戶開始。
        </p>
        <CreateAccountSheet />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 container mx-auto py-6 pb-24 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            帳戶總覽
          </h1>
          <p className="text-sm text-muted-foreground">管理你的所有資金來源</p>
        </div>
        <CreateAccountSheet />
      </div>

      <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 shadow-lg shadow-indigo-500/5">
        <CardContent className="p-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              淨資金總量
            </p>
            <AmountDisplay
              amount={totalBalance}
              currency="TWD"
              className="text-3xl font-bold tracking-tight text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg tracking-tight">所有帳戶</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card
              key={account.id}
              className="group cursor-pointer hover:shadow-md transition-all duration-200 border-border/40 hover:border-indigo-500/50"
              onClick={() => setEditingAccount(account)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-foreground transition-transform duration-200 group-hover:scale-110">
                    <AccountIcon type={account.type} size={28} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {account.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {account.transaction_count} 筆交易
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <AmountDisplay
                    amount={account.balance}
                    currency={account.currency}
                    className="font-medium text-foreground tracking-tight"
                  />
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -mr-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <EditAccountSheet
        account={editingAccount}
        open={editingAccount !== null}
        onOpenChange={(open) => !open && setEditingAccount(null)}
      />
    </div>
  )
}
