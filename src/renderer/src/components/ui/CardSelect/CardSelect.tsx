import { Toggle } from '@base-ui-components/react/toggle'
import { ToggleGroup } from '@base-ui-components/react/toggle-group'
import type { CSSProperties, ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export interface CardOption {
  value: string
  label: ReactNode
  /** Accent color for the card's bar + selected ring (e.g. the session type's color). */
  color?: string
  icon?: IconName
}

export interface CardSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: CardOption[]
  /** Fixed column count; omit to auto-fill by min card width. */
  columns?: number
  className?: string
  'aria-label'?: string
}

/**
 * CardSelect — a single-select grid of cards (design's New-Session / template
 * type picker, `.bf-type-card`). Each card shows an accent bar (from the
 * option's `color`) and a label; the selected card rings + tints in that color.
 * Base UI `ToggleGroup` (single) supplies roving-focus + ARIA. Distinct from
 * `ChipSelect` (a wrapping row of pills) — reach for this when options are
 * peers laid out as a grid of cards rather than inline chips.
 */
export function CardSelect({
  value,
  onValueChange,
  options,
  columns,
  className,
  'aria-label': ariaLabel
}: CardSelectProps): ReactNode {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(next) => {
        const picked = next[0]
        if (picked) onValueChange(picked as string)
      }}
      aria-label={ariaLabel}
      className={cn('grid gap-2', className)}
      style={{
        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0, 1fr))`
          : 'repeat(auto-fill, minmax(120px, 1fr))'
      }}
    >
      {options.map((o) => (
        <Toggle
          key={o.value}
          value={o.value}
          style={o.color ? ({ '--accent': o.color } as CSSProperties) : undefined}
          className={cn(
            'group flex cursor-pointer flex-col gap-2 rounded-lg border border-border-subtle bg-surface-raised p-3 text-left transition-colors',
            'hover:bg-surface-hover',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
            'data-pressed:border-accent data-pressed:bg-accent/10'
          )}
        >
          <span
            className="h-1 w-6 rounded-full bg-accent transition-opacity opacity-60 group-data-pressed:opacity-100"
            style={o.color ? { background: o.color } : undefined}
          />
          <span className="flex items-center gap-1.5 text-base font-semibold text-text-primary">
            {o.icon && <Icon name={o.icon} className="text-md text-text-secondary" />}
            {o.label}
          </span>
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
