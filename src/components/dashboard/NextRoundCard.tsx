import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SpotsIndicator } from '@/components/round/SpotsIndicator'
import { SignUpButton } from '@/components/round/SignUpButton'
import { WithdrawButton } from '@/components/round/WithdrawButton'
import { MapPin, Clock } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'
import { getRoundStatusLabel, getRoundStatusColor, getBackoutTiming } from '@/lib/round-utils'
import type { Round, TeamSettings } from '@/types'

interface NextRoundCardProps {
  round: Round
  isUserSignedUp: boolean
  onSignUp: () => void
  onWithdraw: () => void
  feeSchedule: TeamSettings['backout_fee_schedule']
}

export function NextRoundCard({
  round,
  isUserSignedUp,
  onSignUp,
  onWithdraw,
  feeSchedule,
}: NextRoundCardProps) {
  const backoutInfo = getBackoutTiming(round.date, round.signup_deadline, feeSchedule)
  const spotsLeft = (round.max_players ?? 8) - round.signed_up_ids.length
  const isFull = spotsLeft <= 0

  return (
    <Card className="overflow-hidden">
      <div className="h-1 bg-fairway" />
      <CardContent className="pt-5 pb-4 space-y-4">
        {/* Status + Date */}
        <div className="flex items-center justify-between">
          <Badge className={getRoundStatusColor(round.status)}>
            {getRoundStatusLabel(round.status)}
          </Badge>
          <span className="text-sm font-medium text-foreground">
            {formatDate(round.date)}
          </span>
        </div>

        {/* Course + Time */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-fairway shrink-0" />
            <span className="text-lg font-semibold text-foreground truncate">
              {round.course_name}
            </span>
          </div>
          {round.tee_time && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="text-sm">{formatTime(round.tee_time)} Tee Time</span>
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
            {isFull && ' — Full!'}
          </p>
        </div>

        {/* Action */}
        {round.status === 'signup_open' && (
          isUserSignedUp ? (
            <WithdrawButton
              onWithdraw={onWithdraw}
              fee={backoutInfo.fee}
              feeLabel={backoutInfo.label}
            />
          ) : (
            <SignUpButton
              onSignUp={onSignUp}
              disabled={isFull}
            />
          )
        )}

        {/* Notes */}
        {round.notes && (
          <p className="text-xs text-muted-foreground italic border-l-2 border-fairway/30 pl-3">
            {round.notes}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
