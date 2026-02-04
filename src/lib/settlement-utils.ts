import type { Game } from '@/types'

interface CalculatedSettlement {
  fromUserId: string
  toUserId: string
  amount: number
}

/**
 * Calculate net settlements from game results.
 *
 * For match_play: loser pays winner the buy_in.
 * For skins/nassau: results contain score counts, winner with highest score wins the pot.
 * For others: lowest score wins the pot from all other players.
 */
export function calculateSettlements(
  games: Game[],
  userIds: string[],
): CalculatedSettlement[] {
  const balances: Record<string, number> = {}
  for (const id of userIds) {
    balances[id] = 0
  }

  for (const game of games) {
    if (!game.results) continue
    const buyIn = game.buy_in
    const playerIds = game.player_ids

    if (game.type === 'match_play') {
      // Two-player game: loser pays winner the buy_in
      if (playerIds.length !== 2) continue
      const [pA, pB] = playerIds
      const scoreA = game.results[pA] ?? 0
      const scoreB = game.results[pB] ?? 0
      if (scoreA > scoreB) {
        balances[pA] = (balances[pA] ?? 0) + buyIn
        balances[pB] = (balances[pB] ?? 0) - buyIn
      } else if (scoreB > scoreA) {
        balances[pB] = (balances[pB] ?? 0) + buyIn
        balances[pA] = (balances[pA] ?? 0) - buyIn
      }
      // tie: no money changes hands
    } else {
      // Skins, nassau, stroke, best_ball, scramble:
      // Winner with highest score in results wins the pot (buy_in * number of players)
      // For stroke/best_ball, "results" scores are inverted (lowest stroke = highest result value)
      const pot = buyIn * playerIds.length
      let maxScore = -Infinity
      let winnerId: string | null = null

      for (const pid of playerIds) {
        const score = game.results[pid] ?? 0
        if (score > maxScore) {
          maxScore = score
          winnerId = pid
        }
      }

      if (winnerId && maxScore > 0) {
        // Each other player pays their buy_in to the winner
        for (const pid of playerIds) {
          if (pid === winnerId) {
            balances[pid] = (balances[pid] ?? 0) + (pot - buyIn)
          } else {
            balances[pid] = (balances[pid] ?? 0) - buyIn
          }
        }
      }
    }
  }

  // Convert net balances into settlements (minimize transactions)
  const creditors: { id: string; amount: number }[] = []
  const debtors: { id: string; amount: number }[] = []

  for (const id of userIds) {
    const balance = balances[id] ?? 0
    if (balance > 0) {
      creditors.push({ id, amount: balance })
    } else if (balance < 0) {
      debtors.push({ id, amount: -balance })
    }
  }

  // Sort descending by amount for greedy matching
  creditors.sort((a, b) => b.amount - a.amount)
  debtors.sort((a, b) => b.amount - a.amount)

  const settlements: CalculatedSettlement[] = []

  let ci = 0
  let di = 0
  while (ci < creditors.length && di < debtors.length) {
    const transfer = Math.min(creditors[ci].amount, debtors[di].amount)
    if (transfer > 0) {
      settlements.push({
        fromUserId: debtors[di].id,
        toUserId: creditors[ci].id,
        amount: transfer,
      })
    }
    creditors[ci].amount -= transfer
    debtors[di].amount -= transfer
    if (creditors[ci].amount === 0) ci++
    if (debtors[di].amount === 0) di++
  }

  return settlements
}

/**
 * Generate a Venmo deep link for payment.
 * Uses the venmo://paycharge URL scheme for mobile deep linking.
 */
export function getVenmoDeepLink(
  amount: number,
  note: string,
  recipientId?: string,
): string {
  const params = new URLSearchParams({
    txn: 'pay',
    amount: amount.toFixed(2),
    note,
  })
  if (recipientId) {
    params.set('recipients', recipientId)
  }
  return `venmo://paycharge?${params.toString()}`
}
