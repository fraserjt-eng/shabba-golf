import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { User, UserUpdate } from '@/types'
import { supabase, TABLES, isSupabaseConfigured } from '@/lib/supabase'
import { demoUsers, CURRENT_USER_ID } from '@/lib/demo-data'

interface UserState {
  currentUser: User | null
  loading: boolean
  error: string | null
  fetchCurrentUser: () => Promise<void>
  updateProfile: (updates: UserUpdate) => Promise<void>
  setUser: (user: User | null) => void
  clearError: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        currentUser: null,
        loading: false,
        error: null,

        fetchCurrentUser: async () => {
          if (!isSupabaseConfigured()) {
            const demoUser = demoUsers.find((u) => u.id === CURRENT_USER_ID) ?? null
            set({ currentUser: demoUser, loading: false })
            return
          }
          set({ loading: true, error: null })
          try {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) {
              set({ currentUser: null, loading: false })
              return
            }
            const { data, error } = await supabase
              .from(TABLES.USERS)
              .select('*')
              .eq('id', authUser.id)
              .single()
            if (error) throw error
            set({ currentUser: data, loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch user',
              loading: false,
            })
          }
        },

        updateProfile: async (updates: UserUpdate) => {
          const { currentUser } = get()
          if (!currentUser || !isSupabaseConfigured()) return
          set({ loading: true, error: null })
          try {
            const { data, error } = await supabase
              .from(TABLES.USERS)
              .update(updates)
              .eq('id', currentUser.id)
              .select()
              .single()
            if (error) throw error
            set({ currentUser: data, loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update profile',
              loading: false,
            })
          }
        },

        setUser: (user) => set({ currentUser: user }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'golf-squad-user',
        partialize: (state) => ({ currentUser: state.currentUser }),
      },
    ),
    { name: 'UserStore' },
  ),
)
