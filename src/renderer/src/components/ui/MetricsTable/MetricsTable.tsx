import type { ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export interface MetricTableRow {
  /** Optional leading metric glyph. */
  icon?: IconName
  label: string
  /** Formatted actual value, e.g. "10.2 km". Shown as "—" when no actual. */
  actual: ReactNode
  /** Formatted planned value, e.g. "10.0 km". */
  planned: ReactNode
  /** Actual − planned. `false`/`null` = nothing to diff. */
  delta?: number | false | null
  deltaUnit?: string
  precision?: number
  /** Which direction counts as an improvement. */
  positive?: 'up' | 'down'
}

export interface MetricsTableProps {
  rows: MetricTableRow[]
  /** Whether an actual is recorded — drives the Actual + Diff columns. */
  hasActual: boolean
  className?: string
}

const diffStateClasses: Record<'neutral' | 'good' | 'bad', string> = {
  neutral: 'text-text-tertiary',
  good: 'text-success',
  bad: 'text-danger'
}

function diffFor(
  row: MetricTableRow,
  hasActual: boolean
): { text: string; state: 'neutral' | 'good' | 'bad' } | null {
  if (!hasActual || row.delta == null || row.delta === false) return null
  const rounded = Number(row.delta.toFixed(row.precision ?? 0))
  if (rounded === 0) return { text: 'on plan', state: 'neutral' }
  const good = row.positive === 'up' ? rounded > 0 : rounded < 0
  return {
    text: `${rounded > 0 ? '+' : ''}${rounded}${row.deltaUnit ? ` ${row.deltaUnit}` : ''}`,
    state: good ? 'good' : 'bad'
  }
}

/**
 * MetricsTable — actual / planned / diff rows for a session (design's
 * `.bf-mtable`). Clearer than a grid of `MetricCard`s when several metrics are
 * compared against plan at once. Diff direction/coloring mirrors `MetricCard`
 * (`positive` sets which way is an improvement); before an actual exists the
 * Actual column shows "—" and Diff is blank.
 */
export function MetricsTable({ rows, hasActual, className }: MetricsTableProps): ReactNode {
  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-x-6 border-b border-border-subtle pb-1.5 text-2xs font-semibold uppercase tracking-wide text-text-tertiary">
        <span />
        <span className="text-right">Actual</span>
        <span className="text-right">Planned</span>
        <span className="text-right">Diff</span>
      </div>
      {rows.map((row, i) => {
        const diff = diffFor(row, hasActual)
        return (
          <div
            key={i}
            className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-x-6 border-b border-border-subtle py-2 last:border-b-0"
          >
            <span className="flex items-center gap-2 text-base font-medium text-text-primary">
              {row.icon && <Icon name={row.icon} className="shrink-0 text-md text-text-tertiary" />}
              {row.label}
            </span>
            <span className="mono text-right text-base text-text-primary">
              {hasActual ? row.actual : <span className="text-text-muted">—</span>}
            </span>
            <span className="mono text-right text-base text-text-secondary">{row.planned}</span>
            <span
              className={cn(
                'mono text-right text-base',
                diff ? diffStateClasses[diff.state] : 'text-text-muted'
              )}
            >
              {diff?.text ?? ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}
