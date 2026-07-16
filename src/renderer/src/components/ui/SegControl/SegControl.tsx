import { Toggle } from '@base-ui-components/react/toggle'
import { ToggleGroup } from '@base-ui-components/react/toggle-group'
import type { ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export type SegTone = 'default' | 'success' | 'danger' | 'accent'

export interface SegOption {
  value: string
  label: ReactNode
  /** Optional leading icon. */
  icon?: IconName
  /** Fill color when this option is selected. Omit for the inverted-pill default. */
  tone?: SegTone
}

export interface SegControlProps {
  value: string
  onValueChange: (value: string) => void
  options: SegOption[]
  className?: string
  'aria-label'?: string
}

/** Selected-state fill per tone — default is the inverted pill. */
const pressedByTone: Record<SegTone, string> = {
  default: 'data-pressed:bg-text-primary data-pressed:text-surface',
  success: 'data-pressed:bg-success data-pressed:text-black',
  danger: 'data-pressed:bg-danger data-pressed:text-white',
  accent: 'data-pressed:bg-accent data-pressed:text-black'
}

/**
 * Segmented control — Base UI `ToggleGroup` (single-select) for roving-focus
 * keyboard behavior and ARIA, our tokens for the inverted-pill look. Base UI
 * models the group value as an array; this wraps it as a single required
 * string. A segmented control must always keep a selection, so empty change
 * events (deselecting the active item) are ignored. Selected state is exposed
 * as `data-pressed`.
 *
 * Options may carry an `icon` and a semantic `tone` — e.g. a Completed
 * (`success` + check) / Missed (`danger` + close) status toggle fills each
 * option with its own color when selected instead of the neutral inverted pill.
 */
export function SegControl({
  value,
  onValueChange,
  options,
  className,
  'aria-label': ariaLabel
}: SegControlProps): ReactNode {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(next) => {
        const picked = next[0]
        if (picked) onValueChange(picked as string)
      }}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex rounded-md border border-border-subtle bg-surface-raised p-0.5',
        className
      )}
    >
      {options.map((o) => (
        <Toggle
          key={o.value}
          value={o.value}
          className={cn(
            'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-sm px-[13px] py-1.5 text-sm font-semibold whitespace-nowrap text-text-secondary transition-colors',
            'hover:text-text-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
            pressedByTone[o.tone ?? 'default']
          )}
        >
          {o.icon && <Icon name={o.icon} className="text-md" />}
          {o.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
