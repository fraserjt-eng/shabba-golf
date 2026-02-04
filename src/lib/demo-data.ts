import type { User, Team, Round, Game, BackoutFee, Settlement } from '@/types'

// ─── Helper: get next/last Wednesday ───
function getNextWednesday(weeksFromNow = 0): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysUntilWednesday = (3 - dayOfWeek + 7) % 7 || 7
  const wed = new Date(now)
  wed.setDate(now.getDate() + daysUntilWednesday + weeksFromNow * 7)
  wed.setHours(17, 30, 0, 0) // 5:30 PM
  return wed
}

function getLastWednesday(weeksAgo = 1): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysSinceLastWed = (dayOfWeek + 4) % 7 || 7
  const wed = new Date(now)
  wed.setDate(now.getDate() - daysSinceLastWed - (weeksAgo - 1) * 7)
  wed.setHours(17, 30, 0, 0)
  return wed
}

// ─── Player IDs ───
const PLAYER_IDS = {
  josh: 'demo-user-001',
  brad: 'demo-user-002',
  rod: 'demo-user-003',
  cole: 'demo-user-004',
  demann: 'demo-user-005',
  andy: 'demo-user-006',
} as const

export const CURRENT_USER_ID = PLAYER_IDS.josh

// ─── Team IDs ───
const TEAM_IDS = {
  wednesdayNight: 'demo-team-001',
} as const

// ─── Round IDs ───
const ROUND_IDS = {
  wedNextWeek: 'demo-round-001',
  wedWeekAfter: 'demo-round-002',
  wedLastWeek: 'demo-round-003',
  wedTwoWeeksAgo: 'demo-round-004',
} as const

// ─── 6 Players ───
export const demoUsers: User[] = [
  {
    id: PLAYER_IDS.josh,
    email: 'josh@golfsquad.app',
    password: 'shabba123',
    display_name: 'Josh Fraser',
    avatar_url: null,
    phone: null,
    handicap: 8,
    ghin_number: '2270337',
    handicap_index: 7.7,
    venmo_username: 'Josh-Fraser',
    preferred_tee_time: '5:30 PM',
    stats: { rounds_played: 14, average_score: 86, best_score: 79, total_winnings: 125, total_losses: 45, backout_count: 0 },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: PLAYER_IDS.brad,
    email: 'brad@golfsquad.app',
    password: 'shabba123',
    display_name: 'Brad Marlowe',
    avatar_url: null,
    phone: null,
    handicap: 8,
    ghin_number: null,
    handicap_index: 8.2,
    venmo_username: 'Brad-Marlowe',
    preferred_tee_time: '5:30 PM',
    stats: { rounds_played: 18, average_score: 82, best_score: 75, total_winnings: 210, total_losses: 90, backout_count: 0 },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: PLAYER_IDS.rod,
    email: 'rod@golfsquad.app',
    password: 'shabba123',
    display_name: 'Rod Buffington',
    avatar_url: null,
    phone: null,
    handicap: 15,
    ghin_number: null,
    handicap_index: 15.1,
    venmo_username: 'Rod-Buffington',
    preferred_tee_time: '5:00 PM',
    stats: { rounds_played: 12, average_score: 90, best_score: 84, total_winnings: 75, total_losses: 60, backout_count: 0 },
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: PLAYER_IDS.cole,
    email: 'cole@golfsquad.app',
    password: 'shabba123',
    display_name: 'Cole Buffington',
    avatar_url: null,
    phone: null,
    handicap: 10,
    ghin_number: null,
    handicap_index: 10.5,
    venmo_username: 'Cole-Buffington',
    preferred_tee_time: '5:30 PM',
    stats: { rounds_played: 16, average_score: 84, best_score: 77, total_winnings: 180, total_losses: 105, backout_count: 0 },
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: PLAYER_IDS.demann,
    email: 'demann@golfsquad.app',
    password: 'shabba123',
    display_name: 'DeMann Seals',
    avatar_url: null,
    phone: null,
    handicap: 6,
    ghin_number: null,
    handicap_index: 5.8,
    venmo_username: 'DeMann-Seals',
    preferred_tee_time: '5:30 PM',
    stats: { rounds_played: 20, average_score: 80, best_score: 73, total_winnings: 290, total_losses: 120, backout_count: 0 },
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: PLAYER_IDS.andy,
    email: 'andy@golfsquad.app',
    password: 'shabba123',
    display_name: 'Andy Lahoud',
    avatar_url: null,
    phone: null,
    handicap: 18,
    ghin_number: null,
    handicap_index: 18.3,
    venmo_username: 'Andy-Lahoud',
    preferred_tee_time: '6:00 PM',
    stats: { rounds_played: 8, average_score: 94, best_score: 88, total_winnings: 30, total_losses: 55, backout_count: 1 },
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
  },
]

