import { formatCurrency } from '@/lib/utils'
import type { UserStats } from '@/types'

interface SeasonStatsProps {
  stats: UserStats | null
}

export function SeasonStats({ stats }: SeasonStatsProps) {
  return (
    <div className="bg-dark-green rounded-xl p-6 text-white">
      <h3 className="text-lg font-light mb-4">Season Stats</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="font-stats text-2xl font-semibold">
            {stats?.rounds_played ?? 0}
          </div>
          <div className="text-xs text-white/70 mt-1">Rounds</div>
        </div>
        <div className="text-center">
          <div className="font-stats text-2xl font-semibold">
            {stats?.average_score ?? '—'}
          </div>
          <div className="text-xs text-white/70 mt-1">Avg Score</div>
        </div>
        <div className="text-center">
          <div className="font-stats text-2xl font-semibold text-trophy">
            {formatCurrency(stats?.total_winnings ?? 0)}
          </div>
          <div className="text-xs text-white/70 mt-1">Winnings</div>
        </div>
      </div>
    </div>
  )
}
