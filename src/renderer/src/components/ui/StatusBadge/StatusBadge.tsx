import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

export const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-2xs font-extrabold uppercase tracking-wider whitespace-nowrap',
  {
    variants: {
      status: {
        completed: 'bg-success/[0.12] text-success',
        done: 'bg-success/[0.12] text-success',
        today: 'bg-accent/15 text-accent',
        planned: 'border border-border-subtle bg-surface-card text-text-tertiary',
        missed: 'bg-danger/[0.12] text-danger'
      }
    },
    defaultVariants: { status: 'planned' }
  }
)

type Status = NonNullable<VariantProps<typeof statusBadgeVariants>['status']>

const DEFAULT_LABEL: Record<Status, string> = {
  completed: 'Completed',
  done: 'Done',
  today: 'Today',
  planned: 'Planned',
  missed: 'Missed'
}

export interface StatusBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof statusBadgeVariants> {
  children?: ReactNode
}

/**
 * StatusBadge — the uppercase status pill on the session detail hero and
 * session rows (design's `.bf-status`). `status` picks the tone and a default
 * label; pass `children` to override the text (e.g. a localized string).
 */
export function StatusBadge({ className, status, children, ...props }: StatusBadgeProps): ReactNode {
  const s: Status = status ?? 'planned'
  return (
    <span className={cn(statusBadgeVariants({ status: s }), className)} {...props}>
      {children ?? DEFAULT_LABEL[s]}
    </span>
  )
}
