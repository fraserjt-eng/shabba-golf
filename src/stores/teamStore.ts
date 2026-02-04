import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Team, TeamInsert } from '@/types'
import { supabase, TABLES, isSupabaseConfigured } from '@/lib/supabase'
import { demoTeams } from '@/lib/demo-data'

interface TeamState {
  teams: Team[]
  activeTeamId: string | null
  loading: boolean
  error: string | null
  fetchTeams: () => Promise<void>
  setActiveTeam: (teamId: string) => void
  createTeam: (team: TeamInsert) => Promise<Team | null>
  updateTeam: (teamId: string, updates: Partial<TeamInsert>) => Promise<void>
  addMember: (teamId: string, userId: string) => void
  removeMember: (teamId: string, userId: string) => Promise<void>
  updateMemberRole: (teamId: string, userId: string, role: 'admin' | 'member') => Promise<void>
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
          if (!isSupabaseConfigured()) {
            set({ teams: demoTeams, loading: false })
            const { activeTeamId } = get()
            if (!activeTeamId && demoTeams.length > 0) {
              set({ activeTeamId: demoTeams[0].id })
            }
            return
          }
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

        updateTeam: async (teamId, updates) => {
          if (!isSupabaseConfigured()) {
            // Demo mode: update in local state
            set((state) => ({
              teams: state.teams.map((t) =>
                t.id === teamId
                  ? { ...t, ...updates, updated_at: new Date().toISOString() }
                  : t,
              ),
            }))
            return
          }
          set({ loading: true, error: null })
          try {
            const { error } = await supabase
              .from(TABLES.TEAMS)
              .update(updates)
              .eq('id', teamId)
            if (error) throw error
            set((state) => ({
              teams: state.teams.map((t) =>
                t.id === teamId
                  ? { ...t, ...updates, updated_at: new Date().toISOString() }
                  : t,
              ),
              loading: false,
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update team',
              loading: false,
            })
          }
        },

        addMember: (teamId, userId) => {
          const team = get().teams.find((t) => t.id === teamId)
          if (!team || team.member_ids.includes(userId)) return
          set((state) => ({
            teams: state.teams.map((t) =>
              t.id === teamId
                ? { ...t, member_ids: [...t.member_ids, userId], updated_at: new Date().toISOString() }
                : t,
            ),
          }))
        },

        removeMember: async (teamId, userId) => {
          const team = get().teams.find((t) => t.id === teamId)
          if (!team) return

          const newMemberIds = team.member_ids.filter((id) => id !== userId)
          const newAdminIds = team.admin_ids.filter((id) => id !== userId)

          if (!isSupabaseConfigured()) {
            set((state) => ({
              teams: state.teams.map((t) =>
                t.id === teamId
                  ? { ...t, member_ids: newMemberIds, admin_ids: newAdminIds, updated_at: new Date().toISOString() }
                  : t,
              ),
            }))
            return
          }
          set({ loading: true, error: null })
          try {
            const { error } = await supabase
              .from(TABLES.TEAMS)
              .update({ member_ids: newMemberIds, admin_ids: newAdminIds })
              .eq('id', teamId)
            if (error) throw error
            set((state) => ({
              teams: state.teams.map((t) =>
                t.id === teamId
                  ? { ...t, member_ids: newMemberIds, admin_ids: newAdminIds, updated_at: new Date().toISOString() }
                  : t,
              ),
              loading: false,
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to remove member',
              loading: false,
            })
          }
        },

        updateMemberRole: async (teamId, userId, role) => {
          const team = get().teams.find((t) => t.id === teamId)
          if (!team) return

          let newAdminIds: string[]
          if (role === 'admin') {
            newAdminIds = team.admin_ids.includes(userId)
              ? team.admin_ids
              : [...team.admin_ids, userId]
          } else {
            newAdminIds = team.admin_ids.filter((id) => id !== userId)
          }

          if (!isSupabaseConfigured()) {
            set((state) => ({
              teams: state.teams.map((t) =>
                t.id === teamId
                  ? { ...t, admin_ids: newAdminIds, updated_at: new Date().toISOString() }
                  : t,
              ),
            }))
            return
          }
          set({ loading: true, error: null })
          try {
            const { error } = await supabase
              .from(TABLES.TEAMS)
              .update({ admin_ids: newAdminIds })
              .eq('id', teamId)
            if (error) throw error
            set((state) => ({
              teams: state.teams.map((t) =>
                t.id === teamId
                  ? { ...t, admin_ids: newAdminIds, updated_at: new Date().toISOString() }
                  : t,
              ),
              loading: false,
            }))
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to update member role',
              loading: false,
            })
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
