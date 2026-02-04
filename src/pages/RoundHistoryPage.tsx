import { useEffect, useMemo, useState } from 'react'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { Button } from '@/components/ui/button'
import { RoundHistoryCard } from '@/components/round/RoundHistoryCard'
import { CreateRoundModal } from '@/components/round/CreateRoundModal'
import { useTeamStore, useRoundStore } from '@/stores'
import { CalendarPlus, History, CalendarDays } from 'lucide-react'

export function RoundHistoryPage() {
  const { activeTeamId, activeTeam: getActiveTeam } = useTeamStore()
  const activeTeam = getActiveTeam()
  const { rounds, fetchRounds } = useRoundStore()

  const [showCreateModal, setShowCreateModal] = useState(false)

  // Fetch rounds when team changes
  useEffect(() => {
    if (activeTeamId) {
      fetchRounds(activeTeamId)
    }
  }, [activeTeamId, fetchRounds])

  // Filter rounds by active team and group into upcoming/active and completed
  const teamRounds = useMemo(() => {
    return rounds.filter((r) => r.team_id === activeTeamId)
  }, [rounds, activeTeamId])

  const upcomingRounds = useMemo(() => {
    return teamRounds
      .filter((r) => r.status !== 'completed' && r.status !== 'cancelled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [teamRounds])

  const completedRounds = useMemo(() => {
    return teamRounds
      .filter((r) => r.status === 'completed' || r.status === 'cancelled')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [teamRounds])

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <ScrollFadeIn>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-light text-foreground">
              Round History
            </h2>
            {activeTeam && (
              <p className="text-sm text-muted-foreground">{activeTeam.name}</p>
            )}
          </div>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <CalendarPlus className="h-4 w-4" />
            New Round
          </Button>
        </div>
      </ScrollFadeIn>

      {/* Upcoming / Active Rounds */}
      {upcomingRounds.length > 0 && (
        <ScrollFadeIn delay={100}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-fairway" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                Upcoming & Active
              </h3>
            </div>
            <div className="space-y-2">
              {upcomingRounds.map((round) => (
                <RoundHistoryCard key={round.id} round={round} />
              ))}
            </div>
          </div>
        </ScrollFadeIn>
      )}

      {/* Completed Rounds */}
      <ScrollFadeIn delay={upcomingRounds.length > 0 ? 200 : 100}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Completed
            </h3>
          </div>
          {completedRounds.length > 0 ? (
            <div className="space-y-2">
              {completedRounds.map((round) => (
                <RoundHistoryCard key={round.id} round={round} />
              ))}
            </div>
          ) : (
            <div className="bg-surface-green rounded-xl p-6">
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No completed rounds yet. Get out there and play!
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollFadeIn>

      {/* Empty state when no rounds at all */}
      {teamRounds.length === 0 && (
        <ScrollFadeIn delay={200}>
          <div className="bg-surface-green rounded-xl p-8 text-center space-y-4">
            <CalendarDays className="h-12 w-12 text-fairway/40 mx-auto" />
            <div className="space-y-1">
              <p className="text-lg font-medium text-foreground">No rounds scheduled</p>
              <p className="text-sm text-muted-foreground">
                Create a round to get your squad on the course.
              </p>
            </div>
            <Button
              className="gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <CalendarPlus className="h-4 w-4" />
              Create First Round
            </Button>
          </div>
        </ScrollFadeIn>
      )}

      {/* Create Round Modal */}
      <CreateRoundModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  )
}
