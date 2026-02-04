import { formatCurrency, getRelativeTime } from '@/lib/utils'
import { getDemoUserName } from '@/lib/demo-data'
import type { BackoutFee } from '@/types'

interface BackoutHistoryProps {
  fees: BackoutFee[]
}

export function BackoutHistory({ fees }: BackoutHistoryProps) {
  if (fees.length === 0) {
    return (
      <p className="text-xs text-white/50 text-center py-2">
        No recent backouts
      </p>
    )
  }

  return (
    <div className="space-y-1.5">
      <div className="text-xs text-white/60 font-medium">Recent</div>
      {fees.map((fee) => (
        <div key={fee.id} className="flex items-center justify-between text-xs">
          <span className="text-white/80">
            {getDemoUserName(fee.user_id)}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-stats text-penalty font-medium">
              -{formatCurrency(fee.amount)}
            </span>
            <span className="text-white/40">
              {getRelativeTime(fee.created_at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
