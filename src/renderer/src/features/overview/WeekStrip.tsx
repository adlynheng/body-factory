import type { CSSProperties, ReactNode } from 'react'
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
        const isPast = !isToday && d < TODAY
        return (
          <div
            key={isoDate(d)}
            className={cn(
              'flex min-h-[118px] flex-col gap-2 rounded-[13px] border px-2 py-2.5',
              isToday
                ? 'border-accent/50 bg-surface-card ring-[1.5px] ring-accent/40'
                : isPast
                  ? 'border-border-subtle bg-surface-raised'
                  : 'border-border-subtle bg-surface-card'
            )}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wide text-text-tertiary">
                {DAY_NAMES[(d.getDay() + 6) % 7]}
              </span>
              <span
                className={cn(
                  'text-[15px] font-mono font-bold',
                  isToday ? 'text-text-primary' : 'text-text-secondary'
                )}
              >
                {d.getDate()}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {daySessions.length === 0 ? (
                <div className="px-0.5 py-1 text-[10.5px] font-semibold text-text-muted">Rest</div>
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
                      style={{ '--dot': t.color } as CSSProperties}
                      className={cn(
                        'flex w-full items-center gap-[5px] rounded-[7px] px-[7px] py-[5px] text-left transition-colors',
                        'bg-[color-mix(in_oklab,var(--dot)_14%,transparent)] hover:bg-[color-mix(in_oklab,var(--dot)_22%,transparent)]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
                        missed && 'opacity-[0.68]'
                      )}
                    >
                      <span
                        className="h-[11px] w-[3px] shrink-0 rounded-[2px] bg-[var(--dot)]"
                        aria-hidden="true"
                      />
                      <span className="flex-1 truncate text-[10.5px] font-bold text-text-primary">
                        {t.label}
                      </span>
                      {done && <span className="text-[10px] font-extrabold text-success">✓</span>}
                      {missed && <span className="text-[9px] font-extrabold text-danger">✕</span>}
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
