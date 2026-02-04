import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, getInitials, getAvatarColor } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Game } from '@/types'
import { getDemoUserName } from '@/lib/demo-data'
import { CURRENT_USER_ID } from '@/lib/demo-data'

interface MatchCardProps {
  game: Game
}

const gameTypeLabels: Record<string, string> = {
  match_play: 'Match Play',
  skins: 'Skins',
  nassau: 'Nassau',
  stroke: 'Stroke',
  best_ball: 'Best Ball',
  scramble: 'Scramble',
}

export function MatchCard({ game }: MatchCardProps) {
  const isUserInGame = game.player_ids.includes(CURRENT_USER_ID)
  const playerNames = game.player_ids.map((id) => getDemoUserName(id))

  const isVsGame = game.type === 'match_play' && game.player_ids.length === 2

  return (
    <Card className={cn('overflow-hidden', isUserInGame && 'ring-1 ring-fairway/30')}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-[10px]">
            {gameTypeLabels[game.type] ?? game.type}
          </Badge>
          <span className="font-stats text-sm font-semibold text-trophy">
            {formatCurrency(game.buy_in)}
          </span>
        </div>

        {isVsGame ? (
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1.5">
              <Avatar className="h-6 w-6">
                <AvatarFallback
                  style={{ backgroundColor: getAvatarColor(playerNames[0]) }}
                  className="text-white text-[9px]"
                >
                  {getInitials(playerNames[0])}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium truncate max-w-[60px]">
                {playerNames[0].split(' ')[0]}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-medium">vs</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium truncate max-w-[60px]">
                {playerNames[1].split(' ')[0]}
              </span>
              <Avatar className="h-6 w-6">
                <AvatarFallback
                  style={{ backgroundColor: getAvatarColor(playerNames[1]) }}
                  className="text-white text-[9px]"
                >
                  {getInitials(playerNames[1])}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            {game.player_ids.length} players
          </div>
        )}

        {isUserInGame && (
          <div className="mt-2 text-[10px] text-fairway font-medium text-center">
            You're in
          </div>
        )}
      </CardContent>
    </Card>
  )
}
