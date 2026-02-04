import { TeamSwitcher } from './TeamSwitcher'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUserStore } from '@/stores'
import { getInitials, getAvatarColor } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'

export function Header() {
  const currentUser = useUserStore((s) => s.currentUser)
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient accent bar — blue to green */}
      <div className="bg-gradient-to-r from-sky-dark via-sky to-fairway text-white text-sm py-1.5 px-4 flex items-center justify-between">
        <span className="font-heading font-bold tracking-widest uppercase text-base">ShaBBa Golf</span>
        <span className="text-white/60 text-xs font-medium">Game On</span>
      </div>
      {/* Main header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors"
              aria-label="Home"
            >
              <Home className="h-5 w-5 text-fairway" />
            </button>
            <h1 className="text-lg font-bold text-foreground tracking-tight font-heading">
              ShaBBa Golf
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <TeamSwitcher />
            {currentUser && (
              <button
                onClick={() => navigate('/profile')}
                className="ml-1"
                aria-label="View profile"
              >
                <Avatar className="h-8 w-8 ring-2 ring-fairway/20">
                  <AvatarFallback
                    className="text-white text-xs font-semibold"
                    style={{ backgroundColor: getAvatarColor(currentUser.display_name) }}
                  >
                    {getInitials(currentUser.display_name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
