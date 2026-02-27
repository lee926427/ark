import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDB,
  persistDB,
  AccountRepository,
  TransactionRepository,
} from '@/lib/db'
import type { CreateAccount, UpdateAccount } from '@/lib/db/types'

// React Query Keys Configuration
export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (filters: string) => [...accountKeys.lists(), { filters }] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  balances: () => [...accountKeys.all, 'balances'] as const,
}

// 取得包含初始化的 Repository
const getRepo = async () => {
  const db = await getDB()
  return new AccountRepository(db)
}

/**
 * 查詢所有不含餘額的帳戶清單（原始資料）
 */
export function useAccounts(options?: { includeArchived?: boolean }) {
  return useQuery({
    queryKey: accountKeys.list(JSON.stringify(options)),
    queryFn: async () => {
      const repo = await getRepo()
      return repo.list(options)
    },
  })
}

/**
 * 查詢包含目前計算餘額與統計的帳戶清單（透過 v_account_balances 視圖）
 */
export function useAccountBalances() {
  return useQuery({
    queryKey: accountKeys.balances(),
    queryFn: async () => {
      const repo = await getRepo()
      return repo.listBalances()
    },
  })
}

/**
 * 新增帳戶 Mutation
 */
export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      initialBalance,
      ...data
    }: CreateAccount & { initialBalance?: number }) => {
      const db = await getDB()
      const repo = new AccountRepository(db)
      const txnRepo = new TransactionRepository(db)

      const account = repo.create(data)

      if (initialBalance && initialBalance !== 0) {
        txnRepo.create({
          type: initialBalance > 0 ? 'income' : 'expense',
          amount: Math.abs(initialBalance),
          currency: data.currency ?? 'TWD',
          account_id: account.id,
          note: 'Initial balance',
          date: new Date().toISOString().split('T')[0],
        })
      }

      await persistDB()
      return account
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all })
    },
  })
}

/**
 * 編輯/更新帳戶 Mutation
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAccount }) => {
      const repo = await getRepo()
      const account = repo.update(id, data)
      await persistDB()
      return account
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all })
    },
  })
}

/**
 * 封存帳戶 Mutation
 */
export function useArchiveAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const repo = await getRepo()
      repo.archive(id)
      await persistDB()
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all })
    },
  })
}
