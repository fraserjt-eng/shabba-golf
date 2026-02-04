import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { VenmoButton } from './VenmoButton'
import { formatCurrency, getInitials, getAvatarColor, cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import type { SettlementStatus } from '@/types'

interface SettlementCardProps {
  fromUser: string
  toUser: string
  amount: number
  status: SettlementStatus
  toUserVenmo?: string
  onSettle?: () => void
}

const statusStyles: Record<SettlementStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-trophy/10 text-trophy border-trophy/20',
  },
  paid: {
    label: 'Paid',
    className: 'bg-fairway/10 text-fairway border-fairway/20',
  },
  disputed: {
    label: 'Disputed',
    className: 'bg-penalty/10 text-penalty border-penalty/20',
  },
  forgiven: {
    label: 'Forgiven',
    className: 'bg-muted text-muted-foreground border-border',
  },
}

export function SettlementCard({
  fromUser,
  toUser,
  amount,
  status,
  toUserVenmo,
  onSettle: _onSettle,
}: SettlementCardProps) {
  const isPending = status === 'pending'
  const style = statusStyles[status]

  return (
    <Card className={cn('overflow-hidden', isPending && 'ring-1 ring-trophy/20')}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className={cn('text-[10px]', style.className)}>
            {style.label}
          </Badge>
          <span className="font-stats text-sm font-semibold text-trophy">
            {formatCurrency(amount)}
          </span>
        </div>

        {/* From -> To */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <Avatar className="h-6 w-6">
              <AvatarFallback
                style={{ backgroundColor: getAvatarColor(fromUser) }}
                className="text-white text-[9px]"
              >
                {getInitials(fromUser)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium truncate max-w-[70px]">
              {fromUser.split(' ')[0]}
            </span>
          </div>

          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium truncate max-w-[70px]">
              {toUser.split(' ')[0]}
            </span>
            <Avatar className="h-6 w-6">
              <AvatarFallback
                style={{ backgroundColor: getAvatarColor(toUser) }}
                className="text-white text-[9px]"
              >
                {getInitials(toUser)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Venmo button for pending settlements */}
        {isPending && (
          <div className="flex items-center justify-center mt-3 pt-2 border-t border-border/50">
            <VenmoButton
              amount={amount}
              note={`ShaBBa Golf - ${fromUser.split(' ')[0]} to ${toUser.split(' ')[0]}`}
              recipientName={toUser}
              venmoUsername={toUserVenmo}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
