import { addDays, isoDate, startOfWeek } from '@renderer/lib/date'
import type { Actual, Planned, Session } from './types'

/**
 * Demo "today" — the mock dataset is anchored to May 2026, so the app's sense
 * of now must match it (past sessions have actuals, future ones are planned).
 */
export const TODAY = new Date(2026, 4, 27) // Wed, May 27 2026

// ── Mock sessions — ported from the design's `data.jsx` genSessions() ──
// ~7 weeks: past days get an `actual`, future days stay planned-only.

let nextId = 1
const sid = (): string => `s${nextId++}`

const makeRun = (
  date: Date,
  subtype: string,
  planned: Planned,
  actual: Actual | null
): Session => ({ id: sid(), date: isoDate(date), type: 'run', subtype, planned, actual })

const makeGym = (
  date: Date,
  subtype: string,
  plannedDuration: number,
  actual: { duration: number } | null,
  notes?: string
): Session => ({
  id: sid(),
  date: isoDate(date),
  type: 'gym',
  subtype,
  planned: { duration: plannedDuration },
  actual: actual ? { duration: actual.duration } : null,
  notes: notes ?? ''
})

const makeFloor = (date: Date, subtype: string): Session => ({
  id: sid(),
  date: isoDate(date),
  type: 'floorball',
  subtype,
  planned: {},
  actual: null
})

const makeMisc = (
  date: Date,
  subtype: string,
  plannedDuration: number,
  actual: { duration: number } | null
): Session => ({
  id: sid(),
  date: isoDate(date),
  type: 'misc',
  subtype,
  planned: { duration: plannedDuration },
  actual: actual ? { duration: actual.duration } : null
})

function genSessions(): Session[] {
  const out: Session[] = []
  const seed0 = startOfWeek(new Date(2026, 3, 20)) // Mon, Apr 20 2026
  const weeks = 7
  const past = (d: Date): boolean => d < TODAY

  for (let w = 0; w < weeks; w++) {
    const mon = addDays(seed0, w * 7)
    const tue = addDays(mon, 1)
    const wed = addDays(mon, 2)
    const thu = addDays(mon, 3)
    const fri = addDays(mon, 4)
    const sat = addDays(mon, 5)
    const sun = addDays(mon, 6)

    // Mon — Long easy run
    {
      const dist = 10 + (w % 3) * 0.5
      const time = 58 + w * 0.7
      const pace = (time * 60) / dist
      const planned: Planned = { distance: dist, time, pace, avgBpm: 148 }
      const actual: Actual | null = past(mon)
        ? {
            distance: dist + (Math.random() - 0.3) * 0.4,
            time: time + (Math.random() - 0.4) * 2,
            pace: pace + (Math.random() - 0.5) * 4,
            avgBpm: 146 + Math.floor((Math.random() - 0.5) * 8),
            maxBpm: 168 + Math.floor(Math.random() * 6),
            elev: 45 + Math.floor(Math.random() * 30),
            zones: [10, 35, 45, 8, 2]
          }
        : null
      out.push(makeRun(mon, 'Long easy', planned, actual))
    }
    // Tue — Gym upper
    out.push(
      makeGym(
        tue,
        'Upper body',
        60,
        past(tue) ? { duration: 58 + Math.floor(Math.random() * 8) } : null,
        'Push pull split. Focus on overhead.'
      )
    )
    // Wed — Floorball training
    out.push(makeFloor(wed, 'Training'))
    // Thu — Intervals
    {
      const dist = 7.5 + (w % 2) * 0.3
      const time = 40 + w * 0.6
      const pace = (time * 60) / dist
      const planned: Planned = { distance: dist, time, pace, avgBpm: 162 }
      const actual: Actual | null = past(thu)
        ? {
            distance: dist + (Math.random() - 0.4) * 0.3,
            time: time + (Math.random() - 0.3) * 1.5,
            pace: pace + (Math.random() - 0.6) * 3,
            avgBpm: 160 + Math.floor((Math.random() - 0.5) * 6),
            maxBpm: 182 + Math.floor(Math.random() * 5),
            elev: 25 + Math.floor(Math.random() * 15),
            zones: [4, 12, 28, 38, 18],
            intervals: [{ label: '6×800m', avgPace: 232, avgBpm: 174 }]
          }
        : null
      out.push(makeRun(thu, 'Intervals', planned, actual))
    }
    // Fri — Gym lower
    out.push(
      makeGym(
        fri,
        'Lower body',
        65,
        past(fri) ? { duration: 60 + Math.floor(Math.random() * 10) } : null,
        'Squat day. Add depth jumps.'
      )
    )
    // Sat — alternate Long run / Floorball match
    if (w % 2 === 0) {
      const dist = 16 + (w / 2) * 0.6
      const time = 95 + w * 1.2
      const pace = (time * 60) / dist
      const planned: Planned = { distance: dist, time, pace, avgBpm: 152 }
      const actual: Actual | null = past(sat)
        ? {
            distance: dist + (Math.random() - 0.4) * 0.6,
            time: time + (Math.random() - 0.3) * 3,
            pace: pace + (Math.random() - 0.5) * 5,
            avgBpm: 150 + Math.floor((Math.random() - 0.5) * 6),
            maxBpm: 172 + Math.floor(Math.random() * 5),
            elev: 110 + Math.floor(Math.random() * 50),
            zones: [8, 32, 48, 10, 2]
          }
        : null
      out.push(makeRun(sat, 'Long easy', planned, actual))
    } else {
      out.push(makeFloor(sat, 'Match'))
    }
    // Sun — Misc (alternating) or rest
    if (w % 3 !== 0) {
      const sub = w % 2 === 0 ? 'Pilates' : 'Pickleball'
      out.push(makeMisc(sun, sub, 50, past(sun) ? { duration: 48 } : null))
    }
  }
  return out
}

export const INITIAL_SESSIONS: Session[] = genSessions()
