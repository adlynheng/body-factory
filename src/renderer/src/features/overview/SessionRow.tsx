import type { ReactNode } from 'react'
import { StatusBadge } from '@renderer/components/ui/StatusBadge'
import { SESSION_TYPES, sessionLabel, TODAY, type Session } from '@renderer/features/sessions'
import { DAY_NAMES, parseISO } from '@renderer/lib/date'
import { cn } from '@renderer/lib/utils'

export interface SessionRowProps {
  session: Session
  onOpen?: () => void
  /** Show a Done / Missed / Planned pill on the right. */
  showStatus?: boolean
  /** Show the session's weekday + date on the right. */
  showDate?: boolean
}

/**
 * SessionRow — a compact session line for the Overview lists (design's
 * `.bf-srow`): a type-colored bar, the session label + type, and either a
 * status pill or its date. Reuses the `StatusBadge` primitive for status.
 */
export function SessionRow({ session, onOpen, showStatus, showDate }: SessionRowProps): ReactNode {
  const t = SESSION_TYPES[session.type]
  const d = parseISO(session.date)
  const done = session.actual != null
  const missed = !done && d < TODAY
  const status = done ? 'done' : missed ? 'missed' : 'planned'

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'flex w-full items-center gap-[11px] rounded-[9px] bg-transparent p-2.5 text-left transition-colors',
        'hover:bg-surface-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60'
      )}
    >
      <span
        className="h-[30px] w-1 shrink-0 rounded-[3px]"
        style={{ background: t.color }}
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="truncate text-[13.5px] font-semibold text-text-primary">
          {sessionLabel(session)}
        </span>
        <span className="text-[10.5px] font-semibold uppercase tracking-wide text-text-tertiary">
          {t.label}
        </span>
      </span>
      {showDate && (
        <span className="mono shrink-0 text-xs text-text-tertiary">
          {DAY_NAMES[(d.getDay() + 6) % 7]} {d.getDate()}
        </span>
      )}
      {showStatus && <StatusBadge status={status} />}
    </button>
  )
}
