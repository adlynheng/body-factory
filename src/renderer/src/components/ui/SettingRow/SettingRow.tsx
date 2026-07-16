import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

export interface SettingRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  label: ReactNode
  /** Secondary explanatory line under the label. */
  description?: ReactNode
  /** The control (Switch, SegControl, NumberField, Button…). */
  children: ReactNode
}

/**
 * SettingRow — a labeled row with the control on the right (design's
 * `.bf-set-row`). Text block (label + optional description) grows; the control
 * stays its natural width. Stack several inside a `Card` — a top border on all
 * but the first gives the divided-list look, so wrap them in a
 * `divide-y divide-border-subtle` container or rely on the row's own border.
 */
export function SettingRow({
  label,
  description,
  children,
  className,
  ...props
}: SettingRowProps): ReactNode {
  return (
    <div
      className={cn('flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-base font-medium text-text-primary">{label}</span>
        {description && <span className="text-sm text-text-tertiary">{description}</span>}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  )
}
