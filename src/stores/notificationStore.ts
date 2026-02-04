import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { demoNotifications, type DemoNotification } from '@/lib/demo-data'

interface NotificationState {
  notifications: DemoNotification[]
  loading: boolean
  unreadCount: () => number
  fetchNotifications: () => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      loading: false,

      unreadCount: () => {
        return get().notifications.filter((n) => !n.read).length
      },

      fetchNotifications: () => {
        set({ notifications: demoNotifications, loading: false })
      },

      markAsRead: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n,
          ),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }))
      },
    }),
    { name: 'NotificationStore' },
  ),
)
