import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

export interface SyncBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

/**
 * SyncBadge — a "synced from …" source label with a live pulsing dot (design's
 * `.bf-card-source` + `.bf-health-pulse`, used in the Metrics card header when
 * actual data is present). The pulse is disabled under reduced-motion. Defaults
 * to the Apple Health copy; pass children to change it.
 */
export function SyncBadge({ className, children, ...props }: SyncBadgeProps): ReactNode {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs text-text-tertiary', className)}
      {...props}
    >
      <span
        aria-hidden
        className="size-[7px] shrink-0 animate-[bf-pulse_2s_infinite] rounded-full bg-success motion-reduce:animate-none"
      />
      {children ?? 'Synced from Apple Health'}
    </span>
  )
}
