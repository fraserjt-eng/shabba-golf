import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, cn } from '@/lib/utils'
import { getDemoUser, demoSeasonRecords } from '@/lib/demo-data'

interface PlayerStatsCardProps {
  userId: string
}

export function PlayerStatsCard({ userId }: PlayerStatsCardProps) {
  const user = getDemoUser(userId)
  const record = demoSeasonRecords.find((r) => r.userId === userId)

  if (!user) return null

  const stats = user.stats
  const streakLabel =
    record && record.currentStreak > 0
      ? `${record.currentStreak}W`
      : record && record.currentStreak < 0
        ? `${Math.abs(record.currentStreak)}L`
        : '—'

  const streakColor =
    record && record.currentStreak > 0
      ? 'text-fairway'
      : record && record.currentStreak < 0
        ? 'text-penalty'
        : 'text-muted-foreground'

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{user.display_name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="font-stats text-lg font-semibold">
              {stats?.rounds_played ?? 0}
            </div>
            <div className="text-[10px] text-muted-foreground">Rounds</div>
          </div>
          <div>
            <div className="font-stats text-lg font-semibold">
              {stats?.average_score ?? '—'}
            </div>
            <div className="text-[10px] text-muted-foreground">Avg Score</div>
          </div>
          <div>
            <div className="font-stats text-lg font-semibold">
              {stats?.best_score ?? '—'}
            </div>
            <div className="text-[10px] text-muted-foreground">Best Score</div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="font-stats text-lg font-semibold">
              {record ? `${record.wins}-${record.losses}` : '—'}
            </div>
            <div className="text-[10px] text-muted-foreground">W-L</div>
          </div>
          <div>
            <div className={cn('font-stats text-lg font-semibold', streakColor)}>
              {streakLabel}
            </div>
            <div className="text-[10px] text-muted-foreground">Streak</div>
          </div>
          <div>
            <div
              className={cn(
                'font-stats text-lg font-semibold',
                (record?.netWinnings ?? 0) > 0 && 'text-fairway',
                (record?.netWinnings ?? 0) < 0 && 'text-penalty',
              )}
            >
              {record ? formatCurrency(record.netWinnings) : '—'}
            </div>
            <div className="text-[10px] text-muted-foreground">Net</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
