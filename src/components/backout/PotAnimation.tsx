import { formatCurrency } from '@/lib/utils'
import { Coins } from 'lucide-react'

interface PotAnimationProps {
  total: number
}

export function PotAnimation({ total }: PotAnimationProps) {
  return (
    <div className="flex items-center gap-3 animate-coin-drop">
      <div className="w-10 h-10 rounded-full bg-trophy/20 flex items-center justify-center">
        <Coins className="h-5 w-5 text-trophy" />
      </div>
      <div>
        <div className="text-xs text-white/60">Group Pot</div>
        <div className="font-stats text-xl font-bold text-white">
          {formatCurrency(total)}
        </div>
      </div>
    </div>
  )
}
