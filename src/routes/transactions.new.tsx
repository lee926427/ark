import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transactions/new')({
  component: NewTransactionPage,
})

function NewTransactionPage() {
  return (
    <div className="space-y-6 rise-in">
      <section className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="text-2xl">📝</span>
        </div>
        <h2 className="text-lg font-semibold mb-2">快速記帳</h2>
        <p className="text-sm text-muted-foreground">
          即將推出：通勤最佳化的快速記帳介面
        </p>
      </section>
    </div>
  )
}
