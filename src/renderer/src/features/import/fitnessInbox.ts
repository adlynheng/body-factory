import type { Actual, SessionTypeKey } from '@renderer/features/sessions'
import { TODAY } from '@renderer/features/sessions'
import { addDays, isoDate } from '@renderer/lib/date'

/**
 * A recorded workout sitting in Apple Fitness, not yet synced to a planned
 * session (design's fitness "inbox"). Metrics present depend on `type`.
 */
export interface FitnessWorkout {
  id: string
  type: SessionTypeKey
  name: string
  /** Recording device, e.g. "Apple Watch". */
  source: string
  /** ISO `yyyy-mm-dd`. */
  date: string
  /** Minutes. */
  time?: number
  distance?: number
  /** Seconds per km. */
  pace?: number
  avgBpm?: number
  maxBpm?: number
  elev?: number
  /** Minutes (non-run workouts). */
  duration?: number
}

/**
 * Mock "unassigned" Apple Fitness workouts waiting to be synced — ported from
 * the design's `seedFitnessInbox()`, anchored to the demo `TODAY`.
 */
export function seedFitnessInbox(): FitnessWorkout[] {
  return [
    {
      id: 'af1',
      type: 'run',
      name: 'Outdoor Run',
      source: 'Apple Watch',
      date: isoDate(TODAY),
      time: 52,
      distance: 9.4,
      pace: Math.round((52 * 60) / 9.4),
      avgBpm: 152,
      maxBpm: 171,
      elev: 63
    },
    {
      id: 'af2',
      type: 'run',
      name: 'Outdoor Run',
      source: 'Apple Watch',
      date: isoDate(addDays(TODAY, -1)),
      time: 27,
      distance: 5.1,
      pace: Math.round((27 * 60) / 5.1),
      avgBpm: 146,
      maxBpm: 164,
      elev: 22
    },
    {
      id: 'af3',
      type: 'gym',
      name: 'Functional Strength',
      source: 'iPhone',
      date: isoDate(TODAY),
      duration: 48,
      avgBpm: 118
    }
  ]
}

/** Build the recorded `Actual` a workout contributes when synced to a session. */
export function workoutToActual(workout: FitnessWorkout, sessionType: SessionTypeKey): Actual {
  if (sessionType === 'run') {
    return {
      distance: workout.distance != null ? +workout.distance.toFixed(2) : undefined,
      time: workout.time,
      pace: workout.pace,
      avgBpm: workout.avgBpm,
      maxBpm: workout.maxBpm ?? (workout.avgBpm != null ? workout.avgBpm + 20 : undefined),
      elev: workout.elev ?? 0,
      zones: [10, 32, 46, 9, 3]
    }
  }
  return { duration: workout.duration ?? workout.time }
}
