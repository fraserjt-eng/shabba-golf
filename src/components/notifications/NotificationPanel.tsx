import { useNotificationStore } from '@/stores/notificationStore'
import { getRelativeTime } from '@/lib/utils'
import { Bell, Calendar, UserPlus, DollarSign, UserMinus, Check } from 'lucide-react'
import type { DemoNotification } from '@/lib/demo-data'

interface NotificationPanelProps {
  notifications: DemoNotification[]
  onClose: () => void
}

const typeIcons = {
  round_reminder: Calendar,
  player_joined: UserPlus,
  settlement: DollarSign,
  backout: UserMinus,
}

export function NotificationPanel({ notifications, onClose }: NotificationPanelProps) {
  const { markAsRead, markAllAsRead } = useNotificationStore()
  const hasUnread = notifications.some((n) => !n.read)

  return (
    <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl border shadow-lg animate-dropdown-in z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-fairway" />
          <span className="text-sm font-semibold">Notifications</span>
        </div>
        {hasUnread && (
          <button
            onClick={() => markAllAsRead()}
            className="text-xs text-fairway font-medium hover:underline flex items-center gap-1"
          >
            <Check className="h-3 w-3" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = typeIcons[notification.type]
            return (
              <button
                key={notification.id}
                onClick={() => {
                  markAsRead(notification.id)
                  onClose()
                }}
                className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-surface transition-colors ${
                  !notification.read ? 'bg-surface-green/50' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className={`mt-0.5 ${!notification.read ? 'text-fairway' : 'text-muted-foreground'}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getRelativeTime(notification.created_at)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="mt-2 w-2 h-2 rounded-full bg-fairway flex-shrink-0" />
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
