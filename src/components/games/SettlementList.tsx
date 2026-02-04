import { SettlementCard } from './SettlementCard'
import type { Settlement } from '@/types'

interface SettlementListProps {
  settlements: Settlement[]
  getUserName: (userId: string) => string
  onSettle?: (settlementId: string) => void
}

export function SettlementList({
  settlements,
  getUserName,
  onSettle,
}: SettlementListProps) {
  if (settlements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No settlements to show.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {settlements.map((settlement) => (
        <SettlementCard
          key={settlement.id}
          fromUser={getUserName(settlement.from_user_id)}
          toUser={getUserName(settlement.to_user_id)}
          amount={settlement.amount}
          status={settlement.status}
          onSettle={onSettle ? () => onSettle(settlement.id) : undefined}
        />
      ))}
    </div>
  )
}
