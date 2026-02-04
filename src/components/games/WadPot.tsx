import { DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface WadPotProps {
  total: number
}

export function WadPot({ total }: WadPotProps) {
  return (
    <div className="flex items-center gap-2 bg-trophy/10 rounded-lg px-3 py-2">
      <DollarSign className="h-4 w-4 text-trophy" />
      <span className="text-sm font-medium text-trophy">
        WAD Pot: <span className="font-stats">{formatCurrency(total)}</span>
      </span>
    </div>
  )
}
