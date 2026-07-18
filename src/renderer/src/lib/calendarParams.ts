/**
 * Calendar URL param codecs. The calendar view is URL-driven (source of truth):
 *   /calendar?view=month&month=052026    → MMYYYY   (May 2026)
 *   /calendar?view=week&week=25052026    → DDMMYYYY (week containing 25 May 2026)
 *
 * Parsers return `null` on anything malformed so the page can redirect to a
 * canonical URL. `formatWeekParam` normalises to the week-start date (per the
 * configured week-start day) so the same visible week always yields one URL.
 */
import { startOfWeek } from './date'

const pad = (n: number): string => String(n).padStart(2, '0')

export type CalendarView = 'month' | 'week'

export const parseView = (raw: string | null): CalendarView | null =>
  raw === 'month' || raw === 'week' ? raw : null

/** `MMYYYY` → the first of that month, or null. */
export const parseMonthParam = (raw: string | null): Date | null => {
  if (!raw || !/^\d{6}$/.test(raw)) return null
  const month = Number(raw.slice(0, 2))
  const year = Number(raw.slice(2))
  if (month < 1 || month > 12) return null
  return new Date(year, month - 1, 1)
}

export const formatMonthParam = (d: Date): string => `${pad(d.getMonth() + 1)}${d.getFullYear()}`

/** `DDMMYYYY` → that calendar date, or null. */
export const parseWeekParam = (raw: string | null): Date | null => {
  if (!raw || !/^\d{8}$/.test(raw)) return null
  const day = Number(raw.slice(0, 2))
  const month = Number(raw.slice(2, 4))
  const year = Number(raw.slice(4))
  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const d = new Date(year, month - 1, day)
  // Reject overflow (e.g. 31022026 → 3 Mar): the parts must round-trip.
  if (d.getMonth() !== month - 1 || d.getDate() !== day) return null
  return d
}

/** Encodes the anchor's week-start as `DDMMYYYY` for a canonical URL. */
export const formatWeekParam = (d: Date): string => {
  const s = startOfWeek(d)
  return `${pad(s.getDate())}${pad(s.getMonth() + 1)}${s.getFullYear()}`
}

/** The canonical `?view=…&…=…` params for a given view + anchor. */
export const canonicalCalendarParams = (
  view: CalendarView,
  anchor: Date
): Record<string, string> =>
  view === 'week'
    ? { view: 'week', week: formatWeekParam(anchor) }
    : { view: 'month', month: formatMonthParam(anchor) }
