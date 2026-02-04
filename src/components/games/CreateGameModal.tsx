import { useState, useMemo } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { HandicapMatchup } from './HandicapMatchup'
import { useGameStore } from '@/stores/gameStore'
import { getDemoUser, getDemoUserName } from '@/lib/demo-data'
import { getInitials, getAvatarColor, cn } from '@/lib/utils'
import { Gamepad2 } from 'lucide-react'
import type { GameType, User } from '@/types'

interface CreateGameModalProps {
  open: boolean
  onClose: () => void
  roundId: string
  signedUpPlayerIds: string[]
  slopeRating?: number | null
  courseRating?: number | null
  par?: number | null
}

const GAME_TYPE_OPTIONS: { value: GameType; label: string }[] = [
  { value: 'match_play', label: 'Match Play' },
  { value: 'skins', label: 'Skins' },
  { value: 'nassau', label: 'Nassau' },
  { value: 'stroke', label: 'Stroke' },
  { value: 'best_ball', label: 'Best Ball' },
  { value: 'scramble', label: 'Scramble' },
]

export function CreateGameModal({
  open,
  onClose,
  roundId,
  signedUpPlayerIds,
  slopeRating,
  courseRating,
  par,
}: CreateGameModalProps) {
  const createGame = useGameStore((s) => s.createGame)

  const [gameType, setGameType] = useState<GameType>('match_play')
  const [buyIn, setBuyIn] = useState('10')
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const players = useMemo(
    () =>
      signedUpPlayerIds
        .map((id) => getDemoUser(id))
        .filter((u): u is User => u !== undefined),
    [signedUpPlayerIds],
  )

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    )
  }

  // For match_play with exactly 2 players selected, show the handicap matchup
  const showMatchup =
    gameType === 'match_play' &&
    selectedPlayerIds.length === 2 &&
    slopeRating != null &&
    courseRating != null &&
    par != null

  const matchupPlayers = useMemo(() => {
    if (!showMatchup) return null
    const pA = getDemoUser(selectedPlayerIds[0])
    const pB = getDemoUser(selectedPlayerIds[1])
    if (!pA || !pB) return null
    return { playerA: pA, playerB: pB }
  }, [showMatchup, selectedPlayerIds])

  const gameName = useMemo(() => {
    if (gameType === 'match_play' && selectedPlayerIds.length === 2) {
      const nameA = getDemoUserName(selectedPlayerIds[0]).split(' ')[0]
      const nameB = getDemoUserName(selectedPlayerIds[1]).split(' ')[0]
      return `${nameA} vs ${nameB}`
    }
    const label = GAME_TYPE_OPTIONS.find((o) => o.value === gameType)?.label
    return label ?? gameType
  }, [gameType, selectedPlayerIds])

  const canSubmit =
    selectedPlayerIds.length >= 2 && parseFloat(buyIn) > 0 && !submitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setSubmitting(true)
    await createGame({
      round_id: roundId,
      type: gameType,
      name: gameName,
      buy_in: parseFloat(buyIn),
      player_ids: selectedPlayerIds,
      results: null,
      settled: false,
    })
    setSubmitting(false)
    onClose()
    // Reset form
    setGameType('match_play')
    setBuyIn('10')
    setSelectedPlayerIds([])
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Game">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Game type select */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Game Type
          </label>
          <select
            value={gameType}
            onChange={(e) => setGameType(e.target.value as GameType)}
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {GAME_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Buy-in */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Buy-in ($)
          </label>
          <Input
            type="number"
            min="1"
            step="1"
            value={buyIn}
            onChange={(e) => setBuyIn(e.target.value)}
            className="h-11 w-32 font-stats"
          />
        </div>

        {/* Player selection */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Players ({selectedPlayerIds.length} selected)
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {players.map((player) => {
              const isSelected = selectedPlayerIds.includes(player.id)
              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => togglePlayer(player.id)}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg transition-colors text-left',
                    isSelected
                      ? 'bg-fairway/10 ring-1 ring-fairway/30'
                      : 'hover:bg-muted',
                  )}
                >
                  <div
                    className={cn(
                      'h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                      isSelected
                        ? 'bg-fairway border-fairway'
                        : 'border-muted-foreground/40',
                    )}
                  >
                    {isSelected && (
                      <svg
                        className="h-2.5 w-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      style={{
                        backgroundColor: getAvatarColor(player.display_name),
                      }}
                      className="text-white text-[9px]"
                    >
                      {getInitials(player.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">
                    {player.display_name}
                  </span>
                  {player.handicap_index != null && (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-[10px] font-stats"
                    >
                      {player.handicap_index.toFixed(1)}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Handicap matchup for match_play with 2 players */}
        {showMatchup && matchupPlayers && (
          <HandicapMatchup
            playerA={matchupPlayers.playerA}
            playerB={matchupPlayers.playerB}
            slopeRating={slopeRating!}
            courseRating={courseRating!}
            par={par!}
          />
        )}

        <Button
          type="submit"
          className="w-full h-11 gap-2"
          disabled={!canSubmit}
        >
          <Gamepad2 className="h-4 w-4" />
          {submitting ? 'Creating...' : 'Create Game'}
        </Button>
      </form>
    </Modal>
  )
}
