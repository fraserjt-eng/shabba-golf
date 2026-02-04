import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlayerRow } from './PlayerRow'
import { Users } from 'lucide-react'
import type { User } from '@/types'
import { CURRENT_USER_ID } from '@/lib/demo-data'

interface PlayerListProps {
  players: User[]
  corePlayerIds: string[]
}

export function PlayerList({ players, corePlayerIds }: PlayerListProps) {
  // Sort: current user first, then core, then subs
  const sorted = [...players].sort((a, b) => {
    if (a.id === CURRENT_USER_ID) return -1
    if (b.id === CURRENT_USER_ID) return 1
    const aCore = corePlayerIds.includes(a.id)
    const bCore = corePlayerIds.includes(b.id)
    if (aCore && !bCore) return -1
    if (!aCore && bCore) return 1
    return 0
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-fairway" />
          Signed Up ({players.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="divide-y divide-border/50">
          {sorted.map((player) => (
            <PlayerRow
              key={player.id}
              user={player}
              isCurrentUser={player.id === CURRENT_USER_ID}
              isCore={corePlayerIds.includes(player.id)}
            />
          ))}
        </div>
        {players.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No players signed up yet. Be the first!
          </p>
        )}
      </CardContent>
    </Card>
  )
}
