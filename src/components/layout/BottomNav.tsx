import { Link, useMatches } from '@tanstack/react-router'
import { Home, PenLine, PieChart, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/' as const, label: '首頁', icon: Home },
  { to: '/transactions/new' as const, label: '記帳', icon: PenLine },
  { to: '/assets' as const, label: '資產', icon: PieChart },
  { to: '/settings' as const, label: '設定', icon: Settings },
]

export function BottomNav() {
  const matches = useMatches()
  const currentPath = matches[matches.length - 1]?.pathname ?? '/'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = currentPath === to

          return (
            <Link
              key={to}
              to={to}
              className={[
                'flex flex-col items-center justify-center gap-0.5 w-full h-full',
                'transition-colors duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[0.65rem] font-medium leading-none">
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
