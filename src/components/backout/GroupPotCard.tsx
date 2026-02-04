import { PotAnimation } from './PotAnimation'
import { BackoutFeeDisplay } from './BackoutFeeDisplay'
import { BackoutHistory } from './BackoutHistory'
import { Separator } from '@/components/ui/separator'
import type { TeamSettings, BackoutFee } from '@/types'

interface GroupPotCardProps {
  potTotal: number
  feeSchedule: TeamSettings['backout_fee_schedule']
  fees: BackoutFee[]
  activeTier?: 'before_lock' | 'after_lock' | 'no_show'
}

export function GroupPotCard({ potTotal, feeSchedule, fees, activeTier }: GroupPotCardProps) {
  return (
    <div className="bg-dark-green rounded-xl p-5 space-y-4">
      <PotAnimation total={potTotal} />
      <Separator className="bg-white/10" />
      <div>
        <div className="text-xs text-white/60 font-medium mb-2">Backout Fees</div>
        <BackoutFeeDisplay feeSchedule={feeSchedule} activeTier={activeTier} />
      </div>
      <Separator className="bg-white/10" />
      <BackoutHistory fees={fees} />
    </div>
  )
}
