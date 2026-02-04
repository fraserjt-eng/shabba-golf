import { useState, useMemo } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useGameStore } from '@/stores/gameStore'
import { getDemoUserName } from '@/lib/demo-data'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { ClipboardCheck } from 'lucide-react'
import type { Game } from '@/types'

interface ScoreEntryModalProps {
  open: boolean
  onClose: () => void
  game: Game
}

export function ScoreEntryModal({ open, onClose, game }: ScoreEntryModalProps) {
  const updateResult = useGameStore((s) => s.updateResult)
  const [submitting, setSubmitting] = useState(false)

  // For match_play: track selected winner
  const [winnerId, setWinnerId] = useState<string | null>(null)

  // For skins/other: track per-player scores
  const [scores, setScores] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const pid of game.player_ids) {
      initial[pid] = ''
    }
    return initial
  })

  const isMatchPlay = game.type === 'match_play'
  const isSkins = game.type === 'skins'

  const playerNames = useMemo(
    () =>
      game.player_ids.map((id) => ({
        id,
        name: getDemoUserName(id),
      })),
    [game.player_ids],
  )

  const canSubmit = useMemo(() => {
    if (submitting) return false
    if (isMatchPlay) return winnerId !== null
    // All players must have a score entered
    return game.player_ids.every((pid) => scores[pid] !== '' && !isNaN(Number(scores[pid])))
  }, [isMatchPlay, winnerId, scores, game.player_ids, submitting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)

    let results: Record<string, number>

    if (isMatchPlay) {
      // Winner gets 1, loser gets 0
      results = {}
      for (const pid of game.player_ids) {
        results[pid] = pid === winnerId ? 1 : 0
      }
    } else {
      // Use numeric scores from inputs
      results = {}
      for (const pid of game.player_ids) {
        results[pid] = Number(scores[pid]) || 0
      }
    }

    await updateResult(game.id, results)
    setSubmitting(false)
    onClose()
  }

  const scoreLabel = isSkins ? 'Skins Won' : 'Score'

  return (
    <Modal open={open} onClose={onClose} title="Enter Results">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {game.name} &middot;{' '}
          <span className="font-stats text-trophy">${game.buy_in}</span>
        </div>

        {isMatchPlay ? (
          /* Match play: radio buttons to pick winner */
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">
              Select Winner
            </label>
            {playerNames.map(({ id, name }) => (
              <button
                key={id}
                type="button"
                onClick={() => setWinnerId(id)}
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-left',
                  winnerId === id
                    ? 'bg-fairway/10 ring-1 ring-fairway/30'
                    : 'hover:bg-muted',
                )}
              >
                <div
                  className={cn(
                    'h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                    winnerId === id
                      ? 'border-fairway'
                      : 'border-muted-foreground/40',
                  )}
                >
                  {winnerId === id && (
                    <div className="h-2 w-2 rounded-full bg-fairway" />
                  )}
                </div>
                <Avatar className="h-6 w-6">
                  <AvatarFallback
                    style={{ backgroundColor: getAvatarColor(name) }}
                    className="text-white text-[9px]"
                  >
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{name}</span>
              </button>
            ))}
          </div>
        ) : (
          /* Skins/other: number inputs for each player */
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">
              {scoreLabel} per Player
            </label>
            {playerNames.map(({ id, name }) => (
              <div key={id} className="flex items-center gap-3">
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarFallback
                    style={{ backgroundColor: getAvatarColor(name) }}
                    className="text-white text-[9px]"
                  >
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate flex-1">
                  {name}
                </span>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={scores[id]}
                  onChange={(e) =>
                    setScores((prev) => ({ ...prev, [id]: e.target.value }))
                  }
                  placeholder="0"
                  className="h-9 w-20 font-stats text-center"
                />
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-11 gap-2"
          disabled={!canSubmit}
        >
          <ClipboardCheck className="h-4 w-4" />
          {submitting ? 'Saving...' : 'Save Results'}
        </Button>
      </form>
    </Modal>
  )
}
