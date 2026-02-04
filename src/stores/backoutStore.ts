import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { BackoutFee } from '@/types'
import { isSupabaseConfigured } from '@/lib/supabase'
import { demoBackoutFees } from '@/lib/demo-data'

interface BackoutState {
  fees: BackoutFee[]
  loading: boolean
  error: string | null
  potTotal: () => number
  fetchFees: (teamId: string) => Promise<void>
  clearError: () => void
}

export const useBackoutStore = create<BackoutState>()(
  devtools(
    (set, get) => ({
      fees: [],
      loading: false,
      error: null,

      potTotal: () => {
        return get().fees.reduce((sum, f) => sum + f.amount, 0)
      },

      fetchFees: async (_teamId: string) => {
        if (!isSupabaseConfigured()) {
          set({ fees: demoBackoutFees, loading: false })
          return
        }
        set({ loading: true, error: null })
        try {
          // Supabase fetch would go here
          set({ fees: [], loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch backout fees',
            loading: false,
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'BackoutStore' },
  ),
)
