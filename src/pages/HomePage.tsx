import { useEffect, useMemo } from 'react'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { NextRoundCard } from '@/components/dashboard/NextRoundCard'
import { SeasonStats } from '@/components/dashboard/SeasonStats'
import { PlayerList } from '@/components/round/PlayerList'
import { GamesSection } from '@/components/games/GamesSection'
import { GroupPotCard } from '@/components/backout/GroupPotCard'
import { useUserStore, useTeamStore, useRoundStore, useGameStore, useBackoutStore } from '@/stores'
import { getDemoUser } from '@/lib/demo-data'
import { getGreeting } from '@/lib/utils'
import { getBackoutTiming } from '@/lib/round-utils'
import type { User } from '@/types'

export function HomePage() {
  const currentUser = useUserStore((s) => s.currentUser)
  const { activeTeamId, activeTeam: getActiveTeam } = useTeamStore()
  const activeTeam = getActiveTeam()
  const { rounds, fetchRounds, signUp, withdraw } = useRoundStore()
  const { games, fetchGames } = useGameStore()
  const { fees, fetchFees, potTotal } = useBackoutStore()

  // Fetch rounds + backout fees when team changes
  useEffect(() => {
    if (activeTeamId) {
      fetchRounds(activeTeamId)
      fetchFees(activeTeamId)
    }
  }, [activeTeamId, fetchRounds, fetchFees])

  // Find the next signup_open round
  const nextRound = useMemo(() => {
    return rounds
      .filter((r) => r.status === 'signup_open')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null
  }, [rounds])

  // Fetch games for the next round
  useEffect(() => {
    if (nextRound) {
      fetchGames(nextRound.id)
    }
  }, [nextRound, fetchGames])

  const isUserSignedUp = nextRound?.signed_up_ids.includes(currentUser?.id ?? '') ?? false

  // Resolve signed-up players to User objects
  const signedUpPlayers: User[] = useMemo(() => {
    if (!nextRound) return []
    return nextRound.signed_up_ids
      .map((id) => getDemoUser(id))
      .filter((u): u is User => u != null)
  }, [nextRound])

  // Core player IDs (first 5 members of the team)
  const corePlayerIds = useMemo(() => {
    return activeTeam?.member_ids.slice(0, 5) ?? []
  }, [activeTeam])

  const feeSchedule = activeTeam?.settings?.backout_fee_schedule ?? {
    before_lock: 5,
    after_lock: 15,
    no_show: 25,
  }

  const activeTier = nextRound
    ? getBackoutTiming(nextRound.date, nextRound.signup_deadline, feeSchedule).tier
    : undefined

  const firstName = currentUser?.display_name.split(' ')[0] ?? 'Golfer'

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome */}
      <ScrollFadeIn>
        <div className="space-y-1">
          <h2 className="text-2xl font-light text-foreground">
            {getGreeting()}, <span className="font-semibold text-fairway">{firstName}</span>
          </h2>
          {activeTeam && (
            <p className="text-sm text-muted-foreground">{activeTeam.name}</p>
          )}
        </div>
      </ScrollFadeIn>

      {/* Next Round Card */}
      {nextRound && (
        <ScrollFadeIn delay={100}>
          <NextRoundCard
            round={nextRound}
            isUserSignedUp={isUserSignedUp}
            onSignUp={() => currentUser && signUp(nextRound.id, currentUser.id)}
            onWithdraw={() => currentUser && withdraw(nextRound.id, currentUser.id)}
            feeSchedule={feeSchedule}
          />
        </ScrollFadeIn>
      )}

      {/* Player List */}
      {nextRound && signedUpPlayers.length > 0 && (
        <ScrollFadeIn delay={200}>
          <PlayerList
            players={signedUpPlayers}
            corePlayerIds={corePlayerIds}
          />
        </ScrollFadeIn>
      )}

      {/* Season Stats */}
      <ScrollFadeIn delay={300}>
        <SeasonStats stats={currentUser?.stats ?? null} />
      </ScrollFadeIn>

      {/* Games */}
      {nextRound && (
        <ScrollFadeIn delay={400}>
          <GamesSection games={games} />
        </ScrollFadeIn>
      )}

      {/* Group Pot */}
      <ScrollFadeIn delay={500}>
        <GroupPotCard
          potTotal={potTotal()}
          feeSchedule={feeSchedule}
          fees={fees}
          activeTier={activeTier}
        />
      </ScrollFadeIn>
    </div>
  )
}
