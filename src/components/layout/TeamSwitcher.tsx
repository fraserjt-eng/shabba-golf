import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Plus, Users } from 'lucide-react'
import { useTeamStore } from '@/stores'
import { cn } from '@/lib/utils'

export function TeamSwitcher() {
  const { teams, activeTeamId, setActiveTeam } = useTeamStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  if (teams.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">No teams</span>
    )
  }

  const activeTeam = teams.find((t) => t.id === activeTeamId)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 min-h-[44px] px-2 py-1 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
      >
        <Users className="h-4 w-4 text-fairway shrink-0" />
        <span className="text-sm font-medium text-foreground truncate max-w-[140px]">
          {activeTeam?.name ?? 'Select Team'}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-lg border border-border z-50 animate-dropdown-in overflow-hidden">
          <div className="py-1">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => {
                  setActiveTeam(team.id)
                  setOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {team.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {team.member_ids.length} members
                  </div>
                </div>
                {team.id === activeTeamId && (
                  <Check className="h-4 w-4 text-fairway shrink-0" />
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-border">
            <button
              onClick={() => {
                setOpen(false)
                alert('Team creation coming in Phase 2!')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <Plus className="h-4 w-4 text-fairway" />
              <span className="text-sm font-medium text-fairway">Create New Team</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
