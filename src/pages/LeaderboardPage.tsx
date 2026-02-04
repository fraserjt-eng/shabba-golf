import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollFadeIn } from '@/components/ui/scroll-fade-in'
import { Separator } from '@/components/ui/separator'
import { RankingRow } from '@/components/leaderboard/RankingRow'
import { WinningsChart } from '@/components/leaderboard/WinningsChart'
import { HeadToHead } from '@/components/leaderboard/HeadToHead'
import { PotTracker } from '@/components/leaderboard/PotTracker'
import { useBackoutStore } from '@/stores'
import {
  demoSeasonRecords,
  demoHeadToHead,
  CURRENT_USER_ID,
  getDemoUserName,
  demoBackoutFees,
} from '@/lib/demo-data'
import { Trophy, Swords, PiggyBank } from 'lucide-react'

export function LeaderboardPage() {
  const { fees, potTotal } = useBackoutStore()

  // Fetch backout fees on mount
  useEffect(() => {
    useBackoutStore.getState().fetchFees('demo-team-001')
  }, [])

  // Sort season records by net winnings descending for rankings
  const rankedRecords = [...demoSeasonRecords].sort(
    (a, b) => b.netWinnings - a.netWinnings,
  )

  // Winnings chart data
  const chartData = rankedRecords.map((r) => ({
    userId: r.userId,
    netWinnings: r.netWinnings,
  }))

  // Head-to-head records for current user
  const currentUserH2H = demoHeadToHead.filter(
    (h) => h.playerAId === CURRENT_USER_ID || h.playerBId === CURRENT_USER_ID,
  )

  // Build pot contributions from backout fees
  const pot = potTotal()
  const recentContributions = (fees.length > 0 ? fees : demoBackoutFees).map(
    (fee) => ({
      userName: getDemoUserName(fee.user_id),
      amount: fee.amount,
      reason: fee.reason ?? fee.timing.replace('_', ' '),
      date: fee.created_at,
    }),
  )

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <ScrollFadeIn>
        <div className="space-y-2">
          <h2 className="text-2xl font-light text-foreground">Leaderboard</h2>
          <p className="text-muted-foreground">
            Season rankings and standings.
          </p>
        </div>
      </ScrollFadeIn>

      {/* Rankings */}
      <ScrollFadeIn delay={100}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-trophy" />
              Rankings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {rankedRecords.map((record, index) => (
              <RankingRow
                key={record.userId}
                rank={index + 1}
                userId={record.userId}
                netWinnings={record.netWinnings}
                gamesPlayed={record.gamesPlayed}
                wins={record.wins}
                losses={record.losses}
              />
            ))}
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Net Winnings Chart */}
      <ScrollFadeIn delay={200}>
        <div className="bg-surface-green rounded-xl p-6">
          <h3 className="text-lg font-light text-dark-green mb-4">
            Net Winnings
          </h3>
          <WinningsChart data={chartData} />
        </div>
      </ScrollFadeIn>

      {/* Head-to-Head */}
      <ScrollFadeIn delay={300}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Swords className="h-5 w-5 text-muted-foreground" />
              Head-to-Head
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentUserH2H.length > 0 ? (
              <div className="space-y-1">
                {currentUserH2H.map((h2h, i) => (
                  <div key={`${h2h.playerAId}-${h2h.playerBId}`}>
                    <HeadToHead
                      playerAId={h2h.playerAId}
                      playerBId={h2h.playerBId}
                      playerAWins={h2h.playerAWins}
                      playerBWins={h2h.playerBWins}
                    />
                    {i < currentUserH2H.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No head-to-head records yet.
              </p>
            )}
          </CardContent>
        </Card>
      </ScrollFadeIn>

      {/* Pot Tracker */}
      <ScrollFadeIn delay={400}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-trophy" />
              Backout Pot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PotTracker
              potTotal={pot}
              recentContributions={recentContributions}
            />
          </CardContent>
        </Card>
      </ScrollFadeIn>
    </div>
  )
}
