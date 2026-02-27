import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { AccountType } from '@/lib/db/types'

const accountFormSchema = z.object({
  name: z.string().min(1, '請輸入帳戶名稱'),
  type: z.enum([
    'bank',
    'cash',
    'e_payment',
    'credit_card',
    'investment',
    'insurance',
    'loan',
  ]),
  currency: z.string().default('TWD'),
  initialBalance: z.number().default(0),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>

interface AccountFormProps {
  defaultValues?: Partial<AccountFormValues>
  onSubmit: (values: AccountFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'cash', label: '現金' },
  { value: 'bank', label: '銀行帳戶' },
  { value: 'e_payment', label: '電子支付' },
  { value: 'credit_card', label: '信用卡' },
  { value: 'investment', label: '投資帳戶' },
]

export function AccountForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: AccountFormProps) {
  const form = useForm({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      type: defaultValues?.type || 'cash',
      currency: defaultValues?.currency || 'TWD',
      initialBalance: defaultValues?.initialBalance || 0,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>帳戶名稱</FormLabel>
              <FormControl>
                <Input placeholder="例如：日常錢包、玉山銀行" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>帳戶類型</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類型" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ACCOUNT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initialBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>初始餘額</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? '儲存中...' : '儲存'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
