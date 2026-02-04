import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Round, RoundInsert } from '@/types'
import { supabase, TABLES, isSupabaseConfigured } from '@/lib/supabase'
import { optimisticUpdate } from '@/lib/optimistic'
import { demoRounds } from '@/lib/demo-data'

interface RoundState {
  rounds: Round[]
  loading: boolean
  error: string | null
  fetchRounds: (teamId: string) => Promise<void>
  createRound: (round: RoundInsert) => Promise<Round | null>
  updateRound: (roundId: string, updates: Partial<RoundInsert>) => Promise<void>
  deleteRound: (roundId: string) => Promise<void>
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
          if (!isSupabaseConfigured()) {
            const filtered = demoRounds.filter((r) => r.team_id === teamId)
            set({ rounds: filtered, loading: false })
            return
          }
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

        createRound: async (round) => {
          if (!isSupabaseConfigured()) {
            const newRound: Round = {
              ...round,
              id: `demo-round-${Date.now()}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            set((state) => ({ rounds: [newRound, ...state.rounds] }))
            return newRound
          }
          set({ loading: true, error: null })
          try {
            const { data, error } = await supabase
              .from(TABLES.ROUNDS)
              .insert(round)
              .select()
              .single()
            if (error) throw error
            set((state) => ({
              rounds: [data, ...state.rounds],
              loading: false,
            }))
            return data
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to create round',
              loading: false,
            })
            return null
          }
        },

        updateRound: async (roundId, updates) => {
          if (!isSupabaseConfigured()) {
            set((state) => ({
              rounds: state.rounds.map((r) =>
                r.id === roundId ? { ...r, ...updates, updated_at: new Date().toISOString() } : r,
              ),
            }))
            return
          }
          try {
            const { error } = await supabase
              .from(TABLES.ROUNDS)
              .update(updates)
              .eq('id', roundId)
            if (error) throw error
            set((state) => ({
              rounds: state.rounds.map((r) =>
                r.id === roundId ? { ...r, ...updates } : r,
              ),
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update round',
            })
          }
        },

        deleteRound: async (roundId) => {
          if (!isSupabaseConfigured()) {
            set((state) => ({
              rounds: state.rounds.filter((r) => r.id !== roundId),
            }))
            return
          }
          try {
            const { error } = await supabase
              .from(TABLES.ROUNDS)
              .delete()
              .eq('id', roundId)
            if (error) throw error
            set((state) => ({
              rounds: state.rounds.filter((r) => r.id !== roundId),
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to delete round',
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
