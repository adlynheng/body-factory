import { useMemo, type ReactNode } from 'react'
import { Banner } from '@renderer/components/ui/Banner'
import { Button } from '@renderer/components/ui/Button'
import { Callout } from '@renderer/components/ui/Callout'
import { Card } from '@renderer/components/ui/Card'
import { Icon } from '@renderer/components/ui/Icon'
import { SegmentBar } from '@renderer/components/ui/SegmentBar'
import {
  bestCompletedStreak,
  consecutiveActiveDays,
  TODAY,
  type Session
} from '@renderer/features/sessions'
import {
  addDays,
  DAY_NAMES_LONG,
  isoDate,
  MONTH_NAMES,
  parseISO,
  sameDay,
  weekDays,
  weekNum
} from '@renderer/lib/date'
import { SessionRow } from './SessionRow'
import { WeekStrip } from './WeekStrip'

export interface OverviewProps {
  sessions: Session[]
  onOpenSession?: (id: string) => void
  onNavCalendar?: () => void
  onOpenImport?: () => void
  /** Count of Apple Fitness workouts waiting to be imported (shows the banner). */
  fitnessInboxCount?: number
  restThreshold?: number
  restNudgesEnabled?: boolean
}

function weekRangeLabel(days: Date[]): string {
  const s = days[0]
  const e = days[6]
  if (s.getMonth() === e.getMonth()) {
    return `${MONTH_NAMES[s.getMonth()]} ${s.getDate()}–${e.getDate()}`
  }
  return `${MONTH_NAMES[s.getMonth()].slice(0, 3)} ${s.getDate()} – ${MONTH_NAMES[e.getMonth()].slice(0, 3)} ${e.getDate()}`
}

/**
 * Overview — the landing screen (design's `HomeView`): where you are in the
 * week, a completed / missed / remaining progress hero, the seven-day strip,
 * and Today + Coming-up lists. Pure presentation over the `sessions` prop;
 * callbacks bubble navigation up to the app shell.
 */
