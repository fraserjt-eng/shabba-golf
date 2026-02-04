export type UserRole = 'admin' | 'member'
export type TeamType = 'weekly' | 'tournament' | 'casual'
export type RoundStatus = 'upcoming' | 'signup_open' | 'locked' | 'in_progress' | 'completed' | 'cancelled'
export type GameType = 'skins' | 'nassau' | 'match_play' | 'stroke' | 'best_ball' | 'scramble'
export type BackoutTiming = 'before_lock' | 'after_lock' | 'no_show'
export type SettlementStatus = 'pending' | 'paid' | 'disputed' | 'forgiven'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          display_name: string
          avatar_url: string | null
          phone: string | null
          handicap: number | null
          ghin_number: string | null
          handicap_index: number | null
          venmo_username: string | null
          preferred_tee_time: string | null
          stats: UserStats | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      teams: {
        Row: {
          id: string
          name: string
          type: TeamType
          description: string | null
          member_ids: string[]
          admin_ids: string[]
          invite_code: string | null
          settings: TeamSettings | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['teams']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['teams']['Insert']>
      }
      rounds: {
        Row: {
          id: string
          team_id: string
          course_name: string
          date: string
          tee_time: string | null
          status: RoundStatus
          signup_deadline: string | null
          max_players: number | null
          signed_up_ids: string[]
          slope_rating: number | null
          course_rating: number | null
          par: number | null
          created_by: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['rounds']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['rounds']['Insert']>
      }
      games: {
        Row: {
          id: string
          round_id: string
          type: GameType
          name: string
          buy_in: number
          player_ids: string[]
          results: Record<string, number> | null
          settled: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['games']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['games']['Insert']>
      }
      backout_fees: {
        Row: {
          id: string
          round_id: string
          user_id: string
          timing: BackoutTiming
          amount: number
          reason: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['backout_fees']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['backout_fees']['Insert']>
      }
      settlements: {
        Row: {
          id: string
          round_id: string
          from_user_id: string
          to_user_id: string
          amount: number
          status: SettlementStatus
          settled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['settlements']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['settlements']['Insert']>
      }
    }
  }
}

export interface UserStats {
  rounds_played: number
  average_score: number | null
  best_score: number | null
  total_winnings: number
  total_losses: number
  backout_count: number
}

export interface TeamSettings {
  backout_fee_schedule: {
    before_lock: number
    after_lock: number
    no_show: number
  }
  default_game_types: GameType[]
  require_signup: boolean
}
