import { ToggleGroup } from 'radix-ui'
import type { ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

export interface SegOption {
  value: string
  label: ReactNode
}

export interface SegControlProps {
  value: string
  onValueChange: (value: string) => void
  options: SegOption[]
  className?: string
  'aria-label'?: string
}

/**
 * Segmented control — Radix `ToggleGroup` (single) for roving-focus keyboard
 * behavior and ARIA, our tokens for the inverted-pill look from the design.
 * A segmented control must always keep a selection, so empty change events
 * (Radix emits `''` when re-clicking the active item) are ignored.
 */
export function SegControl({
  value,
  onValueChange,
  options,
  className,
  'aria-label': ariaLabel
}: SegControlProps): ReactNode {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => v && onValueChange(v)}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex rounded-md border border-border-subtle bg-surface-raised p-0.5',
        className
      )}
    >
      {options.map((o) => (
        <ToggleGroup.Item
          key={o.value}
          value={o.value}
          className={cn(
            'cursor-pointer rounded-sm px-[13px] py-1.5 text-sm font-semibold whitespace-nowrap text-text-secondary transition-colors',
            'hover:text-text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
            'data-[state=on]:bg-text-primary data-[state=on]:text-surface'
          )}
        >
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
