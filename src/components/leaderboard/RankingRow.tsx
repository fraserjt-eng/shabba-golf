import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, getInitials, getAvatarColor, formatCurrency } from '@/lib/utils'
import { getDemoUser, CURRENT_USER_ID } from '@/lib/demo-data'

interface RankingRowProps {
  rank: number
  userId: string
  netWinnings: number
  gamesPlayed: number
  wins: number
  losses: number
}

function getRankDisplay(rank: number): string {
  switch (rank) {
    case 1:
      return '\u{1F947}'
    case 2:
      return '\u{1F948}'
    case 3:
      return '\u{1F949}'
    default:
      return `${rank}`
  }
}

export function RankingRow({
  rank,
  userId,
  netWinnings,
  gamesPlayed,
  wins,
  losses,
}: RankingRowProps) {
  const user = getDemoUser(userId)
  const isCurrentUser = userId === CURRENT_USER_ID
  const displayName = user?.display_name ?? 'Unknown Player'

  return (
    <div
      className={cn(
        'flex items-center gap-3 py-3 px-3 rounded-lg transition-colors',
        isCurrentUser && 'bg-fairway/10 ring-1 ring-fairway/20',
      )}
    >
      {/* Rank */}
      <div className="w-8 text-center shrink-0">
        <span className={cn('text-sm font-semibold', rank <= 3 ? 'text-lg' : 'text-muted-foreground')}>
          {getRankDisplay(rank)}
        </span>
      </div>

      {/* Avatar */}
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback
          style={{ backgroundColor: getAvatarColor(displayName) }}
          className="text-white text-xs font-medium"
        >
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>

      {/* Name & Record */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={cn('text-sm font-medium truncate', isCurrentUser && 'text-fairway')}>
            {displayName}
          </span>
          {isCurrentUser && (
            <span className="text-xs text-muted-foreground font-normal">(You)</span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {wins}W-{losses}L ({gamesPlayed} games)
        </span>
      </div>

      {/* Net Winnings */}
      <div className="text-right shrink-0">
        <span
          className={cn(
            'font-stats text-sm font-semibold',
            netWinnings > 0 && 'text-fairway',
            netWinnings < 0 && 'text-penalty',
            netWinnings === 0 && 'text-muted-foreground',
          )}
        >
          {netWinnings >= 0 ? '+' : ''}{formatCurrency(netWinnings)}
        </span>
      </div>
    </div>
  )
}
