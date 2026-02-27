import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { AccountForm, type AccountFormValues } from './AccountForm'
import { useCreateAccount } from '@/lib/query/accounts'

export function CreateAccountSheet() {
  const [open, setOpen] = useState(false)
  const createAccount = useCreateAccount()

  const onSubmit = async (values: AccountFormValues) => {
    try {
      await createAccount.mutateAsync({
        name: values.name,
        type: values.type,
        currency: values.currency,
        initialBalance: values.initialBalance,
      })
      setOpen(false)
    } catch (error) {
      console.error('Failed to create account:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          新增帳戶
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[80vh] sm:h-auto sm:right-0 sm:side-right"
      >
        <SheetHeader className="mb-6">
          <SheetTitle>新增帳戶</SheetTitle>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          onCancel={() => setOpen(false)}
          isSubmitting={createAccount.isPending}
        />
      </SheetContent>
    </Sheet>
  )
}
