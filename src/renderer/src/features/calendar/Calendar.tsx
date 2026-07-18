import type { ReactNode } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import type { Session } from '@renderer/features/sessions'
import type { CalendarView } from '@renderer/lib/calendarParams'
import { CalendarHeader } from './CalendarHeader'
import { MonthGrid } from './MonthGrid'
import { WeekGrid } from './WeekGrid'

export type { CalendarView } from '@renderer/lib/calendarParams'

export interface CalendarProps {
  sessions: Session[]
  /** Active view — controlled by the route's `?view=` param. */
  view: CalendarView
  /** Period anchor — controlled by the route's `?month=`/`?week=` param. */
  anchor: Date
  onViewChange: (view: CalendarView) => void
  onAnchorChange: (anchor: Date) => void
  /** Reschedule a session to a new ISO date (drag & drop). */
  onMoveSession?: (id: string, date: string) => void
  onOpenSession?: (id: string) => void
  onAddSession?: (date: string) => void
}

/**
 * Calendar — the month/week planning view (design's `CalendarView`). View and
 * period anchor are controlled by the caller (the calendar route derives them
 * from the URL), so the calendar itself is pure over its props. A single
 * `@hello-pangea/dnd` `DragDropContext` spans whichever grid is active so a
 * session can be dragged from any day onto another; mutations bubble up.
 */
export function Calendar({
  sessions,
  view,
  anchor,
  onViewChange,
  onAnchorChange,
  onMoveSession,
  onOpenSession,
  onAddSession
}: CalendarProps): ReactNode {
  const handleDragEnd = (result: DropResult): void => {
    const { draggableId, source, destination } = result
    if (!destination || destination.droppableId === source.droppableId) return
    onMoveSession?.(draggableId, destination.droppableId)
  }

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        anchor={anchor}
        setAnchor={onAnchorChange}
        view={view}
        setView={onViewChange}
        onAddSession={onAddSession}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        {view === 'month' ? (
          <MonthGrid
            sessions={sessions}
            anchor={anchor}
            onOpenSession={onOpenSession}
            onAddSession={onAddSession}
          />
        ) : (
          <WeekGrid
            sessions={sessions}
            anchor={anchor}
            onOpenSession={onOpenSession}
            onAddSession={onAddSession}
          />
        )}
      </DragDropContext>
    </div>
  )
}
