import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Game, GameInsert } from '@/types'
import { supabase, TABLES, isSupabaseConfigured } from '@/lib/supabase'
import { allDemoGames } from '@/lib/demo-data'

interface GameState {
  games: Game[]
  loading: boolean
  error: string | null
  fetchGames: (roundId: string) => Promise<void>
  createGame: (game: GameInsert) => Promise<Game | null>
  updateResult: (gameId: string, results: Record<string, number>) => Promise<void>
  settleGame: (gameId: string) => Promise<void>
  clearError: () => void
}

export const useGameStore = create<GameState>()(
  devtools(
    (set) => ({
      games: [],
      loading: false,
      error: null,

      fetchGames: async (roundId: string) => {
        if (!isSupabaseConfigured()) {
          const filtered = allDemoGames.filter((g) => g.round_id === roundId)
          set({ games: filtered, loading: false })
          return
        }
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
        if (!isSupabaseConfigured()) {
          const newGame: Game = {
            ...game,
            id: `demo-game-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          set((state) => ({
            games: [...state.games, newGame],
            loading: false,
          }))
          return newGame
        }
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
        if (!isSupabaseConfigured()) {
          set((state) => ({
            games: state.games.map((g) =>
              g.id === gameId ? { ...g, results } : g,
            ),
          }))
          return
        }
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

      settleGame: async (gameId) => {
        if (!isSupabaseConfigured()) {
          set((state) => ({
            games: state.games.map((g) =>
              g.id === gameId ? { ...g, settled: true } : g,
            ),
          }))
          return
        }
        try {
          const { error } = await supabase
            .from(TABLES.GAMES)
            .update({ settled: true })
            .eq('id', gameId)
          if (error) throw error
          set((state) => ({
            games: state.games.map((g) =>
              g.id === gameId ? { ...g, settled: true } : g,
            ),
          }))
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to settle game',
            loading: false,
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'GameStore' },
  ),
)
