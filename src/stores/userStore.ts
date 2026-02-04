import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { User, UserUpdate } from '@/types'
import { supabase, TABLES, isSupabaseConfigured } from '@/lib/supabase'
import { demoUsers } from '@/lib/demo-data'

interface UserState {
  currentUser: User | null
  allUsers: User[]
  loading: boolean
  error: string | null
  fetchCurrentUser: () => Promise<void>
  updateProfile: (updates: UserUpdate) => Promise<void>
  updateUserProfile: (userId: string, updates: UserUpdate) => void
  addUser: (user: User) => void
  login: (email: string, password: string) => Promise<boolean>
  register: (data: { email: string; password: string; displayName: string; venmo: string; ghin: string }) => Promise<boolean>
  logout: () => void
  isAuthenticated: () => boolean
  setUser: (user: User | null) => void
  clearError: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        currentUser: null,
        allUsers: [],
        loading: false,
        error: null,

        fetchCurrentUser: async () => {
          if (!isSupabaseConfigured()) {
            // In demo mode, keep already-selected user if present — do NOT auto-login
            const { currentUser } = get()
            set({ currentUser, allUsers: [...demoUsers], loading: false })
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
          if (!currentUser) return

          if (!isSupabaseConfigured()) {
            // Demo mode: apply updates locally
            set({ currentUser: { ...currentUser, ...updates } as User })
            return
          }

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

        updateUserProfile: (userId: string, updates: UserUpdate) => {
          set((state) => ({
            allUsers: state.allUsers.map((u) =>
              u.id === userId ? { ...u, ...updates, updated_at: new Date().toISOString() } as User : u,
            ),
            currentUser:
              state.currentUser?.id === userId
                ? { ...state.currentUser, ...updates, updated_at: new Date().toISOString() } as User
                : state.currentUser,
          }))
        },

        addUser: (user: User) => {
          set((state) => ({
            allUsers: [...state.allUsers, user],
          }))
        },

        login: async (email: string, password: string) => {
          if (!isSupabaseConfigured()) {
            // Demo mode: match by email + password
            const { allUsers } = get()
            const users = allUsers.length > 0 ? allUsers : demoUsers
            const matched = users.find(
              (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
            )
            if (!matched) {
              set({ error: 'Invalid email or password', loading: false })
              return false
            }
            set({ currentUser: matched, allUsers: users.length > 0 ? users : [...demoUsers], loading: false, error: null })
            return true
          }
          set({ loading: true, error: null })
          try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            await get().fetchCurrentUser()
            return true
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Login failed',
              loading: false,
            })
            return false
          }
        },

        register: async ({ email, password, displayName, venmo, ghin }) => {
          if (!isSupabaseConfigured()) {
            // Demo mode: create user locally
            const newId = `demo-user-${Date.now()}`
            const newUser: User = {
              id: newId,
              email,
              password,
              display_name: displayName,
              avatar_url: null,
              phone: null,
              handicap: null,
              ghin_number: ghin,
              handicap_index: null,
              venmo_username: venmo,
              preferred_tee_time: null,
              stats: { rounds_played: 0, average_score: null, best_score: null, total_winnings: 0, total_losses: 0, backout_count: 0 },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            const { allUsers } = get()
            const users = allUsers.length > 0 ? allUsers : [...demoUsers]
            set({ currentUser: newUser, allUsers: [...users, newUser], loading: false, error: null })
            return true
          }
          set({ loading: true, error: null })
          try {
            const { error } = await supabase.auth.signUp({
              email,
              password,
              options: { data: { display_name: displayName } },
            })
            if (error) throw error
            await get().fetchCurrentUser()
            return true
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Registration failed',
              loading: false,
            })
            return false
          }
        },

        logout: () => {
          if (isSupabaseConfigured()) {
            supabase.auth.signOut()
          }
          set({ currentUser: null, error: null })
        },

        isAuthenticated: () => {
          return get().currentUser !== null
        },

        setUser: (user) => set({ currentUser: user, allUsers: get().allUsers.length > 0 ? get().allUsers : [...demoUsers] }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'golf-squad-user',
        partialize: (state) => ({ currentUser: state.currentUser, allUsers: state.allUsers }),
      },
    ),
    { name: 'UserStore' },
  ),
)
