import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserMinus, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface WithdrawButtonProps {
  onWithdraw: () => void
  fee: number
  feeLabel: string
}

export function WithdrawButton({ onWithdraw, fee, feeLabel }: WithdrawButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  if (showConfirm) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-trophy bg-trophy/10 rounded-lg px-3 py-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            {fee > 0
              ? `${feeLabel}: ${formatCurrency(fee)} will be charged`
              : 'Are you sure you want to withdraw?'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-11"
            onClick={() => setShowConfirm(false)}
          >
            Keep Spot
          </Button>
          <Button
            variant="destructive"
            className="flex-1 h-11"
            onClick={() => {
              onWithdraw()
              setShowConfirm(false)
            }}
          >
            Confirm Withdraw
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      className="w-full h-12 text-base font-medium text-muted-foreground border-dashed"
      size="lg"
      onClick={() => setShowConfirm(true)}
    >
      <UserMinus className="h-5 w-5 mr-2" />
      Withdraw
    </Button>
  )
}
