import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

export const spinnerVariants = cva('shrink-0 animate-spin motion-reduce:animate-none', {
  variants: {
    size: {
      sm: 'size-3.5 border-[1.5px]',
      md: 'size-4 border-2',
      lg: 'size-5 border-2'
    },
    tone: {
      // Inherit the surrounding text color (default — works on any button/label).
      current: 'border-current border-t-transparent',
      accent: 'border-accent/30 border-t-accent',
      muted: 'border-border-strong border-t-text-secondary'
    }
  },
  defaultVariants: { size: 'md', tone: 'current' }
})

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, VariantProps<typeof spinnerVariants> {
  /** Accessible label; announced to assistive tech. Defaults to "Loading". */
  label?: string
}

/**
 * Spinner — a spinning ring for loading / syncing states (design's
 * `.bf-set-sync-spinner` on the Sync-Now button). Pure CSS border trick, no
 * dependency. `tone="current"` inherits the ambient text color so it sits
 * cleanly inside a `Button`; respects `prefers-reduced-motion` (stops spinning).
 */
export function Spinner({
  className,
  size,
  tone,
  label = 'Loading',
  ...props
}: SpinnerProps): ReactNode {
  return (
    <span role="status" aria-label={label} className="inline-flex" {...props}>
      <span className={cn('rounded-full', spinnerVariants({ size, tone }), className)} />
    </span>
  )
}
