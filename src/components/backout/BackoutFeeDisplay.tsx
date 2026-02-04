import { cn, formatCurrency } from '@/lib/utils'
import type { TeamSettings } from '@/types'

interface BackoutFeeDisplayProps {
  feeSchedule: TeamSettings['backout_fee_schedule']
  activeTier?: 'before_lock' | 'after_lock' | 'no_show'
}

const tiers = [
  { key: 'before_lock' as const, label: 'Before Lock' },
  { key: 'after_lock' as const, label: 'After Lock' },
  { key: 'no_show' as const, label: 'No Show' },
]

export function BackoutFeeDisplay({ feeSchedule, activeTier }: BackoutFeeDisplayProps) {
  return (
    <div className="flex gap-2">
      {tiers.map((tier) => (
        <div
          key={tier.key}
          className={cn(
            'flex-1 text-center rounded-lg py-2 px-1 transition-colors',
            activeTier === tier.key
              ? 'bg-white/20 ring-1 ring-white/30'
              : 'bg-white/5',
          )}
        >
          <div className="font-stats text-sm font-semibold text-white">
            {formatCurrency(feeSchedule[tier.key])}
          </div>
          <div className="text-[10px] text-white/60 mt-0.5">
            {tier.label}
          </div>
        </div>
      ))}
    </div>
  )
}
