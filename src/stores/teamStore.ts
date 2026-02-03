import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Team, TeamInsert } from '@/types'
import { supabase, TABLES, isSupabaseConfigured } from '@/lib/supabase'

interface TeamState {
  teams: Team[]
  activeTeamId: string | null
  loading: boolean
  error: string | null
  fetchTeams: () => Promise<void>
  setActiveTeam: (teamId: string) => void
  createTeam: (team: TeamInsert) => Promise<Team | null>
  activeTeam: () => Team | undefined
  clearError: () => void
}

export const useTeamStore = create<TeamState>()(
  devtools(
    persist(
      (set, get) => ({
        teams: [],
        activeTeamId: null,
        loading: false,
        error: null,

        fetchTeams: async () => {
          if (!isSupabaseConfigured()) return
          set({ loading: true, error: null })
          try {
            const { data, error } = await supabase
              .from(TABLES.TEAMS)
              .select('*')
              .order('name')
            if (error) throw error
            set({ teams: data ?? [], loading: false })
            // Auto-select first team if none active
            const { activeTeamId } = get()
            if (!activeTeamId && data && data.length > 0) {
              set({ activeTeamId: data[0].id })
            }
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch teams',
              loading: false,
            })
          }
        },

        setActiveTeam: (teamId) => set({ activeTeamId: teamId }),

        createTeam: async (team) => {
          if (!isSupabaseConfigured()) return null
          set({ loading: true, error: null })
          try {
            const { data, error } = await supabase
              .from(TABLES.TEAMS)
              .insert(team)
              .select()
              .single()
            if (error) throw error
            set((state) => ({
              teams: [...state.teams, data],
              activeTeamId: data.id,
              loading: false,
            }))
            return data
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to create team',
              loading: false,
            })
            return null
          }
        },

        activeTeam: () => {
          const { teams, activeTeamId } = get()
          return teams.find((t) => t.id === activeTeamId)
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'golf-squad-team',
        partialize: (state) => ({
          activeTeamId: state.activeTeamId,
          teams: state.teams,
        }),
      },
    ),
    { name: 'TeamStore' },
  ),
)
