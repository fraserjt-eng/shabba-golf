import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { calculateCourseHandicap, calculateStrokesGiven } from '@/lib/ghin'
import { getInitials, getAvatarColor } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { User } from '@/types'

interface HandicapMatchupProps {
  playerA: User
  playerB: User
  slopeRating: number
  courseRating: number
  par: number
}

export function HandicapMatchup({
  playerA,
  playerB,
  slopeRating,
  courseRating,
  par,
}: HandicapMatchupProps) {
  const indexA = playerA.handicap_index ?? 0
  const indexB = playerB.handicap_index ?? 0

  const courseHcA = calculateCourseHandicap(indexA, slopeRating, courseRating, par)
  const courseHcB = calculateCourseHandicap(indexB, slopeRating, courseRating, par)

  const { strokesGiven, higherHandicapPlayer } = calculateStrokesGiven(
    indexA,
    indexB,
    slopeRating,
    courseRating,
    par,
  )

  const nameA = playerA.display_name
  const nameB = playerB.display_name

  const receivingPlayer = higherHandicapPlayer === 'A' ? nameA : nameB
  const givingPlayer = higherHandicapPlayer === 'A' ? nameB : nameA

  return (
    <div className="rounded-lg border bg-surface-green/50 p-3 space-y-3">
      {/* Side-by-side player comparison */}
      <div className="flex items-center justify-between">
        {/* Player A */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              style={{ backgroundColor: getAvatarColor(nameA) }}
              className="text-white text-[10px]"
            >
              {getInitials(nameA)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-center truncate max-w-[80px]">
            {nameA.split(' ')[0]}
          </span>
          <div className="space-y-0.5 text-center">
            <div className="text-[10px] text-muted-foreground">Index</div>
            <Badge variant="secondary" className="text-[10px] font-stats">
              {indexA.toFixed(1)}
            </Badge>
          </div>
          <div className="space-y-0.5 text-center">
            <div className="text-[10px] text-muted-foreground">Course HC</div>
            <span className="text-sm font-stats font-semibold text-fairway">
              {courseHcA}
            </span>
          </div>
        </div>

        {/* VS indicator */}
        <div className="flex flex-col items-center gap-1 px-2">
          <span className="text-xs font-medium text-muted-foreground">vs</span>
        </div>

        {/* Player B */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              style={{ backgroundColor: getAvatarColor(nameB) }}
              className="text-white text-[10px]"
            >
              {getInitials(nameB)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-center truncate max-w-[80px]">
            {nameB.split(' ')[0]}
          </span>
          <div className="space-y-0.5 text-center">
            <div className="text-[10px] text-muted-foreground">Index</div>
            <Badge variant="secondary" className="text-[10px] font-stats">
              {indexB.toFixed(1)}
            </Badge>
          </div>
          <div className="space-y-0.5 text-center">
            <div className="text-[10px] text-muted-foreground">Course HC</div>
            <span className="text-sm font-stats font-semibold text-fairway">
              {courseHcB}
            </span>
          </div>
        </div>
      </div>

      {/* Strokes given indicator */}
      {strokesGiven > 0 && (
        <div className="flex items-center justify-center gap-2 pt-1 border-t border-border/50">
          <span className="text-xs text-muted-foreground">{givingPlayer.split(' ')[0]}</span>
          <ArrowRight className="h-3 w-3 text-trophy" />
          <Badge className="bg-trophy/10 text-trophy border-trophy/20 text-[10px] font-stats">
            {strokesGiven} {strokesGiven === 1 ? 'stroke' : 'strokes'}
          </Badge>
          <ArrowRight className="h-3 w-3 text-trophy" />
          <span className="text-xs text-muted-foreground">{receivingPlayer.split(' ')[0]}</span>
        </div>
      )}

      {strokesGiven === 0 && (
        <div className="flex items-center justify-center pt-1 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground">Even match - no strokes given</span>
        </div>
      )}
    </div>
  )
}
