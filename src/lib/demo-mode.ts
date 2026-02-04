import { isSupabaseConfigured } from './supabase'

export function isDemoMode(): boolean {
  return !isSupabaseConfigured()
}