export function Overview({
  sessions,
  onOpenSession,
  onNavCalendar,
  onOpenImport,
  fitnessInboxCount = 0,
  restThreshold = 5,
  restNudgesEnabled = true
}: OverviewProps): ReactNode {
  const days = useMemo(() => weekDays(TODAY), [])
  const wkStart = days[0]
  const wkEnd = addDays(wkStart, 7)

  const sessionsByDate = useMemo(() => {
    const m: Record<string, Session[]> = {}
    sessions.forEach((s) => {
      ;(m[s.date] ??= []).push(s)
    })
    return m
  }, [sessions])

  const thisWeek = useMemo(
    () =>
      sessions.filter((s) => {
        const d = parseISO(s.date)
        return d >= wkStart && d < wkEnd
      }),
    [sessions, wkStart, wkEnd]
  )

  const completed = thisWeek.filter((s) => s.actual != null)
  const missed = thisWeek.filter((s) => s.actual == null && parseISO(s.date) < TODAY)
  const toGo = thisWeek.filter((s) => s.actual == null && parseISO(s.date) >= TODAY)
  const total = thisWeek.length || 1
  const pct = Math.round((completed.length / total) * 100)

  const todaySessions = sessionsByDate[isoDate(TODAY)] ?? []
  const dayIndex = days.findIndex((d) => sameDay(d, TODAY))
  const upcoming = toGo
    .filter((s) => parseISO(s.date) > TODAY)
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())

  const bestStreak = useMemo(() => bestCompletedStreak(sessions), [sessions])
  const restStreak = useMemo(() => consecutiveActiveDays(sessions, TODAY), [sessions])
  const restFlagged = restNudgesEnabled && restStreak >= restThreshold

  return (
    <div className="flex flex-col gap-[18px] px-7 pb-8 pt-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-[5px] text-[11px] font-bold uppercase tracking-widest text-text-tertiary">
            Week Overview · Wk {weekNum(wkStart)}
          </div>
          <h1 className="font-display text-[32px] font-extrabold leading-none tracking-tight text-text-primary">
            {weekRangeLabel(days)}
          </h1>
          <div className="mt-[5px] whitespace-nowrap text-[13px] font-medium text-text-tertiary">
            {DAY_NAMES_LONG[(TODAY.getDay() + 6) % 7]}, {MONTH_NAMES[TODAY.getMonth()]}{' '}
            {TODAY.getDate()} · Day {dayIndex + 1} of 7
          </div>
        </div>
        <Button variant="soft" onClick={onNavCalendar}>
          Open Calendar
          <Icon name="caretRight" />
        </Button>
      </div>

      {fitnessInboxCount > 0 && (
        <Banner
          tone="success"
          icon="health"
          count={fitnessInboxCount}
          title="New from Apple Fitness"
          description={`${fitnessInboxCount} recorded ${fitnessInboxCount === 1 ? 'workout is' : 'workouts are'} ready to sync to a planned session.`}
          cta="Import →"
          onClick={onOpenImport}
        />
      )}

      {restFlagged && (
        <Callout tone="danger" icon="close">
          {restStreak} days without rest — consider scheduling a rest day.
        </Callout>
      )}

      {/* Progress hero */}
      <section className="flex flex-col gap-4 rounded-card border border-border-subtle bg-surface-card px-[22px] py-5">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-[3px]">
            <span className="mono flex items-baseline gap-2 text-[34px] font-extrabold leading-none tracking-tight text-text-primary">
              {completed.length}
              <span className="text-[18px] font-bold text-text-muted">/ {thisWeek.length}</span>
            </span>
            <span className="text-[12.5px] font-medium text-text-tertiary">
              sessions completed this week
            </span>
          </div>
          <div className="mono text-2xl font-extrabold tracking-tight text-success">{pct}%</div>
        </div>
        <SegmentBar
          aria-label={`Week progress: ${completed.length} done, ${missed.length} missed, ${toGo.length} to go`}
          segments={[
            { value: completed.length, tone: 'success', title: `${completed.length} completed` },
            { value: missed.length, tone: 'danger', title: `${missed.length} missed` },
            { value: toGo.length, tone: 'neutral', title: `${toGo.length} to go` }
          ]}
        />
        <div className="flex items-center gap-[18px] text-[13px]">
          <span className="flex items-center gap-[7px] font-semibold text-text-tertiary">
            <Icon name="calories" className="text-[#f26a2e]" />
            Best streak: {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
          </span>
          <span className="flex items-center gap-[7px] font-medium text-text-muted">
            <Icon name="close" className="text-danger" />
            {missed.length} missed
          </span>
        </div>
      </section>

      <WeekStrip days={days} sessionsByDate={sessionsByDate} onOpenSession={onOpenSession} />

      {/* Today + Coming up */}
      <div className="grid grid-cols-2 gap-3.5">
        <Card>
          <Card.Header className="flex-row items-center justify-between">
            <Card.Title>Today</Card.Title>
            <span className="mono text-xs text-text-tertiary">
              {MONTH_NAMES[TODAY.getMonth()].slice(0, 3)} {TODAY.getDate()}
            </span>
          </Card.Header>
          <Card.Content className="flex flex-col gap-[3px]">
            {todaySessions.length === 0 ? (
              <p className="px-0.5 py-3.5 text-[12.5px] text-text-tertiary">
                Rest day — nothing scheduled.
              </p>
            ) : (
              todaySessions.map((s) => (
                <SessionRow
                  key={s.id}
                  session={s}
                  onOpen={() => onOpenSession?.(s.id)}
                  showStatus
                />
              ))
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header className="flex-row items-center justify-between">
            <Card.Title>Coming up</Card.Title>
            <span className="mono text-xs text-text-tertiary">{upcoming.length} left</span>
          </Card.Header>
          <Card.Content className="flex flex-col gap-[3px]">
            {upcoming.length === 0 ? (
              <p className="px-0.5 py-3.5 text-[12.5px] text-text-tertiary">
                Nothing left this week — you&apos;re all caught up.
              </p>
            ) : (
              upcoming.map((s) => (
                <SessionRow key={s.id} session={s} onOpen={() => onOpenSession?.(s.id)} showDate />
              ))
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
