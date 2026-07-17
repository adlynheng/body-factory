import { useState, type ReactNode } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { Button } from '@renderer/components/ui/Button'
import { DatePicker } from '@renderer/components/ui/DatePicker'
import { NumberField } from '@renderer/components/ui/NumberField'
import { type SessionTypeKey, TODAY } from '@renderer/features/sessions'
import { addDays, isoDate, parseISO } from '@renderer/lib/date'
import { cn } from '@renderer/lib/utils'
import { AddTemplateEntryModal } from './AddTemplateEntryModal'
import { TemplateColumn } from './TemplateColumn'
import type { TemplateEntry } from './types'

type EndMode = 'weeks' | 'date' | 'forever'

export interface TemplateProps {
  template: TemplateEntry[]
  onAddEntry: (dayIdx: number, type: SessionTypeKey, subtype: string) => void
  onRemoveEntry: (id: string) => void
  /** Move an entry to a different day-of-week (drag & drop). */
  onMoveEntry: (id: string, dayIdx: number) => void
  /** Apply the template across [startISO, endISO], replacing planned sessions. */
  onApply: (template: TemplateEntry[], startISO: string, endISO: string) => void
}

/**
 * Template — the Weekly Template editor (design's `TemplateView`): a 7-column
 * Mon→Sun grid of recurring entries you drag between days, plus an apply-forward
 * panel that writes the pattern onto the calendar. One `@hello-pangea/dnd`
 * `DragDropContext` spans the week. Pure over `template`; mutations bubble up.
 */
export function Template({
  template,
  onAddEntry,
  onRemoveEntry,
  onMoveEntry,
  onApply
}: TemplateProps): ReactNode {
  const [addingDay, setAddingDay] = useState<number | null>(null)
  const [startDate, setStartDate] = useState(() => isoDate(TODAY))
  const [endMode, setEndMode] = useState<EndMode>('weeks')
  const [weeksCount, setWeeksCount] = useState(8)
  const [untilDate, setUntilDate] = useState(() => isoDate(addDays(TODAY, 8 * 7)))

  const total = template.length

  const computeEnd = (): string => {
    const start = parseISO(startDate)
    if (endMode === 'date') return untilDate
    if (endMode === 'forever') return isoDate(addDays(start, 52 * 7))
    return isoDate(addDays(start, Math.max(1, weeksCount) * 7))
  }

  const handleDragEnd = (result: DropResult): void => {
    const { draggableId, source, destination } = result
    if (!destination || destination.droppableId === source.droppableId) return
    onMoveEntry(draggableId, Number(destination.droppableId))
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border-subtle px-[22px] pb-[14px] pt-[18px]">
        <div className="flex flex-col">
          <span className="text-[22px] font-extrabold leading-[1.05] tracking-[-0.03em] text-text-primary">
            Weekly Template
          </span>
          <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
            {total} session{total === 1 ? '' : 's'} / week
          </span>
        </div>
      </div>

      {/* Page */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-[22px] pb-[18px] pt-4">
        <div className="mb-3 flex max-w-[900px] flex-col gap-[3px]">
          <span className="text-[15px] font-bold tracking-[-0.01em] text-text-primary">
            Build the week you repeat
          </span>
          <span className="text-[11px] font-medium text-text-muted">
            Drag entries between days, then apply it forward. Existing planned sessions in range are
            replaced; completed sessions are never touched.
          </span>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid min-h-0 flex-1 grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, dayIdx) => (
              <TemplateColumn
                key={dayIdx}
                dayIdx={dayIdx}
                entries={template.filter((e) => e.day === dayIdx)}
                onRemove={onRemoveEntry}
                onAddClick={setAddingDay}
              />
            ))}
          </div>
        </DragDropContext>

        {/* Apply forward */}
        <div className="mt-3.5 flex shrink-0 flex-col gap-3 border-t border-border-subtle pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="min-w-[90px] text-[11px] font-bold uppercase tracking-[0.06em] text-text-tertiary">
              Starting
            </span>
            <DatePicker
              aria-label="Start date"
              value={parseISO(startDate)}
              onChange={(d) => d && setStartDate(isoDate(d))}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="min-w-[90px] text-[11px] font-bold uppercase tracking-[0.06em] text-text-tertiary">
              Repeat until
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Weeks pill holds a number input, so it's a div (not a button —
                  no interactive-in-interactive nesting); clicking selects it. */}
              <div
                onClick={() => setEndMode('weeks')}
                className={cn(pillBase, 'cursor-pointer', endMode === 'weeks' ? pillOn : pillOff)}
              >
                <NumberField
                  aria-label="Number of weeks"
                  hideStepper
                  min={1}
                  max={52}
                  value={weeksCount}
                  onValueChange={(v) => {
                    setWeeksCount(v ?? 1)
                    setEndMode('weeks')
                  }}
                  className="h-6"
                  inputClassName="w-8 text-[12px]"
                />
                weeks
              </div>
              <EndPill on={endMode === 'date'} onClick={() => setEndMode('date')}>
                Until date
              </EndPill>
              {endMode === 'date' && (
                <DatePicker
                  aria-label="Until date"
                  align="end"
                  value={parseISO(untilDate)}
                  onChange={(d) => d && setUntilDate(isoDate(d))}
                />
              )}
              <EndPill on={endMode === 'forever'} onClick={() => setEndMode('forever')}>
                No end date
              </EndPill>
            </div>
          </div>

          <p className="text-[11px] leading-[1.4] text-text-tertiary">
            Applies from {startDate} through {computeEnd()}
            {endMode === 'forever' ? ' (~1 year out — reopen anytime to extend).' : '.'}
          </p>

          <Button
            variant="solid"
            disabled={total === 0}
            onClick={() => onApply(template, startDate, computeEnd())}
            className="h-9 self-end rounded-[9px] px-[18px] text-[13px] font-extrabold"
          >
            Apply to Calendar
          </Button>
        </div>
      </div>

      <AddTemplateEntryModal
        dayIdx={addingDay}
        onOpenChange={(o) => !o && setAddingDay(null)}
        onCreate={(day, type, subtype) => {
          onAddEntry(day, type, subtype)
          setAddingDay(null)
        }}
      />
    </div>
  )
}

// Pill styling (design's `.bf-tmpl-end-opt`), shared by the toggle buttons and
// the weeks div (which can't be a button — it wraps a number input).
const pillBase =
  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors'
const pillOn = 'border-text-primary bg-text-primary text-surface'
const pillOff = 'border-border-subtle bg-surface-raised text-text-secondary hover:text-text-primary'

/** A pill toggle in the "Repeat until" row (design's `.bf-tmpl-end-opt`). */
function EndPill({
  on,
  onClick,
  children
}: {
  on: boolean
  onClick: () => void
  children: ReactNode
}): ReactNode {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        pillBase,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        on ? pillOn : pillOff
      )}
    >
      {children}
    </button>
  )
}
