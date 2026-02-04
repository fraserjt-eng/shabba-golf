import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Trophy, UserCircle, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/settlements', label: 'Settle Up', icon: DollarSign },
  { path: '/profile', label: 'Profile', icon: UserCircle },
] as const

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-border/50 shadow-sm pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around">
        {tabs.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-3 min-h-[44px] flex-1 transition-colors',
                isActive
                  ? 'text-fairway'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              aria-label={label}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-sky to-fairway" />
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
