import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import { getDemoUser } from '@/lib/demo-data'

interface HeadToHeadProps {
  playerAId: string
  playerBId: string
  playerAWins: number
  playerBWins: number
}

export function HeadToHead({
  playerAId,
  playerBId,
  playerAWins,
  playerBWins,
}: HeadToHeadProps) {
  const playerA = getDemoUser(playerAId)
  const playerB = getDemoUser(playerBId)
  const nameA = playerA?.display_name ?? 'Unknown'
  const nameB = playerB?.display_name ?? 'Unknown'

  const aLeads = playerAWins > playerBWins
  const bLeads = playerBWins > playerAWins

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Player A */}
      <div className={cn('flex-1 flex items-center gap-2', aLeads && 'opacity-100', !aLeads && !bLeads ? 'opacity-100' : !aLeads ? 'opacity-70' : '')}>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback
            style={{ backgroundColor: getAvatarColor(nameA) }}
            className="text-white text-[10px] font-medium"
          >
            {getInitials(nameA)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className={cn('text-xs truncate', aLeads ? 'font-bold text-foreground' : 'font-medium text-muted-foreground')}>
            {nameA}
          </div>
          <div className={cn('font-stats text-lg', aLeads ? 'font-bold text-fairway' : 'font-semibold text-muted-foreground')}>
            {playerAWins}
          </div>
        </div>
      </div>

      {/* VS */}
      <div className="text-xs font-medium text-muted-foreground px-2">
        vs
      </div>

      {/* Player B */}
      <div className={cn('flex-1 flex items-center justify-end gap-2', bLeads && 'opacity-100', !bLeads && !aLeads ? 'opacity-100' : !bLeads ? 'opacity-70' : '')}>
        <div className="min-w-0 text-right">
          <div className={cn('text-xs truncate', bLeads ? 'font-bold text-foreground' : 'font-medium text-muted-foreground')}>
            {nameB}
          </div>
          <div className={cn('font-stats text-lg', bLeads ? 'font-bold text-fairway' : 'font-semibold text-muted-foreground')}>
            {playerBWins}
          </div>
        </div>
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback
            style={{ backgroundColor: getAvatarColor(nameB) }}
            className="text-white text-[10px] font-medium"
          >
            {getInitials(nameB)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
