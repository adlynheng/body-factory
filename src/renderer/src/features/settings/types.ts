/**
 * App-wide preferences (design's SettingsView `settings` object). These drive
 * real app behavior: `units` → `setDistanceUnit`, `weekStart` → `setWeekStartDay`
 * (wired where the state lives, in `App.tsx`).
 */
export interface AppSettings {
  units: 'km' | 'mi'
  weekStart: 'mon' | 'sun'
  defaultView: 'month' | 'week'
  reminders: boolean
  /** Flag when this many days pass without a rest day. */
  restThreshold: number
  restNudges: boolean
}

export const DEFAULT_SETTINGS: AppSettings = {
  units: 'km',
  weekStart: 'mon',
  defaultView: 'month',
  reminders: true,
  restThreshold: 3,
  restNudges: true
}
