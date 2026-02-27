import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { AccountForm, type AccountFormValues } from './AccountForm'
import { useUpdateAccount } from '@/lib/query/accounts'
import type { AccountBalance } from '@/lib/db/types'

interface EditAccountSheetProps {
  account: AccountBalance | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAccountSheet({
  account,
  open,
  onOpenChange,
}: EditAccountSheetProps) {
  const updateAccount = useUpdateAccount()

  const onSubmit = async (values: AccountFormValues) => {
    if (!account) return

    try {
      await updateAccount.mutateAsync({
        id: account.id,
        data: {
          name: values.name,
          type: values.type,
          currency: values.currency,
        },
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update account:', error)
    }
  }

  if (!account) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[80vh] sm:h-auto sm:right-0 sm:side-right"
      >
        <SheetHeader className="mb-6">
          <SheetTitle>編輯帳戶</SheetTitle>
        </SheetHeader>
        <AccountForm
          defaultValues={{
            name: account.name,
            type: account.type,
            currency: account.currency,
            initialBalance: account.balance, // Note: editing existing initial balance requires tx repo access, out of scope for simple update for now
          }}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={updateAccount.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
