import { getDemoUserName } from '@/lib/demo-data'
import { formatCurrency } from '@/lib/utils'

interface WinningsChartEntry {
  userId: string
  netWinnings: number
}

interface WinningsChartProps {
  data: WinningsChartEntry[]
}

export function WinningsChart({ data }: WinningsChartProps) {
  const top5 = [...data]
    .sort((a, b) => b.netWinnings - a.netWinnings)
    .slice(0, 5)

  const maxAbsValue = Math.max(...top5.map((d) => Math.abs(d.netWinnings)), 1)

  return (
    <div className="space-y-3">
      {top5.map((entry) => {
        const barWidth = Math.max((Math.abs(entry.netWinnings) / maxAbsValue) * 100, 4)
        const isPositive = entry.netWinnings >= 0

        return (
          <div key={entry.userId} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground font-medium truncate mr-2">
                {getDemoUserName(entry.userId)}
              </span>
              <span
                className={`font-stats font-semibold shrink-0 ${
                  isPositive ? 'text-fairway' : 'text-penalty'
                }`}
              >
                {isPositive ? '+' : ''}{formatCurrency(entry.netWinnings)}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isPositive ? 'bg-fairway' : 'bg-penalty'
                }`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
