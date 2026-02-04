import type { User, Team, Round, Game, BackoutFee } from '@/types'
import { getNextSaturday, getNextSunday, getLastSaturday, getLastSunday } from './round-utils'

// ─── Player IDs ───
const PLAYER_IDS = {
  jake: 'demo-user-001',
  mike: 'demo-user-002',
  chris: 'demo-user-003',
  tommy: 'demo-user-004',
  ryan: 'demo-user-005',
  dave: 'demo-user-006',
  nick: 'demo-user-007',
  brian: 'demo-user-008',
} as const

export const CURRENT_USER_ID = PLAYER_IDS.jake

// ─── Team IDs ───
const TEAM_IDS = {
  saturday: 'demo-team-001',
  backNine: 'demo-team-002',
} as const

// ─── Round IDs ───
const ROUND_IDS = {
  satNextWeek: 'demo-round-001',
  satWeekAfter: 'demo-round-002',
  satLastWeek: 'demo-round-003',
  satTwoWeeksAgo: 'demo-round-004',
  sunThisWeek: 'demo-round-005',
  sunLastWeek: 'demo-round-006',
} as const

// ─── 8 Players ───
export const demoUsers: User[] = [
  {
    id: PLAYER_IDS.jake,
    email: 'jake@golfsquad.demo',
    display_name: 'Jake Fraser',
    avatar_url: null,
    phone: null,
    handicap: 12,
    stats: { rounds_played: 14, average_score: 86, best_score: 79, total_winnings: 125, total_losses: 45, backout_count: 0 },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: PLAYER_IDS.mike,
    email: 'mike@golfsquad.demo',
    display_name: 'Mike Sullivan',
    avatar_url: null,
    phone: null,
    handicap: 8,
    stats: { rounds_played: 18, average_score: 82, best_score: 75, total_winnings: 210, total_losses: 90, backout_count: 1 },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: PLAYER_IDS.chris,
    email: 'chris@golfsquad.demo',
    display_name: 'Chris Daniels',
    avatar_url: null,
    phone: null,
    handicap: 15,
    stats: { rounds_played: 12, average_score: 90, best_score: 84, total_winnings: 75, total_losses: 60, backout_count: 0 },
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: PLAYER_IDS.tommy,
    email: 'tommy@golfsquad.demo',
    display_name: 'Tommy Park',
    avatar_url: null,
    phone: null,
    handicap: 10,
    stats: { rounds_played: 16, average_score: 84, best_score: 77, total_winnings: 180, total_losses: 105, backout_count: 0 },
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: PLAYER_IDS.ryan,
    email: 'ryan@golfsquad.demo',
    display_name: 'Ryan Bennett',
    avatar_url: null,
    phone: null,
    handicap: 18,
    stats: { rounds_played: 8, average_score: 94, best_score: 88, total_winnings: 30, total_losses: 55, backout_count: 1 },
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
  {
    id: PLAYER_IDS.dave,
    email: 'dave@golfsquad.demo',
    display_name: 'Dave Kowalski',
    avatar_url: null,
    phone: null,
    handicap: 6,
    stats: { rounds_played: 20, average_score: 80, best_score: 73, total_winnings: 290, total_losses: 120, backout_count: 0 },
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: PLAYER_IDS.nick,
    email: 'nick@golfsquad.demo',
    display_name: 'Nick Alvarez',
    avatar_url: null,
    phone: null,
    handicap: 14,
    stats: { rounds_played: 10, average_score: 88, best_score: 82, total_winnings: 55, total_losses: 70, backout_count: 2 },
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
  },
  {
    id: PLAYER_IDS.brian,
    email: 'brian@golfsquad.demo',
    display_name: 'Brian Walsh',
    avatar_url: null,
    phone: null,
    handicap: 20,
    stats: { rounds_played: 6, average_score: 96, best_score: 91, total_winnings: 15, total_losses: 40, backout_count: 0 },
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z',
  },
]

// ─── 2 Teams ───
export const demoTeams: Team[] = [
  {
    id: TEAM_IDS.saturday,
    name: 'Saturday Morning Squad',
    type: 'weekly',
    description: 'Every Saturday at 8:30 AM. No excuses.',
    member_ids: Object.values(PLAYER_IDS),
    admin_ids: [PLAYER_IDS.jake, PLAYER_IDS.mike],
    invite_code: 'SAT2024',
    settings: {
      backout_fee_schedule: { before_lock: 5, after_lock: 15, no_show: 25 },
      default_game_types: ['skins', 'nassau', 'match_play'],
      require_signup: true,
    },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: TEAM_IDS.backNine,
    name: 'The Back Nine Club',
    type: 'casual',
    description: 'Casual weekend rounds, no pressure.',
    member_ids: [PLAYER_IDS.jake, PLAYER_IDS.chris, PLAYER_IDS.tommy, PLAYER_IDS.brian],
    admin_ids: [PLAYER_IDS.jake],
    invite_code: 'BACK9',
    settings: {
      backout_fee_schedule: { before_lock: 0, after_lock: 10, no_show: 20 },
      default_game_types: ['skins'],
      require_signup: false,
    },
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
]

// ─── 6 Rounds ───
function buildRounds(): Round[] {
  const nextSat = getNextSaturday()
  const satAfter = getNextSaturday(1)
  const lastSat = getLastSaturday(1)
  const twoWeeksAgoSat = getLastSaturday(2)
  const thisSun = getNextSunday()
  const lastSun = getLastSunday(1)

  const deadlineBefore = (d: Date, hoursBefore = 24) => {
    const dl = new Date(d)
    dl.setHours(dl.getHours() - hoursBefore)
    return dl.toISOString()
  }

  return [
    {
      id: ROUND_IDS.satNextWeek,
      team_id: TEAM_IDS.saturday,
      course_name: 'Pine Valley Golf Club',
      date: nextSat.toISOString(),
      tee_time: '08:30',
      status: 'signup_open',
      signup_deadline: deadlineBefore(nextSat),
      max_players: 8,
      signed_up_ids: [PLAYER_IDS.jake, PLAYER_IDS.mike, PLAYER_IDS.chris, PLAYER_IDS.tommy, PLAYER_IDS.dave],
      created_by: PLAYER_IDS.jake,
      notes: 'Cart path only on holes 3 and 7',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: ROUND_IDS.satWeekAfter,
      team_id: TEAM_IDS.saturday,
      course_name: 'Bethpage Black',
      date: satAfter.toISOString(),
      tee_time: '09:00',
      status: 'upcoming',
      signup_deadline: deadlineBefore(satAfter),
      max_players: 8,
      signed_up_ids: [PLAYER_IDS.jake, PLAYER_IDS.mike],
      created_by: PLAYER_IDS.jake,
      notes: null,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: ROUND_IDS.satLastWeek,
      team_id: TEAM_IDS.saturday,
      course_name: 'Torrey Pines South',
      date: lastSat.toISOString(),
      tee_time: '08:30',
      status: 'completed',
      signup_deadline: deadlineBefore(lastSat),
      max_players: 8,
      signed_up_ids: [PLAYER_IDS.jake, PLAYER_IDS.mike, PLAYER_IDS.chris, PLAYER_IDS.tommy, PLAYER_IDS.dave, PLAYER_IDS.nick, PLAYER_IDS.ryan],
      created_by: PLAYER_IDS.jake,
      notes: null,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: ROUND_IDS.satTwoWeeksAgo,
      team_id: TEAM_IDS.saturday,
      course_name: 'Pebble Beach',
      date: twoWeeksAgoSat.toISOString(),
      tee_time: '08:00',
      status: 'completed',
      signup_deadline: deadlineBefore(twoWeeksAgoSat),
      max_players: 8,
      signed_up_ids: [PLAYER_IDS.jake, PLAYER_IDS.mike, PLAYER_IDS.tommy, PLAYER_IDS.dave, PLAYER_IDS.nick, PLAYER_IDS.brian],
      created_by: PLAYER_IDS.mike,
      notes: null,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: ROUND_IDS.sunThisWeek,
      team_id: TEAM_IDS.backNine,
      course_name: 'Whistling Straits',
      date: thisSun.toISOString(),
      tee_time: '10:00',
      status: 'signup_open',
      signup_deadline: deadlineBefore(thisSun, 12),
      max_players: 4,
      signed_up_ids: [PLAYER_IDS.jake, PLAYER_IDS.chris, PLAYER_IDS.tommy],
      created_by: PLAYER_IDS.jake,
      notes: null,
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-01T00:00:00Z',
    },
    {
      id: ROUND_IDS.sunLastWeek,
      team_id: TEAM_IDS.backNine,
      course_name: 'Bandon Dunes',
      date: lastSun.toISOString(),
      tee_time: '10:00',
      status: 'completed',
      signup_deadline: deadlineBefore(lastSun, 12),
      max_players: 4,
      signed_up_ids: [PLAYER_IDS.jake, PLAYER_IDS.chris, PLAYER_IDS.tommy, PLAYER_IDS.brian],
      created_by: PLAYER_IDS.jake,
      notes: null,
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-02-01T00:00:00Z',
    },
  ]
}

export const demoRounds: Round[] = buildRounds()

// ─── 4 Games (for the next Saturday round) ───
export const demoGames: Game[] = [
  {
    id: 'demo-game-001',
    round_id: ROUND_IDS.satNextWeek,
    type: 'match_play',
    name: 'Jake vs Mike',
    buy_in: 10,
    player_ids: [PLAYER_IDS.jake, PLAYER_IDS.mike],
    results: null,
    settled: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'demo-game-002',
    round_id: ROUND_IDS.satNextWeek,
    type: 'match_play',
    name: 'Chris vs Tommy',
    buy_in: 10,
    player_ids: [PLAYER_IDS.chris, PLAYER_IDS.tommy],
    results: null,
    settled: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'demo-game-003',
    round_id: ROUND_IDS.satNextWeek,
    type: 'skins',
    name: 'Skins Game',
    buy_in: 5,
    player_ids: [PLAYER_IDS.jake, PLAYER_IDS.mike, PLAYER_IDS.chris, PLAYER_IDS.tommy, PLAYER_IDS.dave],
    results: null,
    settled: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'demo-game-004',
    round_id: ROUND_IDS.satNextWeek,
    type: 'nassau',
    name: 'Nassau',
    buy_in: 5,
    player_ids: [PLAYER_IDS.jake, PLAYER_IDS.mike, PLAYER_IDS.dave],
    results: null,
    settled: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
]

// ─── 2 Backout Fees ───
export const demoBackoutFees: BackoutFee[] = [
  {
    id: 'demo-backout-001',
    round_id: ROUND_IDS.satLastWeek,
    user_id: PLAYER_IDS.nick,
    timing: 'after_lock',
    amount: 15,
    reason: 'Family emergency',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-backout-002',
    round_id: ROUND_IDS.satTwoWeeksAgo,
    user_id: PLAYER_IDS.ryan,
    timing: 'before_lock',
    amount: 5,
    reason: 'Work conflict',
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// ─── Helper: look up user by ID ───
export function getDemoUser(userId: string): User | undefined {
  return demoUsers.find((u) => u.id === userId)
}

export function getDemoUserName(userId: string): string {
  return getDemoUser(userId)?.display_name ?? 'Unknown Player'
}
