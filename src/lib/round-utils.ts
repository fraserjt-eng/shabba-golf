import type { RoundStatus } from '@/types'

interface BackoutTimingInfo {
  tier: 'before_lock' | 'after_lock' | 'no_show'
  fee: number
  label: string
}

export function getBackoutTiming(
  roundDate: string,
  signupDeadline: string | null,
  feeSchedule: { before_lock: number; after_lock: number; no_show: number },
): BackoutTimingInfo {
  const now = new Date()
  const round = new Date(roundDate)
  const deadline = signupDeadline ? new Date(signupDeadline) : null

  if (now >= round) {
    return { tier: 'no_show', fee: feeSchedule.no_show, label: 'No-show fee' }
  }

  if (deadline && now >= deadline) {
    return { tier: 'after_lock', fee: feeSchedule.after_lock, label: 'Late withdrawal fee' }
  }

  return { tier: 'before_lock', fee: feeSchedule.before_lock, label: 'Early withdrawal fee' }
}

export function getNextSaturday(weeksFromNow = 0): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7
  const saturday = new Date(now)
  saturday.setDate(now.getDate() + daysUntilSaturday + weeksFromNow * 7)
  saturday.setHours(8, 30, 0, 0)
  return saturday
}

export function getNextSunday(weeksFromNow = 0): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7
  const sunday = new Date(now)
  sunday.setDate(now.getDate() + daysUntilSunday + weeksFromNow * 7)
  sunday.setHours(10, 0, 0, 0)
  return sunday
}

export function getLastSaturday(weeksAgo = 1): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysSinceLastSaturday = (dayOfWeek + 1) % 7 || 7
  const saturday = new Date(now)
  saturday.setDate(now.getDate() - daysSinceLastSaturday - (weeksAgo - 1) * 7)
  saturday.setHours(8, 30, 0, 0)
  return saturday
}

export function getLastSunday(weeksAgo = 1): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysSinceLastSunday = dayOfWeek || 7
  const sunday = new Date(now)
  sunday.setDate(now.getDate() - daysSinceLastSunday - (weeksAgo - 1) * 7)
  sunday.setHours(10, 0, 0, 0)
  return sunday
}

export function getRoundStatusLabel(status: RoundStatus): string {
  const labels: Record<RoundStatus, string> = {
    upcoming: 'Upcoming',
    signup_open: 'Sign Up Open',
    locked: 'Locked',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return labels[status]
}

export function getRoundStatusColor(status: RoundStatus): string {
  const colors: Record<RoundStatus, string> = {
    upcoming: 'bg-sky/10 text-sky',
    signup_open: 'bg-fairway/10 text-fairway',
    locked: 'bg-trophy/10 text-trophy',
    in_progress: 'bg-fairway-light/10 text-fairway-light',
    completed: 'bg-muted text-muted-foreground',
    cancelled: 'bg-penalty/10 text-penalty',
  }
  return colors[status]
}
