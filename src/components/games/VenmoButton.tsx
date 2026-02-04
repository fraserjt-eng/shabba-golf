import { Button } from '@/components/ui/button'
import { DollarSign } from 'lucide-react'
import { getVenmoDeepLink } from '@/lib/settlement-utils'

interface VenmoButtonProps {
  amount: number
  note: string
  recipientName: string
  venmoUsername?: string
}

export function VenmoButton({ amount, note, recipientName, venmoUsername }: VenmoButtonProps) {
  const handleClick = () => {
    const deepLink = getVenmoDeepLink(amount, note, venmoUsername)
    window.open(deepLink, '_blank')
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="gap-1.5 border-trophy/30 text-trophy hover:bg-trophy/10 hover:text-trophy"
    >
      <DollarSign className="h-3.5 w-3.5" />
      <span className="font-stats text-xs">
        Pay {recipientName.split(' ')[0]} ${amount.toFixed(0)}
      </span>
    </Button>
  )
}
