/**
 * Value formatters — ported from the design (`data.jsx`). Distance respects the
 * app-wide unit (settable from Settings later); everything else is unit-free.
 */

const pad = (n: number): string => String(n).padStart(2, '0')

/** 'km' | 'mi' — app-wide distance unit. */
let distanceUnit: 'km' | 'mi' = 'km'
export const getDistanceUnit = (): 'km' | 'mi' => distanceUnit
export const setDistanceUnit = (u: 'km' | 'mi'): void => {
  distanceUnit = u
}

/** Seconds-per-km → "m:ss". */
export const fmtPace = (secPerKm: number): string => {
  const m = Math.floor(secPerKm / 60)
  const s = Math.round(secPerKm % 60)
  return `${m}:${pad(s)}`
}

/** Minutes → "h:mm:ss" / "m:ss". */
export const fmtTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return h > 0 ? `${h}:${pad(m)}:00` : `${m}:00`
}

/** Minutes → "1h 5m" / "45m". */
export const fmtMin = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

export const fmtDistance = (km: number): string =>
  distanceUnit === 'mi' ? `${(km * 0.621371).toFixed(1)} mi` : `${km.toFixed(1)} km`

export const distanceParts = (km: number): { value: string; unit: 'km' | 'mi' } =>
  distanceUnit === 'mi'
    ? { value: (km * 0.621371).toFixed(1), unit: 'mi' }
    : { value: km.toFixed(1), unit: 'km' }
