export type {
  Database,
  UserRole,
  TeamType,
  RoundStatus,
  GameType,
  BackoutTiming,
  SettlementStatus,
  UserStats,
  TeamSettings,
} from './database'

import type { Database } from './database'

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Team = Database['public']['Tables']['teams']['Row']
export type TeamInsert = Database['public']['Tables']['teams']['Insert']
export type TeamUpdate = Database['public']['Tables']['teams']['Update']

export type Round = Database['public']['Tables']['rounds']['Row']
export type RoundInsert = Database['public']['Tables']['rounds']['Insert']
export type RoundUpdate = Database['public']['Tables']['rounds']['Update']

export type Game = Database['public']['Tables']['games']['Row']
export type GameInsert = Database['public']['Tables']['games']['Insert']
export type GameUpdate = Database['public']['Tables']['games']['Update']

export type BackoutFee = Database['public']['Tables']['backout_fees']['Row']
export type BackoutFeeInsert = Database['public']['Tables']['backout_fees']['Insert']

export type Settlement = Database['public']['Tables']['settlements']['Row']
export type SettlementInsert = Database['public']['Tables']['settlements']['Insert']
export type SettlementUpdate = Database['public']['Tables']['settlements']['Update']
