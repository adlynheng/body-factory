import type { ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export interface CompareBarRow {
  label: string
  icon?: IconName
  prevValue: number
  curValue: number
  /** Preformatted value strings shown at each bar's end (e.g. "10.2 km"). */
  prevLabel: string
  curLabel: string
  /** Signed change (current − previous), in the metric's own units. */
  delta: number
  deltaUnit?: string
  precision: number
  /** Which direction counts as an improvement. */
  positive: 'up' | 'down'
}

export interface CompareBarsProps {
  rows: CompareBarRow[]
  prevDateLabel: string
  curDateLabel: string
  className?: string
}

/**
 * CompareBars — paired previous-vs-current bars per metric with an improvement
 * pill (design's `.bf-cmp2`). Bars are scaled to the larger of the two values;
 * the current bar is tinted good/bad by whether the change is an improvement.
 * A visual alternative to the line Trendline, for one-to-one comparisons.
 */
export function CompareBars({
  rows,
  prevDateLabel,
  curDateLabel,
  className
}: CompareBarsProps): ReactNode {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="mb-1.5 flex flex-wrap gap-x-[18px] gap-y-1 border-b border-dashed border-border-subtle pb-3">
        <LegendItem dotClass="bg-border-strong" label="Previous" date={prevDateLabel} />
        <LegendItem dotClass="bg-text-secondary" label="This session" date={curDateLabel} />
      </div>
      {rows.map((row, i) => (
        <CompareRow key={i} {...row} />
      ))}
    </div>
  )
}

function LegendItem({
  dotClass,
  label,
  date
}: {
  dotClass: string
  label: string
  date: string
}): ReactNode {
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-text-tertiary">
      <span className={cn('size-2 rounded-[2px]', dotClass)} />
      {label} · <span className="mono">{date}</span>
    </span>
  )
}

function CompareRow({
  label,
  icon,
  prevValue,
  curValue,
  prevLabel,
  curLabel,
  delta,
  deltaUnit,
  precision,
  positive
}: CompareBarRow): ReactNode {
  const rounded = Number(delta.toFixed(precision))
  const good = positive === 'up' ? rounded >= 0 : rounded <= 0
  const state = rounded === 0 ? 'neutral' : good ? 'good' : 'bad'
  const max = Math.max(prevValue, curValue, 0.0001)
  const prevPct = Math.max((prevValue / max) * 100, 3)
  const curPct = Math.max((curValue / max) * 100, 3)

  const pillClass =
    state === 'good'
      ? 'bg-success/[0.12] text-success'
      : state === 'bad'
        ? 'bg-danger/[0.12] text-danger'
        : 'bg-surface-raised text-text-tertiary'
  const curBarClass =
    state === 'good' ? 'bg-success' : state === 'bad' ? 'bg-danger' : 'bg-text-secondary'

  return (
    <div className="border-t border-border-subtle py-3 first:border-t-0">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-[13.5px] font-semibold text-text-secondary">
          {icon && <Icon name={icon} className="text-base text-text-tertiary" />}
          {label}
        </div>
        <span
          className={cn(
            'mono flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-bold',
            pillClass
          )}
        >
          {state !== 'neutral' && <Icon name={good ? 'arrowUp' : 'arrowDown'} />}
          {state === 'neutral' ? 'even' : `${Math.abs(rounded)}${deltaUnit ? ` ${deltaUnit}` : ''}`}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <BarLine barClass="bg-border-strong" pct={prevPct} value={prevLabel} emphasized={false} />
        <BarLine barClass={curBarClass} pct={curPct} value={curLabel} emphasized />
      </div>
    </div>
  )
}

function BarLine({
  barClass,
  pct,
  value,
  emphasized
}: {
  barClass: string
  pct: number
  value: string
  emphasized: boolean
}): ReactNode {
  return (
    <div className="flex items-center gap-3">
      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-raised">
        <span
          className={cn('block h-full rounded-full transition-[width] duration-500', barClass)}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span
        className={cn(
          'mono w-[82px] shrink-0 text-right',
          emphasized
            ? 'text-[15px] font-extrabold tracking-tight text-text-primary'
            : 'text-base text-text-tertiary'
        )}
      >
        {value}
      </span>
    </div>
  )
}
