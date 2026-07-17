import type { ReactNode } from 'react'
import { Button } from '@renderer/components/ui/Button'
import { Icon } from '@renderer/components/ui/Icon'
import { SegControl } from '@renderer/components/ui/SegControl'
import { TODAY } from '@renderer/features/sessions'
import { isoDate, MONTH_NAMES, weekDays } from '@renderer/lib/date'
import type { CalendarView } from './Calendar'

export interface CalendarHeaderProps {
  anchor: Date
  setAnchor: (d: Date) => void
  view: CalendarView
  setView: (v: CalendarView) => void
  onAddSession?: (date: string) => void
}

function weekRangeLabel(anchor: Date): string {
  const days = weekDays(anchor)
  const s = days[0]
  const e = days[6]
  if (s.getMonth() === e.getMonth()) {
    return `${MONTH_NAMES[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`
  }
  return `${MONTH_NAMES[s.getMonth()].slice(0, 3)} ${s.getDate()} – ${MONTH_NAMES[e.getMonth()].slice(0, 3)} ${e.getDate()}, ${e.getFullYear()}`
}

/**
 * CalendarHeader — the calendar's toolbar (design's `.bf-cal-hd`): the current
 * period title, prev/next/today navigation on the left; the Month/Week toggle
 * and the New Session action on the right. Stepping moves the anchor by one
 * week or month depending on the active view.
 */
export function CalendarHeader({
  anchor,
  setAnchor,
  view,
  setView,
  onAddSession
}: CalendarHeaderProps): ReactNode {
  const title =
    view === 'week'
      ? weekRangeLabel(anchor)
      : `${MONTH_NAMES[anchor.getMonth()]} ${anchor.getFullYear()}`

  const step = (dir: 1 | -1): void => {
    const d = new Date(anchor)
    if (view === 'week') d.setDate(d.getDate() + dir * 7)
    else d.setMonth(d.getMonth() + dir)
    setAnchor(d)
  }

  const navBtn =
    'flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-border-subtle bg-surface-card text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60'

  return (
    <div className="flex shrink-0 flex-nowrap items-center justify-between gap-4 border-b border-border-subtle px-[22px] pb-[14px] pt-[18px]">
      <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
        <span className="mr-1.5 truncate text-[22px] font-extrabold leading-[1.05] tracking-[-0.03em] text-text-primary">
          {title}
        </span>
        <button type="button" onClick={() => step(-1)} aria-label="Previous" className={navBtn}>
          <Icon name="caretLeft" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next" className={navBtn}>
          <Icon name="caretRight" />
        </button>
        <button
          type="button"
          onClick={() => setAnchor(new Date(TODAY))}
          className="h-[30px] rounded-lg border border-border-subtle bg-surface-card px-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          Today
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <SegControl
          aria-label="Calendar view"
          value={view}
          onValueChange={(v) => setView(v as CalendarView)}
          options={[
            { value: 'month', label: 'Month' },
            { value: 'week', label: 'Week' }
          ]}
        />
        <Button
          variant="solid"
          className="h-8 gap-2 px-[14px] text-[12.5px] font-bold"
          onClick={() => onAddSession?.(isoDate(TODAY))}
        >
          <Icon name="add" className="text-base" />
          New Session
        </Button>
      </div>
    </div>
  )
}
