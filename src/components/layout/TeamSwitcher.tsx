import { ChevronDown } from 'lucide-react'
import { useTeamStore } from '@/stores'

export function TeamSwitcher() {
  const { teams, activeTeamId, setActiveTeam } = useTeamStore()

  if (teams.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">No teams</span>
    )
  }

  return (
    <div className="relative">
      <select
        value={activeTeamId ?? ''}
        onChange={(e) => setActiveTeam(e.target.value)}
        className="appearance-none bg-transparent text-sm font-medium text-foreground pr-6 py-1 cursor-pointer focus:outline-none"
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  )
}
