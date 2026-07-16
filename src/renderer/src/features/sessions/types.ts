import type { IconName } from '@renderer/components/ui/Icon'

export type SessionTypeKey = 'run' | 'gym' | 'floorball' | 'misc'

/** Planned targets — fields present depend on the session type. */
export interface Planned {
  distance?: number
  time?: number
  pace?: number
  avgBpm?: number
  duration?: number
}

/** Recorded result. `unsynced` = marked complete but without imported metrics. */
export interface Actual extends Planned {
  maxBpm?: number
  elev?: number
  zones?: number[]
  intervals?: { label: string; avgPace: number; avgBpm: number }[]
  unsynced?: boolean
  notes?: string
}

export interface Session {
  id: string
  /** ISO `yyyy-mm-dd`. */
  date: string
  type: SessionTypeKey
  subtype: string
  planned: Planned
  actual: Actual | null
  missed?: boolean
  title?: string
  description?: string
  notes?: string
}

export interface SessionTypeMeta {
  key: SessionTypeKey
  label: string
  /** CSS color for the type — the accent applied per session. */
  color: string
  icon: IconName
  subtypes: string[]
}

/**
 * Session-type registry (design's `SESSION_TYPES`). `color` points at the
 * theme's activity-accent tokens so a palette switch flows through; components
 * set it as the ambient `--accent`.
 */
export const SESSION_TYPES: Record<SessionTypeKey, SessionTypeMeta> = {
  run: {
    key: 'run',
    label: 'Run',
    color: 'var(--bf-run)',
    icon: 'run',
    subtypes: ['Long easy', 'Intervals', 'Short intervals', 'Tempo', 'Recovery']
  },
  gym: {
    key: 'gym',
    label: 'Gym',
    color: 'var(--bf-gym)',
    icon: 'gym',
    subtypes: ['Lower body', 'Upper body', 'Full body']
  },
  floorball: {
    key: 'floorball',
    label: 'Floorball',
    color: 'var(--bf-floorball)',
    icon: 'floorball',
    subtypes: ['Training', 'Match']
  },
  misc: {
    key: 'misc',
    label: 'Misc',
    color: 'var(--bf-misc)',
    icon: 'misc',
    subtypes: ['Pilates', 'Pickleball', 'Yoga', 'Hike', 'Mobility']
  }
}

/** Display label for a session — its custom title, else the subtype. */
export const sessionLabel = (s: Session): string => (s.title && s.title.trim()) || s.subtype
