import type { ReactNode } from 'react'
import { Icon } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export interface CompareDeltaProps {
  label: string
  prev: number
  cur: number
  precision?: number
  /** Which direction counts as an improvement. */
  positive: 'up' | 'down'
  /** Custom value formatter (defaults to `toFixed(precision)`). */
  format?: (value: number) => string
  className?: string
}

/**
 * CompareDelta — a compact "previous → current" stat card with a percentage
 * change chip (design's `.bf-cmp-delta`). Used for single-metric comparisons
 * (e.g. misc / gym duration). Arrange several in a grid; the card owns no outer
 * spacing.
 */
export function CompareDelta({
  label,
  prev,
  cur,
  precision = 0,
  positive,
  format,
  className
}: CompareDeltaProps): ReactNode {
  const delta = cur - prev
  const pct = prev !== 0 ? (delta / prev) * 100 : 0
  const good = positive === 'up' ? delta >= 0 : delta <= 0
  const f = format ?? ((v: number) => v.toFixed(precision))

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-3',
        className
      )}
    >
      <div className="text-2xs font-bold uppercase tracking-wide text-text-tertiary">{label}</div>
      <div className="flex items-center gap-1.5 text-base">
        <span className="mono text-text-tertiary">{f(prev)}</span>
        <Icon name="arrowRight" className="text-xs text-text-muted" />
        <span className="mono font-bold text-text-primary">{f(cur)}</span>
      </div>
      <span
        className={cn(
          'mono flex items-center gap-1 self-start rounded-xs px-1.5 py-0.5 text-xs font-bold',
          good ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
        )}
      >
        <Icon name={good ? 'arrowUp' : 'arrowDown'} />
        {Math.abs(pct).toFixed(1)}%
      </span>
    </div>
  )
}
