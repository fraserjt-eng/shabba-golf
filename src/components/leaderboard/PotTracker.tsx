import { formatCurrency, getRelativeTime } from '@/lib/utils'

interface Contribution {
  userName: string
  amount: number
  reason: string
  date: string
}

interface PotTrackerProps {
  potTotal: number
  recentContributions: Contribution[]
}

export function PotTracker({ potTotal, recentContributions }: PotTrackerProps) {
  return (
    <div className="space-y-4">
      {/* Total */}
      <div className="text-center">
        <div className="text-xs text-muted-foreground font-medium mb-1">Group Pot</div>
        <div className="font-stats text-3xl font-bold text-trophy">
          {formatCurrency(potTotal)}
        </div>
      </div>

      {/* Recent Contributions */}
      {recentContributions.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">
            Recent Contributions
          </div>
          <div className="space-y-1.5">
            {recentContributions.map((contrib, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md bg-muted/50"
              >
                <div className="min-w-0">
                  <span className="font-medium text-foreground">{contrib.userName}</span>
                  <span className="text-muted-foreground"> - {contrib.reason}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="font-stats font-semibold text-penalty">
                    +{formatCurrency(contrib.amount)}
                  </span>
                  <span className="text-muted-foreground">{getRelativeTime(contrib.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
