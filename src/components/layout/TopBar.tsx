import ThemeToggle from '@/components/ThemeToggle'

interface TopBarProps {
  title?: string
}

const ROUTE_TITLES: Record<string, string> = {
  '/': 'ARK',
  '/accounts': '帳戶',
  '/transactions/new': '記帳',
  '/assets': '資產總覽',
  '/settings': '設定',
}

export function TopBar({ title }: TopBarProps) {
  const displayTitle = title ?? 'ARK'

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-lg">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <h1 className="text-lg font-bold tracking-tight truncate">
          {displayTitle}
        </h1>
        <ThemeToggle />
      </div>
    </header>
  )
}

export { ROUTE_TITLES }
