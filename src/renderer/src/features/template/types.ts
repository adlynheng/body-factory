import type { SessionTypeKey } from '@renderer/features/sessions'

/**
 * One recurring entry in the weekly template (design's template entry). `day`
 * is a fixed Monday-first index (0 = Mon … 6 = Sun), independent of the
 * calendar's week-start setting — the template editor is always Mon→Sun.
 */
export interface TemplateEntry {
  id: string
  day: number
  type: SessionTypeKey
  subtype: string
}

/** A sensible starting week the user can edit. */
export const INITIAL_TEMPLATE: TemplateEntry[] = [
  { id: 't-mon', day: 0, type: 'run', subtype: 'Intervals' },
  { id: 't-tue', day: 1, type: 'gym', subtype: 'Lower body' },
  { id: 't-wed', day: 2, type: 'floorball', subtype: 'Training' },
  { id: 't-thu', day: 3, type: 'run', subtype: 'Long easy' },
  { id: 't-fri', day: 4, type: 'gym', subtype: 'Upper body' },
  { id: 't-sat', day: 5, type: 'floorball', subtype: 'Match' }
]
