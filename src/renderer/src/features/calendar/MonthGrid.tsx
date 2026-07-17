/* eslint-disable react-hooks/refs -- @hello-pangea/dnd's render props hand back
   `innerRef` + `draggableProps`/`dragHandleProps` that MUST be spread onto the
   element during render; that is the library's contract, not a ref read. */
import { Fragment, useMemo, type ReactNode } from 'react'
import { Draggable, Droppable, type DraggableProvided } from '@hello-pangea/dnd'
import { SESSION_TYPES, sessionLabel, TODAY, type Session } from '@renderer/features/sessions'
import {
  DAY_NAMES,
  isoDate,
  monthGrid,
  orderedDayNames,
  parseISO,
  sameDay,
  weekNum
} from '@renderer/lib/date'
import { cn } from '@renderer/lib/utils'
import { DragPortal } from './DragPortal'

export interface MonthGridProps {
  sessions: Session[]
  anchor: Date
  onOpenSession?: (id: string) => void
  onAddSession?: (date: string) => void
}

function groupByDate(sessions: Session[]): Record<string, Session[]> {
  const m: Record<string, Session[]> = {}
  sessions.forEach((s) => {
    ;(m[s.date] ??= []).push(s)
  })
  return m
}

/**
 * MonthGrid — the calendar's month view (design's `.bf-month`): a 22px
 * week-number rail plus a 7×6 grid of day cells. Each cell is a drop target;
 * its sessions are draggable chips. Days outside the anchored month are dimmed.
 */
export function MonthGrid({
  sessions,
  anchor,
  onOpenSession,
  onAddSession
}: MonthGridProps): ReactNode {
  const days = useMemo(() => monthGrid(anchor), [anchor])
  const byDate = useMemo(() => groupByDate(sessions), [sessions])
  const rows = useMemo(
    () => Array.from({ length: 6 }, (_, r) => days.slice(r * 7, r * 7 + 7)),
    [days]
  )
  const heads = orderedDayNames(DAY_NAMES)

  return (
    <div className="flex min-h-0 flex-1 flex-col px-[22px] pb-[22px]">
      <div className="grid min-h-0 flex-1 grid-cols-[22px_repeat(7,1fr)] grid-rows-[auto_repeat(6,1fr)] gap-1">
        {/* Header row: week-number spacer + weekday labels */}
        <div />
        {heads.map((d) => (
          <div
            key={d}
            className="pb-2.5 pl-2.5 pt-3.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-text-tertiary"
          >
            {d}
          </div>
        ))}

        {rows.map((row, ri) => (
          <Fragment key={ri}>
            <div className="mono flex items-center justify-center rounded-lg text-[10.5px] font-bold text-text-tertiary">
              {weekNum(row[0])}
            </div>
            {row.map((d) => (
              <DayCell
                key={isoDate(d)}
                date={d}
                inMonth={d.getMonth() === anchor.getMonth()}
                sessions={byDate[isoDate(d)] ?? []}
                onOpenSession={onOpenSession}
                onAddSession={onAddSession}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

interface DayCellProps {
  date: Date
  inMonth: boolean
  sessions: Session[]
  onOpenSession?: (id: string) => void
  onAddSession?: (date: string) => void
}

function DayCell({
  date,
  inMonth,
  sessions,
  onOpenSession,
  onAddSession
}: DayCellProps): ReactNode {
  const iso = isoDate(date)
  const isToday = sameDay(date, TODAY)
  const visible = sessions.slice(0, 4)
  const extra = sessions.length - visible.length

  return (
    <Droppable droppableId={iso}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          onDoubleClick={() => onAddSession?.(iso)}
          className={cn(
            'flex min-h-0 flex-col gap-1 overflow-hidden rounded-[10px] border p-2 transition-colors',
            inMonth
              ? 'border-transparent bg-surface-card'
              : 'border-transparent bg-transparent opacity-45',
            isToday && 'border-run bg-[color-mix(in_oklab,var(--bf-run)_6%,var(--bf-bg-card))]',
            snapshot.isDraggingOver && 'border-dashed border-border-strong bg-surface-hover'
          )}
        >
          <div className="mb-0.5 flex items-center justify-between">
            <span
              className={cn(
                'mono text-[12px] font-semibold',
                isToday
                  ? 'rounded-[5px] bg-run px-1.5 py-0.5 font-extrabold text-black'
                  : 'text-text-secondary'
              )}
            >
              {date.getDate()}
            </span>
            {isToday && (
              <span className="text-[8.5px] font-extrabold tracking-[0.1em] text-run">TODAY</span>
            )}
          </div>

          <div className="flex min-h-0 flex-col gap-[3px] overflow-hidden">
            {visible.map((s, i) => (
              <Draggable key={s.id} draggableId={s.id} index={i}>
                {(dp, ds) => (
                  <DragPortal active={ds.isDragging}>
                    <SessionChip
                      session={s}
                      provided={dp}
                      dragging={ds.isDragging}
                      onOpen={() => onOpenSession?.(s.id)}
                    />
                  </DragPortal>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {extra > 0 && (
              <div className="pl-1.5 text-[10px] font-medium text-text-tertiary">+{extra} more</div>
            )}
          </div>
        </div>
      )}
    </Droppable>
  )
}

interface SessionChipProps {
  session: Session
  provided: DraggableProvided
  dragging: boolean
  onOpen?: () => void
}

function SessionChip({ session, provided, dragging, onOpen }: SessionChipProps): ReactNode {
  const t = SESSION_TYPES[session.type]
  const past = parseISO(session.date) < TODAY
  const done = past && session.actual != null
  const missed = past && !done

  return (
    <button
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={(e) => {
        e.stopPropagation()
        onOpen?.()
      }}
      title={sessionLabel(session)}
      className={cn(
        'flex h-chip min-h-chip shrink-0 cursor-grab items-stretch overflow-hidden rounded-[5px] bg-surface-raised text-left transition-[transform,background-color]',
        'hover:translate-x-px hover:bg-surface-hover active:cursor-grabbing',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        dragging && 'bg-surface-hover shadow-modal'
      )}
    >
      <span className="w-[3px] shrink-0" style={{ background: t.color }} aria-hidden="true" />
      <span className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden px-[7px]">
        <span
          className={cn(
            'truncate text-[11px] font-semibold leading-[1.1] text-text-primary',
            missed && 'opacity-55'
          )}
        >
          {sessionLabel(session)}
          {done && <span className="font-bold text-success"> ✓</span>}
          {missed && <span className="font-bold text-danger"> ×</span>}
        </span>
      </span>
    </button>
  )
}
