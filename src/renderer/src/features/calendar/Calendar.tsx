import { useState, type ReactNode } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { TODAY, type Session } from '@renderer/features/sessions'
import { CalendarHeader } from './CalendarHeader'
import { MonthGrid } from './MonthGrid'
import { WeekGrid } from './WeekGrid'

export type CalendarView = 'month' | 'week'

export interface CalendarProps {
  sessions: Session[]
  /** Reschedule a session to a new ISO date (drag & drop). */
  onMoveSession?: (id: string, date: string) => void
  onOpenSession?: (id: string) => void
  onAddSession?: (date: string) => void
  defaultView?: CalendarView
}

/**
 * Calendar — the month/week planning view (design's `CalendarView`). Owns the
 * period anchor and month/week toggle; a single `@hello-pangea/dnd`
 * `DragDropContext` spans whichever grid is active so a session can be dragged
 * from any day onto another. Pure over the `sessions` prop — mutations bubble
 * up via callbacks.
 */
export function Calendar({
  sessions,
  onMoveSession,
  onOpenSession,
  onAddSession,
  defaultView = 'month'
}: CalendarProps): ReactNode {
  const [view, setView] = useState<CalendarView>(defaultView)
  const [anchor, setAnchor] = useState<Date>(() => new Date(TODAY))

  const handleDragEnd = (result: DropResult): void => {
    const { draggableId, source, destination } = result
    if (!destination || destination.droppableId === source.droppableId) return
    onMoveSession?.(draggableId, destination.droppableId)
  }

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        anchor={anchor}
        setAnchor={setAnchor}
        view={view}
        setView={setView}
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
