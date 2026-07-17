/* eslint-disable react-hooks/refs -- @hello-pangea/dnd's render props hand back
   `innerRef` + `draggableProps`/`dragHandleProps` that MUST be spread onto the
   element during render; that is the library's contract, not a ref read. */
import { useMemo, type ReactNode } from 'react'
import { Draggable, Droppable, type DraggableProvided } from '@hello-pangea/dnd'
import { SESSION_TYPES, sessionLabel, TODAY, type Session } from '@renderer/features/sessions'
import { DAY_NAMES, isoDate, parseISO, sameDay, weekDays, weekNum } from '@renderer/lib/date'
import { fmtDistance, fmtPace } from '@renderer/lib/format'
import { cn } from '@renderer/lib/utils'
import { DragPortal } from './DragPortal'

export interface WeekGridProps {
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
 * WeekGrid — the calendar's week view (design's `.bf-week`): a vertical
 * week-number rail plus seven day columns. Empty days show a dashed "REST"
 * add-target; days with sessions list detailed, draggable cards.
 */
export function WeekGrid({
  sessions,
  anchor,
  onOpenSession,
  onAddSession
}: WeekGridProps): ReactNode {
  const days = useMemo(() => weekDays(anchor), [anchor])
  const byDate = useMemo(() => groupByDate(sessions), [sessions])

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[34px_1fr] gap-1.5 overflow-hidden px-[22px] pb-[22px] pt-[18px]">
      <div className="mono flex items-center justify-center rounded-[10px] border border-border-subtle bg-surface-card text-[11px] font-bold text-text-tertiary [text-orientation:mixed] [writing-mode:vertical-rl]">
        WK {weekNum(days[0])}
      </div>
      <div className="grid min-h-0 grid-cols-7 gap-1.5 overflow-hidden">
        {days.map((d) => (
          <WeekColumn
            key={isoDate(d)}
            date={d}
            sessions={byDate[isoDate(d)] ?? []}
            onOpenSession={onOpenSession}
            onAddSession={onAddSession}
          />
        ))}
      </div>
    </div>
  )
}

interface WeekColumnProps {
  date: Date
  sessions: Session[]
  onOpenSession?: (id: string) => void
  onAddSession?: (date: string) => void
}

function WeekColumn({ date, sessions, onOpenSession, onAddSession }: WeekColumnProps): ReactNode {
  const iso = isoDate(date)
  const isToday = sameDay(date, TODAY)

  return (
    <Droppable droppableId={iso}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            'flex min-h-0 flex-col gap-2 overflow-hidden rounded-[10px] border p-2.5 transition-colors',
            isToday
              ? 'border-run bg-[color-mix(in_oklab,var(--bf-run)_6%,var(--bf-bg-card))]'
              : 'border-border-subtle bg-surface-card',
            snapshot.isDraggingOver && 'border-dashed bg-surface-hover'
          )}
        >
          <div className="flex items-baseline justify-between border-b border-border-subtle pb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-tertiary">
              {DAY_NAMES[(date.getDay() + 6) % 7]}
            </span>
            <span
              className={cn(
                'mono text-[22px] font-extrabold tracking-[-0.04em]',
                isToday ? 'text-run' : 'text-text-primary'
              )}
            >
              {date.getDate()}
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
            {sessions.length === 0 ? (
              <button
                type="button"
                onClick={() => onAddSession?.(iso)}
                className="flex min-h-[80px] flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong bg-transparent text-[11px] font-bold uppercase tracking-[0.12em] text-text-tertiary transition-colors hover:border-run hover:text-run"
              >
                <span>REST</span>
                <span className="text-[18px] font-normal tracking-normal">+</span>
              </button>
            ) : (
              sessions.map((s, i) => (
                <Draggable key={s.id} draggableId={s.id} index={i}>
                  {(dp, ds) => (
                    <DragPortal active={ds.isDragging}>
                      <WeekCard
                        session={s}
                        provided={dp}
                        dragging={ds.isDragging}
                        onOpen={() => onOpenSession?.(s.id)}
                      />
                    </DragPortal>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
            {sessions.length > 0 && (
              <button
                type="button"
                onClick={() => onAddSession?.(iso)}
                className="rounded-md p-1.5 text-center text-[10.5px] font-semibold text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-secondary"
              >
                + Add
              </button>
            )}
          </div>
        </div>
      )}
    </Droppable>
  )
}

interface WeekCardProps {
  session: Session
  provided: DraggableProvided
  dragging: boolean
  onOpen?: () => void
}

function WeekCard({ session, provided, dragging, onOpen }: WeekCardProps): ReactNode {
  const t = SESSION_TYPES[session.type]
  const past = parseISO(session.date) < TODAY
  const done = past && session.actual != null
  const a = session.actual
  const p = session.planned

  return (
    <button
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={onOpen}
      className={cn(
        'flex shrink-0 cursor-grab overflow-hidden rounded-lg bg-surface-raised text-left transition-transform',
        'hover:-translate-y-px active:cursor-grabbing',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        dragging && 'shadow-modal'
      )}
    >
      <span className="w-1 shrink-0" style={{ background: t.color }} aria-hidden="true" />
      <span className="min-w-0 flex-1 px-2.5 pb-[9px] pt-2">
        <span className="mb-1 flex items-center justify-between">
          <span
            className="text-[9px] font-extrabold uppercase tracking-[0.12em]"
            style={{ color: t.color }}
          >
            {t.label}
          </span>
          {done && <span className="text-[11px] font-extrabold text-success">✓</span>}
        </span>
        <span className="mb-1 block truncate text-[14px] font-bold leading-[1.15] tracking-[-0.01em] text-text-primary">
          {sessionLabel(session)}
        </span>
        {session.type === 'run' && (
          <span className="mono flex items-center gap-1 text-[11px] text-text-tertiary">
            <span>{fmtDistance(a?.distance ?? p.distance ?? 0)}</span>
            <span>·</span>
            <span>{fmtPace(a?.pace ?? p.pace ?? 0)}/km</span>
          </span>
        )}
        {(session.type === 'gym' || session.type === 'misc') && (
          <span className="mono flex items-center gap-1 text-[11px] text-text-tertiary">
            <span>{a?.duration ?? p.duration} min</span>
          </span>
        )}
        {session.type === 'floorball' && (
          <span className="flex items-center gap-1 text-[11px] text-text-tertiary">
            <span className="opacity-60">{session.subtype === 'Match' ? '60 min' : '90 min'}</span>
          </span>
        )}
      </span>
    </button>
  )
}
