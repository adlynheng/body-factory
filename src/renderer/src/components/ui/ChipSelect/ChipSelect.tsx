import { Toggle } from '@base-ui-components/react/toggle'
import { ToggleGroup } from '@base-ui-components/react/toggle-group'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

export interface ChipOption {
  value: string
  label: ReactNode
}

export interface ChipSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: ChipOption[]
  /** Accent for the selected chip (e.g. the session type's color). */
  accent?: string
  className?: string
  'aria-label'?: string
}

/**
 * ChipSelect — a wrapping row of single-select pills (design's subtype picker,
 * `.bf-subtype`). Base UI `ToggleGroup` (single) gives roving-focus + ARIA; the
 * selected pill fills with the ambient `--accent` (override per group via the
 * `accent` prop). Distinct from `SegControl`, which is a single-row inverted
 * pill for 2–3 options.
 */
export function ChipSelect({
  value,
  onValueChange,
  options,
  accent,
  className,
  'aria-label': ariaLabel
}: ChipSelectProps): ReactNode {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(next) => {
        const picked = next[0]
        if (picked) onValueChange(picked as string)
      }}
      aria-label={ariaLabel}
      className={cn('flex flex-wrap gap-1.5', className)}
      style={accent ? ({ '--accent': accent } as CSSProperties) : undefined}
    >
      {options.map((o) => (
        <Toggle
          key={o.value}
          value={o.value}
          className={cn(
            'cursor-pointer rounded-full border border-border-subtle bg-surface-raised px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-text-secondary transition-colors',
            'hover:bg-surface-hover hover:text-text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
            'data-pressed:border-accent data-pressed:bg-accent data-pressed:text-[#0a0a0a]'
          )}
        >
          {o.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
