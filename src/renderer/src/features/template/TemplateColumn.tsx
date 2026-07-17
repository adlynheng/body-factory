import type { ReactNode } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { DAY_NAMES_LONG } from '@renderer/lib/date'
import { cn } from '@renderer/lib/utils'
import { TemplateEntryCard } from './TemplateEntryCard'
import type { TemplateEntry } from './types'

export interface TemplateColumnProps {
  dayIdx: number
  entries: TemplateEntry[]
  onRemove: (id: string) => void
  onAddClick: (dayIdx: number) => void
}

/**
 * TemplateColumn — one Mon→Sun day column in the template editor (design's
 * `.bf-tmpl-col`). A `@hello-pangea/dnd` `Droppable`: entries can be dragged in
 * from any other day. Double-click or the "+ Add" button opens the entry modal.
 */
export function TemplateColumn({
  dayIdx,
  entries,
  onRemove,
  onAddClick
}: TemplateColumnProps): ReactNode {
  return (
    <Droppable droppableId={String(dayIdx)}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          onDoubleClick={() => onAddClick(dayIdx)}
          className={cn(
            'flex min-h-0 flex-col gap-1.5 overflow-y-auto rounded-[10px] border p-2 transition-colors',
            snapshot.isDraggingOver
              ? 'border-dashed border-border-strong bg-surface-hover'
              : 'border-border-subtle bg-surface-raised'
          )}
        >
          <div className="px-1 pb-1 pt-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-text-tertiary">
            {DAY_NAMES_LONG[dayIdx].slice(0, 3)}
          </div>
          {entries.map((e, i) => (
            <Draggable key={e.id} draggableId={e.id} index={i}>
              {(dp, ds) => (
                <TemplateEntryCard
                  entry={e}
                  provided={dp}
                  dragging={ds.isDragging}
                  onRemove={onRemove}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          <button
            type="button"
            onClick={() => onAddClick(dayIdx)}
            className="rounded-[7px] border border-dashed border-border-strong p-[7px] text-[11px] font-semibold text-text-tertiary transition-colors hover:border-text-tertiary hover:text-text-primary"
          >
            + Add
          </button>
        </div>
      )}
    </Droppable>
  )
}
