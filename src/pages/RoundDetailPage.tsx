import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { GamesSection } from '@/components/games/GamesSection'
import { SignUpButton } from '@/components/round/SignUpButton'
import { WithdrawButton } from '@/components/round/WithdrawButton'
import { SpotsIndicator } from '@/components/round/SpotsIndicator'
import { useUserStore, useTeamStore, useRoundStore, useGameStore } from '@/stores'
import { getDemoUser } from '@/lib/demo-data'
import { formatDate, formatTime, getInitials, getAvatarColor } from '@/lib/utils'
import { getRoundStatusLabel, getRoundStatusColor, getBackoutTiming } from '@/lib/round-utils'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Users,
  TrendingUp,
  Target,
  Flag,
  FileText,
} from 'lucide-react'
import type { User } from '@/types'

export function RoundDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const currentUser = useUserStore((s) => s.currentUser)
  const { activeTeam: getActiveTeam } = useTeamStore()
  const activeTeam = getActiveTeam()
  const { rounds, signUp, withdraw } = useRoundStore()
  const { games, fetchGames } = useGameStore()

  const round = useMemo(() => {
    return rounds.find((r) => r.id === id) ?? null
  }, [rounds, id])

  // Fetch games for this round
  useEffect(() => {
    if (round) {
      fetchGames(round.id)
    }
  }, [round, fetchGames])

  const isUserSignedUp = round?.signed_up_ids.includes(currentUser?.id ?? '') ?? false

  // Resolve signed-up players to User objects
  const signedUpPlayers: User[] = useMemo(() => {
    if (!round) return []
    return round.signed_up_ids
      .map((uid) => getDemoUser(uid))
      .filter((u): u is User => u != null)
  }, [round])

  // Core player IDs (first 5 members of the team)
  const corePlayerIds = useMemo(() => {
    return activeTeam?.member_ids.slice(0, 5) ?? []
  }, [activeTeam])

  const feeSchedule = activeTeam?.settings?.backout_fee_schedule ?? {
    before_lock: 5,
    after_lock: 15,
    no_show: 25,
  }

  if (!round) {
    return (
      <div className="px-4 py-6 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Round not found.</p>
        </div>
      </div>
    )
  }

  const backoutInfo = getBackoutTiming(round.date, round.signup_deadline, feeSchedule)
  const spotsLeft = (round.max_players ?? 8) - round.signed_up_ids.length
  const isFull = spotsLeft <= 0
  const statusColor = getRoundStatusColor(round.status)

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Back Button */}
      <ScrollFadeIn>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </ScrollFadeIn>

      {/* Main Round Card */}
      <ScrollFadeIn delay={100}>
        <Card className="overflow-hidden">
          <div className="h-1.5 bg-fairway" />
          <CardContent className="pt-5 pb-4 space-y-4">
            {/* Status + Date */}
            <div className="flex items-center justify-between">
              <Badge className={statusColor}>
                {getRoundStatusLabel(round.status)}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">{formatDate(round.date)}</span>
              </div>
            </div>

            {/* Course Name */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-fairway shrink-0" />
                <h1 className="text-xl font-semibold text-foreground truncate">
                  {round.course_name}
                </h1>
              </div>
              {round.tee_time && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{formatTime(round.tee_time)} Tee Time</span>
                </div>
              )}
            </div>

            {/* Course Info Chips */}
            <div className="flex flex-wrap gap-2">
              {round.slope_rating != null && (
                <div className="flex items-center gap-1.5 bg-fairway/10 text-fairway rounded-full px-3 py-1 text-xs font-medium">
                  <TrendingUp className="h-3 w-3" />
                  Slope {round.slope_rating}
                </div>
              )}
              {round.course_rating != null && (
                <div className="flex items-center gap-1.5 bg-sky/10 text-sky rounded-full px-3 py-1 text-xs font-medium">
                  <Target className="h-3 w-3" />
                  Rating {round.course_rating}
                </div>
              )}
              {round.par != null && (
                <div className="flex items-center gap-1.5 bg-trophy/10 text-trophy rounded-full px-3 py-1 text-xs font-medium">
                  <Flag className="h-3 w-3" />
                  Par {round.par}
                </div>
              )}
            </div>

            {/* Spots */}
            <div className="space-y-2">
              <SpotsIndicator
                filled={round.signed_up_ids.length}
                total={round.max_players ?? 8}
              />
              <p className="text-xs text-muted-foreground">
                {round.signed_up_ids.length} of {round.max_players ?? 8} spots filled
                {isFull && ' -- Full!'}
              </p>
            </div>

            {/* Sign Up / Withdraw */}
            {round.status === 'signup_open' && (
              isUserSignedUp ? (
                <WithdrawButton
                  onWithdraw={() => currentUser && withdraw(round.id, currentUser.id)}
                  fee={backoutInfo.fee}
                  feeLabel={backoutInfo.label}
                />
              ) : (
                <SignUpButton
                  onSignUp={() => currentUser && signUp(round.id, currentUser.id)}
                  disabled={isFull}
                />
              )
            )}

            {/* Notes */}
            {round.notes && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground italic border-l-2 border-fairway/30 pl-3">
                <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                {round.notes}
              </div>
            )}
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Player List */}
      <ScrollFadeIn delay={200}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-fairway" />
              Signed Up ({signedUpPlayers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {signedUpPlayers.length > 0 ? (
              <div className="divide-y divide-border/50">
                {signedUpPlayers.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-colors ${
                      player.id === currentUser?.id ? 'bg-fairway/5' : ''
                    }`}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={player.avatar_url ?? undefined} alt={player.display_name} />
                      <AvatarFallback
                        style={{ backgroundColor: getAvatarColor(player.display_name) }}
                        className="text-white text-xs font-medium"
                      >
                        {getInitials(player.display_name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium truncate ${
                          player.id === currentUser?.id ? 'text-fairway' : ''
                        }`}>
                          {player.display_name}
                          {player.id === currentUser?.id && (
                            <span className="text-muted-foreground font-normal"> (You)</span>
                          )}
                        </span>
                      </div>
                      {player.handicap != null && (
                        <span className="text-xs text-muted-foreground">
                          {player.handicap} HCP
                        </span>
                      )}
                    </div>

                    <Badge
                      variant={corePlayerIds.includes(player.id) ? 'default' : 'secondary'}
                      className="text-[10px] shrink-0"
                    >
                      {corePlayerIds.includes(player.id) ? 'Core' : 'Sub'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No players signed up yet. Be the first!
              </p>
            )}
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Games Section */}
      <ScrollFadeIn delay={300}>
        <GamesSection games={games} />
      </ScrollFadeIn>
    </div>
  )
}
