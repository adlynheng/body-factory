import type { CSSProperties, ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export interface MetricCardProps {
  icon: IconName
  label: string
  value: string | number
  unit?: string
  /** Formatted planned value, e.g. "8.0 km" or "150 bpm". */
  planned: string
  /**
   * Actual − planned. `false`/`null` = no delta to show. Direction that counts
   * as an improvement is set by `positive`.
   */
  delta?: number | false | null
  deltaUnit?: string
  precision?: number
  positive?: 'up' | 'down'
  hasActual: boolean
}

const chipStateClasses: Record<'neutral' | 'good' | 'bad', string> = {
  neutral: 'text-text-muted',
  good: 'text-success bg-success/10',
  bad: 'text-danger bg-danger/10'
}

/**
 * MetricCard — one metric: icon badge, big mono value + unit, and a footer with
 * the planned value and a signed delta chip. The icon badge tints from the
 * ambient `--accent` (set by `MetricCardGrid` or any accent-scoped ancestor).
 */
export function MetricCard({
  icon,
  label,
  value,
  unit,
  planned,
  delta,
  deltaUnit,
  precision = 0,
  positive = 'up',
  hasActual
}: MetricCardProps): ReactNode {
  let deltaStr: string | null = null
  let state: 'neutral' | 'good' | 'bad' = 'neutral'
  if (hasActual && delta != null && delta !== false) {
    const rounded = Number(delta.toFixed(precision))
    if (rounded !== 0) {
      const good = positive === 'up' ? rounded > 0 : rounded < 0
      state = good ? 'good' : 'bad'
      deltaStr = `${rounded > 0 ? '+' : ''}${rounded}${deltaUnit ? ` ${deltaUnit}` : ''}`
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-card border border-border-subtle bg-surface-raised px-[18px] py-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold tracking-[0.08em] uppercase text-text-tertiary">
          {label}
        </span>
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[9px] bg-accent/16 text-[18px] text-accent">
          <Icon name={icon} />
        </span>
      </div>

      <div className="mono flex items-baseline gap-[5px]">
        <span className="text-3xl font-extrabold tracking-[-0.03em] text-text-primary">{value}</span>
        {unit && <span className="text-md font-semibold text-text-tertiary">{unit}</span>}
      </div>

      <div className="flex items-center gap-2 text-[11.5px]">
        {hasActual ? (
          <>
            <span className="text-text-tertiary">plan {planned}</span>
            <span
              className={cn('mono rounded-[5px] px-1.5 py-0.5 font-bold', chipStateClasses[state])}
            >
              {deltaStr || 'even'}
            </span>
          </>
        ) : (
          <span className="text-text-tertiary">planned</span>
        )}
      </div>
    </div>
  )
}

export interface MetricCardGridProps {
  /** Accent color (CSS color or var) scoped to the grid via `--accent`. */
  accent?: string
  children: ReactNode
  className?: string
}

/**
 * Two-column grid of MetricCards. Sets `--accent` so the cards' icon badges
 * pick up the session type's color.
 */
export function MetricCardGrid({ accent, children, className }: MetricCardGridProps): ReactNode {
  return (
    <div
      className={cn('grid grid-cols-2 gap-3', className)}
      style={accent ? ({ '--accent': accent } as CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
