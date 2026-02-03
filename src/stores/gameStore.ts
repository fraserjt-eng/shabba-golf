import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Game, GameInsert } from '@/types'
import { supabase, TABLES, isSupabaseConfigured } from '@/lib/supabase'

interface GameState {
  games: Game[]
  loading: boolean
  error: string | null
  fetchGames: (roundId: string) => Promise<void>
  createGame: (game: GameInsert) => Promise<Game | null>
  updateResult: (gameId: string, results: Record<string, number>) => Promise<void>
  clearError: () => void
}

export const useGameStore = create<GameState>()(
  devtools(
    (set) => ({
      games: [],
      loading: false,
      error: null,

      fetchGames: async (roundId: string) => {
        if (!isSupabaseConfigured()) return
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase
            .from(TABLES.GAMES)
            .select('*')
            .eq('round_id', roundId)
            .order('created_at')
          if (error) throw error
          set({ games: data ?? [], loading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch games',
            loading: false,
          })
        }
      },

      createGame: async (game) => {
        if (!isSupabaseConfigured()) return null
        set({ loading: true, error: null })
        try {
          const { data, error } = await supabase
            .from(TABLES.GAMES)
            .insert(game)
            .select()
            .single()
          if (error) throw error
          set((state) => ({
            games: [...state.games, data],
            loading: false,
          }))
          return data
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create game',
            loading: false,
          })
          return null
        }
      },

      updateResult: async (gameId, results) => {
        if (!isSupabaseConfigured()) return
        set({ loading: true, error: null })
        try {
          const { error } = await supabase
            .from(TABLES.GAMES)
            .update({ results })
            .eq('id', gameId)
          if (error) throw error
          set((state) => ({
            games: state.games.map((g) =>
              g.id === gameId ? { ...g, results } : g,
            ),
            loading: false,
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update results',
            loading: false,
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'GameStore' },
  ),
)
