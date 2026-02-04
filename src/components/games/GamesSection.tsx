import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MatchCard } from './MatchCard'
import { WadPot } from './WadPot'
import { AddMatchButton } from './AddMatchButton'
import { Gamepad2 } from 'lucide-react'
import type { Game } from '@/types'

interface GamesSectionProps {
  games: Game[]
}

export function GamesSection({ games }: GamesSectionProps) {
  const wadTotal = games.reduce((sum, g) => sum + g.buy_in * g.player_ids.length, 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-fairway" />
            Games for This Round
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {games.length > 0 && <WadPot total={wadTotal} />}

        {games.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {games.map((game) => (
              <MatchCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No games set up yet for this round.
          </p>
        )}

        <AddMatchButton />
      </CardContent>
    </Card>
  )
}
