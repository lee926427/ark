import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="space-y-6 rise-in">
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          一般
        </h2>
        <div className="space-y-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
            <span className="text-sm">預設幣別</span>
            <span className="text-sm text-muted-foreground">TWD</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
            <span className="text-sm">外觀</span>
            <span className="text-sm text-muted-foreground">跟隨系統</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          關於
        </h2>
        <div className="space-y-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
            <span className="text-sm">版本</span>
            <span className="text-sm text-muted-foreground">0.1.0</span>
          </div>
        </div>
      </section>
    </div>
  )
}
