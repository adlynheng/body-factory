import { useEffect, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Calendar } from '@renderer/features/calendar'
import { TODAY } from '@renderer/features/sessions'
import {
  canonicalCalendarParams,
  parseMonthParam,
  parseView,
  parseWeekParam,
  type CalendarView
} from '@renderer/lib/calendarParams'
import { useAppStore } from '@renderer/store/appStore'

/** Derive the anchor Date from the raw `month`/`week` params for a given view. */
function readAnchor(
  view: CalendarView | null,
  rawMonth: string | null,
  rawWeek: string | null
): Date | null {
  if (view === 'week') return parseWeekParam(rawWeek)
  if (view === 'month') return parseMonthParam(rawMonth)
  return null
}

/**
 * `/calendar?view=…&month=…/week=…` — the calendar screen. The URL is the source
 * of truth: view + anchor are derived from the query string, and every nav action
 * (prev/next/today, month/week toggle) rewrites it. A bare or malformed URL is
 * redirected once to the canonical form (default view from settings, today).
 */
export function CalendarPage(): ReactNode {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessions = useAppStore((s) => s.sessions)
  const moveSession = useAppStore((s) => s.moveSession)
  const setAddingForDate = useAppStore((s) => s.setAddingForDate)
  const defaultView = useAppStore((s) => s.settings.defaultView)

  const rawView = searchParams.get('view')
  const rawMonth = searchParams.get('month')
  const rawWeek = searchParams.get('week')

  // Normalise a missing/invalid URL to canonical params (deps are primitives so
  // this can't loop on the fresh Date/params objects created each render).
  useEffect(() => {
    const view = parseView(rawView)
    const anchor = readAnchor(view, rawMonth, rawWeek)
    if (view && anchor) return
    setSearchParams(canonicalCalendarParams(view ?? defaultView, anchor ?? new Date(TODAY)), {
      replace: true
    })
  }, [rawView, rawMonth, rawWeek, defaultView, setSearchParams])

  const view = parseView(rawView)
  const anchor = readAnchor(view, rawMonth, rawWeek)
  if (!view || !anchor) return null // waiting for the redirect above

  return (
    <Calendar
      sessions={sessions}
      view={view}
      anchor={anchor}
      onViewChange={(v) => setSearchParams(canonicalCalendarParams(v, anchor))}
      onAnchorChange={(a) => setSearchParams(canonicalCalendarParams(view, a))}
      onMoveSession={moveSession}
      onOpenSession={(id) => navigate(`/session/${id}`)}
      onAddSession={setAddingForDate}
    />
  )
}
