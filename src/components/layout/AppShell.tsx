import { TopBar, ROUTE_TITLES } from '@/components/layout/TopBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { useMatches } from '@tanstack/react-router'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname ?? '/'
  const title = ROUTE_TITLES[currentPath] ?? 'ARK'

  return (
    <div className="app-shell">
      <TopBar title={title} />
      <main className="app-content">
        <div className="max-w-lg mx-auto px-4 py-4">{children}</div>
      </main>
      <BottomNav />
    </div>
  )
}
