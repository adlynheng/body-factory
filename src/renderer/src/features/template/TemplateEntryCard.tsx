/* eslint-disable react-hooks/refs -- @hello-pangea/dnd's render props hand back
   `innerRef` + `draggableProps`/`dragHandleProps` that MUST be spread onto the
   element during render; that is the library's contract, not a ref read. */
import type { ReactNode } from 'react'
import type { DraggableProvided } from '@hello-pangea/dnd'
import { SESSION_TYPES } from '@renderer/features/sessions'
import { cn } from '@renderer/lib/utils'
import type { TemplateEntry } from './types'

export interface TemplateEntryCardProps {
  entry: TemplateEntry
  provided: DraggableProvided
  dragging: boolean
  onRemove: (id: string) => void
}

/**
 * TemplateEntryCard — a draggable entry chip in a day column (design's
 * `.bf-tmpl-entry`): a type-colored bar, the subtype label with its type
 * beneath, and a remove ✕. The whole card is the drag handle.
 */
export function TemplateEntryCard({
  entry,
  provided,
  dragging,
  onRemove
}: TemplateEntryCardProps): ReactNode {
  const t = SESSION_TYPES[entry.type]
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={cn(
        'flex min-h-[34px] shrink-0 cursor-grab items-stretch overflow-hidden rounded-[5px] bg-surface-card transition-colors',
        'hover:bg-surface-hover active:cursor-grabbing',
        dragging && 'shadow-modal'
      )}
    >
      <span className="w-[3px] shrink-0" style={{ background: t.color }} aria-hidden="true" />
      <span className="flex min-w-0 flex-1 flex-col justify-center py-[5px] pl-[7px] pr-0.5">
        <span className="text-[11px] font-semibold leading-[1.2] text-text-primary [overflow-wrap:anywhere]">
          {entry.subtype}
        </span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.05em] text-text-tertiary">
          {t.label}
        </span>
      </span>
      <button
        type="button"
        onClick={() => onRemove(entry.id)}
        aria-label="Remove entry"
        className="shrink-0 self-start px-1.5 pb-0 pt-[5px] text-[10px] leading-none text-text-tertiary transition-colors hover:text-danger"
      >
        ✕
      </button>
    </div>
  )
}
