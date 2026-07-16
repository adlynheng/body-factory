import type { ReactNode } from 'react'
import { SESSION_TYPES, sessionLabel, TODAY, type Session } from '@renderer/features/sessions'
import { DAY_NAMES, isoDate, parseISO, sameDay } from '@renderer/lib/date'
import { cn } from '@renderer/lib/utils'

export interface WeekStripProps {
  days: Date[]
  sessionsByDate: Record<string, Session[]>
  onOpenSession?: (id: string) => void
}

/**
 * WeekStrip — the seven-day glance under the Overview header (design's
 * `.bf-wstrip`). Each column lists its sessions as tiny type-colored chips
 * (done ✓ / missed ✕), or "Rest"; today's column is accent-highlighted.
 */
export function WeekStrip({ days, sessionsByDate, onOpenSession }: WeekStripProps): ReactNode {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => {
        const daySessions = sessionsByDate[isoDate(d)] ?? []
        const isToday = sameDay(d, TODAY)
        return (
          <div
            key={isoDate(d)}
            className={cn(
              'flex flex-col rounded-xl border p-2',
              isToday ? 'border-accent/40 bg-accent/[0.06]' : 'border-border-subtle bg-surface-card'
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-2xs font-bold uppercase tracking-wide text-text-tertiary">
                {DAY_NAMES[(d.getDay() + 6) % 7]}
              </span>
              <span
                className={cn(
                  'mono text-sm font-bold',
                  isToday ? 'text-accent' : 'text-text-secondary'
                )}
              >
                {d.getDate()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {daySessions.length === 0 ? (
                <div className="rounded-md py-2 text-center text-2xs font-medium text-text-muted">
                  Rest
                </div>
              ) : (
                daySessions.map((s) => {
                  const t = SESSION_TYPES[s.type]
                  const done = s.actual != null
                  const missed = !done && parseISO(s.date) < TODAY
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onOpenSession?.(s.id)}
                      title={sessionLabel(s)}
                      className={cn(
                        'flex items-center gap-1 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-surface-hover',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
                        missed && 'opacity-60'
                      )}
                    >
                      <span
                        className="h-3 w-0.5 shrink-0 rounded-full"
                        style={{ background: t.color }}
                        aria-hidden="true"
                      />
                      <span className="flex-1 truncate text-2xs font-semibold text-text-secondary">
                        {t.label}
                      </span>
                      {done && <span className="text-2xs text-success">✓</span>}
                      {missed && <span className="text-2xs text-danger">✕</span>}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
