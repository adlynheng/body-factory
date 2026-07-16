/**
 * Date helpers — ported from the Body Factory design (`data.jsx`). All dates are
 * local calendar dates; ISO strings are `yyyy-mm-dd` (no time/zone). Day-of-week
 * arrays are Monday-first internally; `orderedDayNames` re-orders for display.
 */

export const DAY_MS = 86400000

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
export const DAY_NAMES_LONG = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const

const pad = (n: number): string => String(n).padStart(2, '0')

export const isoDate = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const parseISO = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (d: Date, n: number): Date => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export const sameDay = (a: Date, b: Date): boolean => isoDate(a) === isoDate(b)

/** 0 = Sunday, 1 = Monday. Settable from Settings later. */
let weekStartDay = 1
export const getWeekStartDay = (): number => weekStartDay
export const setWeekStartDay = (n: number): void => {
  weekStartDay = n
}

export const startOfWeek = (d: Date): Date => {
  const x = new Date(d)
  const day = (x.getDay() - weekStartDay + 7) % 7
  x.setDate(x.getDate() - day)
  return x
}

export const startOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1)
export const endOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth() + 1, 0)

export const weekDays = (d: Date): Date[] =>
  Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(d), i))

export const monthGrid = (d: Date): Date[] => {
  const start = startOfWeek(startOfMonth(d))
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

/** Re-order Monday-first name arrays to start on the configured week-start day. */
export const orderedDayNames = <T>(names: readonly T[]): T[] =>
  Array.from({ length: 7 }, (_, j) => {
    const wd = (weekStartDay + j) % 7
    const i = (wd - 1 + 7) % 7
    return names[i]
  })

/** ISO-ish week number of the year (matches the design's `weekNum`). */
export const weekNum = (d: Date): number => {
  const first = new Date(d.getFullYear(), 0, 1)
  const days = Math.floor((d.getTime() - first.getTime()) / DAY_MS)
  return Math.ceil((days + first.getDay() + 1) / 7)
}