// ─── Venmo collector for the league ───
export const VENMO_COLLECTOR_ID = PLAYER_IDS.cole
export const LEAGUE_BUY_IN = 6

// ─── 1 Team: Wednesday Night League ───
export const demoTeams: Team[] = [
  {
    id: TEAM_IDS.wednesdayNight,
    name: 'Wednesday Night League',
    type: 'weekly',
    description: 'Every Wednesday evening at Bunker Hills. $6/person buy-in — Venmo Cole.',
    member_ids: Object.values(PLAYER_IDS),
    admin_ids: [PLAYER_IDS.josh],
    invite_code: 'WED2024',
    settings: {
      backout_fee_schedule: { before_lock: 0, after_lock: 6, no_show: 12 },
      default_game_types: ['skins', 'match_play'],
      require_signup: true,
    },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
]

// ─── 4 Rounds at Bunker Hills ───
function buildRounds(): Round[] {
  const nextWed = getNextWednesday()
  const wedAfter = getNextWednesday(1)
  const lastWed = getLastWednesday(1)
  const twoWeeksAgoWed = getLastWednesday(2)

  const deadlineBefore = (d: Date, hoursBefore = 24) => {
    const dl = new Date(d)
    dl.setHours(dl.getHours() - hoursBefore)
    return dl.toISOString()
  }

  return [
    {
      id: ROUND_IDS.wedNextWeek,
      team_id: TEAM_IDS.wednesdayNight,
      course_name: 'Bunker Hills Golf Course',
      date: nextWed.toISOString(),
      tee_time: '17:30',
      status: 'signup_open',
      slope_rating: 128,
      course_rating: 71.2,
      par: 72,
      signup_deadline: deadlineBefore(nextWed),
      max_players: 5,
      signed_up_ids: [PLAYER_IDS.josh, PLAYER_IDS.brad, PLAYER_IDS.cole, PLAYER_IDS.demann],
      created_by: PLAYER_IDS.josh,
      notes: '$6 buy-in — Venmo @Cole-Buffington',
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: ROUND_IDS.wedWeekAfter,
      team_id: TEAM_IDS.wednesdayNight,
      course_name: 'Bunker Hills Golf Course',
      date: wedAfter.toISOString(),
      tee_time: '17:30',
      status: 'upcoming',
      slope_rating: 128,
      course_rating: 71.2,
      par: 72,
      signup_deadline: deadlineBefore(wedAfter),
      max_players: 5,
      signed_up_ids: [PLAYER_IDS.josh, PLAYER_IDS.brad],
      created_by: PLAYER_IDS.josh,
      notes: null,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: ROUND_IDS.wedLastWeek,
      team_id: TEAM_IDS.wednesdayNight,
      course_name: 'Bunker Hills Golf Course',
      date: lastWed.toISOString(),
      tee_time: '17:30',
      status: 'completed',
      slope_rating: 128,
      course_rating: 71.2,
      par: 72,
      signup_deadline: deadlineBefore(lastWed),
      max_players: 5,
      signed_up_ids: [PLAYER_IDS.josh, PLAYER_IDS.brad, PLAYER_IDS.rod, PLAYER_IDS.cole, PLAYER_IDS.demann],
      created_by: PLAYER_IDS.josh,
      notes: null,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: ROUND_IDS.wedTwoWeeksAgo,
      team_id: TEAM_IDS.wednesdayNight,
      course_name: 'Bunker Hills Golf Course',
      date: twoWeeksAgoWed.toISOString(),
      tee_time: '17:30',
      status: 'completed',
      slope_rating: 128,
      course_rating: 71.2,
      par: 72,
      signup_deadline: deadlineBefore(twoWeeksAgoWed),
      max_players: 5,
      signed_up_ids: [PLAYER_IDS.josh, PLAYER_IDS.brad, PLAYER_IDS.cole, PLAYER_IDS.andy, PLAYER_IDS.demann],
      created_by: PLAYER_IDS.josh,
      notes: null,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
  ]
}

export const demoRounds: Round[] = buildRounds()

// ─── Games (for the next Wednesday round) ───
export const demoGames: Game[] = [
  {
    id: 'demo-game-001',
    round_id: ROUND_IDS.wedNextWeek,
    type: 'match_play',
    name: 'Josh vs Brad',
    buy_in: 6,
    player_ids: [PLAYER_IDS.josh, PLAYER_IDS.brad],
    results: null,
    settled: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'demo-game-002',
    round_id: ROUND_IDS.wedNextWeek,
    type: 'skins',
    name: 'Skins Game',
    buy_in: 6,
    player_ids: [PLAYER_IDS.josh, PLAYER_IDS.brad, PLAYER_IDS.cole, PLAYER_IDS.demann],
    results: null,
    settled: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
]

// ─── 1 Backout Fee ───
export const demoBackoutFees: BackoutFee[] = [
  {
    id: 'demo-backout-001',
    round_id: ROUND_IDS.wedLastWeek,
    user_id: PLAYER_IDS.andy,
    timing: 'after_lock',
    amount: 6,
    reason: 'Work conflict',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// ─── Games for completed rounds ───
export const demoCompletedGames: Game[] = [
  {
    id: 'demo-game-101',
    round_id: ROUND_IDS.wedLastWeek,
    type: 'match_play',
    name: 'Josh vs Brad',
    buy_in: 6,
    player_ids: [PLAYER_IDS.josh, PLAYER_IDS.brad],
    results: { [PLAYER_IDS.brad]: 1, [PLAYER_IDS.josh]: 0 },
    settled: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'demo-game-102',
    round_id: ROUND_IDS.wedLastWeek,
    type: 'skins',
    name: 'Skins Game',
    buy_in: 6,
    player_ids: [PLAYER_IDS.josh, PLAYER_IDS.brad, PLAYER_IDS.rod, PLAYER_IDS.cole, PLAYER_IDS.demann],
    results: { [PLAYER_IDS.demann]: 4, [PLAYER_IDS.josh]: 2, [PLAYER_IDS.brad]: 1, [PLAYER_IDS.rod]: 0, [PLAYER_IDS.cole]: 0 },
    settled: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'demo-game-103',
    round_id: ROUND_IDS.wedTwoWeeksAgo,
    type: 'match_play',
    name: 'Cole vs DeMann',
    buy_in: 6,
    player_ids: [PLAYER_IDS.cole, PLAYER_IDS.demann],
    results: { [PLAYER_IDS.demann]: 1, [PLAYER_IDS.cole]: 0 },
    settled: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
]

export const allDemoGames: Game[] = [...demoGames, ...demoCompletedGames]

// ─── Settlements ───
export const demoSettlements: Settlement[] = [
  {
    id: 'demo-settlement-001',
    round_id: ROUND_IDS.wedLastWeek,
    from_user_id: PLAYER_IDS.josh,
    to_user_id: PLAYER_IDS.brad,
    amount: 6,
    status: 'paid',
    settled_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-settlement-002',
    round_id: ROUND_IDS.wedLastWeek,
    from_user_id: PLAYER_IDS.brad,
    to_user_id: PLAYER_IDS.cole,
    amount: 6,
    status: 'pending',
    settled_at: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-settlement-003',
    round_id: ROUND_IDS.wedTwoWeeksAgo,
    from_user_id: PLAYER_IDS.cole,
    to_user_id: PLAYER_IDS.demann,
    amount: 6,
    status: 'paid',
    settled_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// ─── Notifications ───
export interface DemoNotification {
  id: string
  type: 'round_reminder' | 'player_joined' | 'settlement' | 'backout'
  title: string
  message: string
  read: boolean
  created_at: string
}

export const demoNotifications: DemoNotification[] = [
  {
    id: 'demo-notif-001',
    type: 'round_reminder',
    title: 'Round Tomorrow',
    message: 'Wednesday Night League at Bunker Hills — 4/6 signed up',
    read: false,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-notif-002',
    type: 'player_joined',
    title: 'Player Joined',
    message: "Brad Marlowe joined Wednesday's round",
    read: false,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-notif-003',
    type: 'settlement',
    title: 'Settlement Reminder',
    message: 'Brad owes Cole $6 from last week',
    read: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-notif-004',
    type: 'backout',
    title: 'Player Backed Out',
    message: 'Andy Lahoud backed out — $6 added to pot',
    read: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// ─── Leaderboard Data ───
export interface SeasonRecord {
  userId: string
  gamesPlayed: number
  wins: number
  losses: number
  netWinnings: number
  currentStreak: number // positive = win streak, negative = lose streak
}

export const demoSeasonRecords: SeasonRecord[] = [
  { userId: PLAYER_IDS.demann, gamesPlayed: 32, wins: 22, losses: 10, netWinnings: 170, currentStreak: 3 },
  { userId: PLAYER_IDS.cole, gamesPlayed: 28, wins: 16, losses: 12, netWinnings: 75, currentStreak: -1 },
  { userId: PLAYER_IDS.brad, gamesPlayed: 30, wins: 18, losses: 12, netWinnings: 120, currentStreak: 2 },
  { userId: PLAYER_IDS.josh, gamesPlayed: 24, wins: 14, losses: 10, netWinnings: 80, currentStreak: -2 },
  { userId: PLAYER_IDS.rod, gamesPlayed: 20, wins: 8, losses: 12, netWinnings: 15, currentStreak: 1 },
  { userId: PLAYER_IDS.andy, gamesPlayed: 12, wins: 4, losses: 8, netWinnings: -25, currentStreak: -1 },
]

// ─── Head-to-Head Records ───
export interface HeadToHeadRecord {
  playerAId: string
  playerBId: string
  playerAWins: number
  playerBWins: number
}

export const demoHeadToHead: HeadToHeadRecord[] = [
  { playerAId: PLAYER_IDS.josh, playerBId: PLAYER_IDS.brad, playerAWins: 3, playerBWins: 5 },
  { playerAId: PLAYER_IDS.josh, playerBId: PLAYER_IDS.demann, playerAWins: 2, playerBWins: 4 },
  { playerAId: PLAYER_IDS.josh, playerBId: PLAYER_IDS.cole, playerAWins: 4, playerBWins: 3 },
  { playerAId: PLAYER_IDS.brad, playerBId: PLAYER_IDS.demann, playerAWins: 4, playerBWins: 6 },
  { playerAId: PLAYER_IDS.brad, playerBId: PLAYER_IDS.cole, playerAWins: 5, playerBWins: 3 },
  { playerAId: PLAYER_IDS.cole, playerBId: PLAYER_IDS.demann, playerAWins: 3, playerBWins: 5 },
]

// ─── Helper: look up user by ID ───
export function getDemoUser(userId: string): User | undefined {
  return demoUsers.find((u) => u.id === userId)
}

export function getDemoUserName(userId: string): string {
  return getDemoUser(userId)?.display_name ?? 'Unknown Player'
}
