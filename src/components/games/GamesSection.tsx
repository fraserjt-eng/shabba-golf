import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MatchCard } from './MatchCard'
import { WadPot } from './WadPot'
import { CreateGameModal } from './CreateGameModal'
import { Button } from '@/components/ui/button'
import { Gamepad2, Plus } from 'lucide-react'
import type { Game } from '@/types'

interface GamesSectionProps {
  games: Game[]
  roundId?: string
  signedUpPlayerIds?: string[]
}

export function GamesSection({ games, roundId, signedUpPlayerIds }: GamesSectionProps) {
  const [showCreateGame, setShowCreateGame] = useState(false)
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

        <Button
          variant="outline"
          className="w-full h-11 border-dashed text-muted-foreground"
          onClick={() => setShowCreateGame(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Game
        </Button>

        {roundId && (
          <CreateGameModal
            open={showCreateGame}
            onClose={() => setShowCreateGame(false)}
            roundId={roundId}
            signedUpPlayerIds={signedUpPlayerIds ?? []}
          />
        )}
      </CardContent>
    </Card>
  )
}
