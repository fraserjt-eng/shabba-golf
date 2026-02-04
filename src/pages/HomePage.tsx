import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { NextRoundCard } from '@/components/dashboard/NextRoundCard'
import { SeasonStats } from '@/components/dashboard/SeasonStats'
import { RoundSignupList } from '@/components/round/RoundSignupList'
import { GamesSection } from '@/components/games/GamesSection'
import { GroupPotCard } from '@/components/backout/GroupPotCard'
import { RoundHistoryCard } from '@/components/round/RoundHistoryCard'
import { CreateRoundModal } from '@/components/round/CreateRoundModal'
import { Button } from '@/components/ui/button'
import { useUserStore, useTeamStore, useRoundStore, useGameStore, useBackoutStore } from '@/stores'
import { getDemoUser, VENMO_COLLECTOR_ID, LEAGUE_BUY_IN } from '@/lib/demo-data'
import { getGreeting } from '@/lib/utils'
import { getBackoutTiming } from '@/lib/round-utils'
import { CalendarPlus, History, ExternalLink, DollarSign } from 'lucide-react'
import type { User } from '@/types'

export function HomePage() {
  const navigate = useNavigate()
  const currentUser = useUserStore((s) => s.currentUser)
  const { activeTeamId, activeTeam: getActiveTeam } = useTeamStore()
  const activeTeam = getActiveTeam()
  const { rounds, fetchRounds, signUp, withdraw } = useRoundStore()
  const { games, fetchGames } = useGameStore()
  const { fees, fetchFees, potTotal } = useBackoutStore()
  const [showCreateRound, setShowCreateRound] = useState(false)

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

  // Find second upcoming round (for "Upcoming Rounds" section)
  const upcomingRounds = useMemo(() => {
    return rounds
      .filter((r) => r.status === 'signup_open' || r.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(1, 3) // skip the first one (shown in NextRoundCard)
  }, [rounds])

  // Fetch games for the next round
  useEffect(() => {
    if (nextRound) {
      fetchGames(nextRound.id)
    }
  }, [nextRound, fetchGames])

  const isUserSignedUp = nextRound?.signed_up_ids.includes(currentUser?.id ?? '') ?? false

  // All team members resolved to User objects
  const allTeamMembers: User[] = useMemo(() => {
    if (!activeTeam) return []
    return activeTeam.member_ids
      .map((id) => getDemoUser(id))
      .filter((u): u is User => u != null)
  }, [activeTeam])

  const isAdmin = activeTeam?.admin_ids.includes(currentUser?.id ?? '') ?? false

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
    <div className="space-y-6">
      {/* Hero banner with course image dissolve */}
      <div className="hero-dissolve -mt-[calc(2rem+3rem)] h-[55vh] min-h-[360px]">
        <img
          src="/images/hero-course.jpg"
          alt="Golf course panorama"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="hero-overlay absolute inset-0" />
        {/* Welcome text overlaid on hero */}
        <div className="absolute inset-0 flex items-end z-10 px-4 pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-light text-white drop-shadow-lg">
              {getGreeting()}, <span className="font-bold">{firstName}</span>
            </h2>
            {activeTeam && (
              <p className="text-sm text-white/70 drop-shadow font-medium">{activeTeam.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="px-4 -mt-2">
        <ScrollFadeIn>
          <div className="flex items-center justify-end">
            <Button
              size="sm"
              className="gap-1.5 bg-fairway hover:bg-fairway-dark text-white shadow-md"
              onClick={() => setShowCreateRound(true)}
            >
              <CalendarPlus className="h-4 w-4" />
              New Round
            </Button>
          </div>
        </ScrollFadeIn>
      </div>

      <div className="px-4 space-y-6">
        {/* External Links */}
        <ScrollFadeIn delay={100}>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://bunkerhillsgolf.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fairway hover:text-fairway-dark transition-colors bg-fairway/10 rounded-full px-3 py-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Bunker Hills Golf Course
            </a>
            <a
              href="https://bhmc.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-sky hover:text-sky-dark transition-colors bg-sky/10 rounded-full px-3 py-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              BHMC
            </a>
          </div>
        </ScrollFadeIn>

        {/* Buy-in / Venmo reminder */}
        <ScrollFadeIn delay={200}>
          <div className="flex items-center gap-3 bg-trophy/10 border border-trophy/20 rounded-lg px-4 py-3">
            <DollarSign className="h-5 w-5 text-trophy shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-trophy">${LEAGUE_BUY_IN}/person</span>
              <span className="text-muted-foreground"> buy-in each week &mdash; Venmo </span>
              <span className="font-medium">@{getDemoUser(VENMO_COLLECTOR_ID)?.venmo_username ?? 'Cole-Buffington'}</span>
            </div>
          </div>
        </ScrollFadeIn>

        {/* Next Round Card */}
        {nextRound && (
          <ScrollFadeIn delay={300}>
            <NextRoundCard
              round={nextRound}
              isUserSignedUp={isUserSignedUp}
              onSignUp={() => currentUser && signUp(nextRound.id, currentUser.id)}
              onWithdraw={() => currentUser && withdraw(nextRound.id, currentUser.id)}
              feeSchedule={feeSchedule}
            />
          </ScrollFadeIn>
        )}

        {/* Round Signup List — all team members */}
        {nextRound && allTeamMembers.length > 0 && (
          <ScrollFadeIn delay={400}>
            <RoundSignupList
              members={allTeamMembers}
              signedUpIds={nextRound.signed_up_ids}
              onToggleSignup={(userId) => {
                if (nextRound.signed_up_ids.includes(userId)) {
                  withdraw(nextRound.id, userId)
                } else {
                  signUp(nextRound.id, userId)
                }
              }}
              isAdmin={isAdmin}
            />
          </ScrollFadeIn>
        )}

        {/* Upcoming Rounds */}
        {upcomingRounds.length > 0 && (
          <ScrollFadeIn delay={500}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Upcoming Rounds
                </h3>
                <button
                  onClick={() => navigate('/rounds')}
                  className="text-xs text-fairway font-medium hover:underline flex items-center gap-1"
                >
                  <History className="h-3 w-3" />
                  View All
                </button>
              </div>
              {upcomingRounds.map((round) => (
                <RoundHistoryCard key={round.id} round={round} />
              ))}
            </div>
          </ScrollFadeIn>
        )}

        {/* Season Stats */}
        <ScrollFadeIn delay={300}>
          <SeasonStats stats={currentUser?.stats ?? null} />
        </ScrollFadeIn>

        {/* Games */}
        {nextRound && (
          <ScrollFadeIn delay={400}>
            <GamesSection games={games} roundId={nextRound.id} signedUpPlayerIds={nextRound.signed_up_ids} />
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

      <CreateRoundModal open={showCreateRound} onClose={() => setShowCreateRound(false)} />
    </div>
  )
}
