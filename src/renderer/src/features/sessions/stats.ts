import { addDays, DAY_MS, isoDate, parseISO } from '@renderer/lib/date'
import type { Session } from './types'

/**
 * Consecutive days ending at `refDate` (inclusive) that have ≥1 session — used
 * to flag "no rest" streaks. Ported from the design's `consecutiveActiveDays`.
 */
export function consecutiveActiveDays(sessions: Session[], refDate: Date): number {
  const dates = new Set(sessions.map((s) => s.date))
  let streak = 0
  let d = new Date(refDate)
  while (dates.has(isoDate(d)) && streak < 60) {
    streak++
    d = addDays(d, -1)
  }
  return streak
}

/**
 * Longest run of consecutive days with ≥1 completed session — the "best
 * streak". Ported from the design's `bestCompletedStreak`.
 */
export function bestCompletedStreak(sessions: Session[]): number {
  const dates = [...new Set(sessions.filter((s) => s.actual != null).map((s) => s.date))].sort()
  let best = 0
  let run = 0
  let prev: Date | null = null
  for (const ds of dates) {
    const d = parseISO(ds)
    if (prev && d.getTime() - prev.getTime() === DAY_MS) run++
    else run = 1
    if (run > best) best = run
    prev = d
  }
  return best
}
