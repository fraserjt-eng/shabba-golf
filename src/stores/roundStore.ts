import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Round } from '@/types'
import { supabase, TABLES, isSupabaseConfigured } from '@/lib/supabase'
import { optimisticUpdate } from '@/lib/optimistic'

interface RoundState {
  rounds: Round[]
  loading: boolean
  error: string | null
  fetchRounds: (teamId: string) => Promise<void>
  signUp: (roundId: string, userId: string) => Promise<void>
  withdraw: (roundId: string, userId: string) => Promise<void>
  clearError: () => void
}

export const useRoundStore = create<RoundState>()(
  devtools(
    persist(
      (set, get) => ({
        rounds: [],
        loading: false,
        error: null,

        fetchRounds: async (teamId: string) => {
          if (!isSupabaseConfigured()) return
          set({ loading: true, error: null })
          try {
            const { data, error } = await supabase
              .from(TABLES.ROUNDS)
              .select('*')
              .eq('team_id', teamId)
              .order('date', { ascending: false })
            if (error) throw error
            set({ rounds: data ?? [], loading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch rounds',
              loading: false,
            })
          }
        },

        signUp: async (roundId: string, userId: string) => {
          await optimisticUpdate(
            () => get().rounds,
            () => {
              set((state) => ({
                rounds: state.rounds.map((r) =>
                  r.id === roundId
                    ? { ...r, signed_up_ids: [...r.signed_up_ids, userId] }
                    : r,
                ),
              }))
            },
            async () => {
              if (!isSupabaseConfigured()) return
              const round = get().rounds.find((r) => r.id === roundId)
              if (!round) throw new Error('Round not found')
              const { error } = await supabase
                .from(TABLES.ROUNDS)
                .update({ signed_up_ids: [...round.signed_up_ids, userId] })
                .eq('id', roundId)
              if (error) throw error
            },
            (snapshot) => set({ rounds: snapshot }),
          )
        },

        withdraw: async (roundId: string, userId: string) => {
          await optimisticUpdate(
            () => get().rounds,
            () => {
              set((state) => ({
                rounds: state.rounds.map((r) =>
                  r.id === roundId
                    ? { ...r, signed_up_ids: r.signed_up_ids.filter((id) => id !== userId) }
                    : r,
                ),
              }))
            },
            async () => {
              if (!isSupabaseConfigured()) return
              const round = get().rounds.find((r) => r.id === roundId)
              if (!round) throw new Error('Round not found')
              const { error } = await supabase
                .from(TABLES.ROUNDS)
                .update({ signed_up_ids: round.signed_up_ids.filter((id) => id !== userId) })
                .eq('id', roundId)
              if (error) throw error
            },
            (snapshot) => set({ rounds: snapshot }),
          )
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'golf-squad-rounds',
        partialize: (state) => ({ rounds: state.rounds }),
      },
    ),
    { name: 'RoundStore' },
  ),
)
