import { NumberField as BaseNumberField } from '@base-ui-components/react/number-field'
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef, type ReactNode } from 'react'
import { Icon } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export interface NumberFieldProps extends Omit<
  ComponentPropsWithoutRef<typeof BaseNumberField.Root>,
  'className'
> {
  /** Trailing unit label rendered inside the control, e.g. "days" / "weeks". */
  suffix?: ReactNode
  /** Hide the −/+ stepper buttons (bare numeric input). */
  hideStepper?: boolean
  className?: string
  inputClassName?: string
  'aria-label'?: string
}

const stepBtn =
  'flex w-7 shrink-0 items-center justify-center text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-30'

/**
 * NumberField — Base UI `NumberField` (spinbutton ARIA, keyboard step, scrub,
 * clamping to min/max, hidden form input), our tokens. Bounded numeric input
 * with an optional −/+ stepper (design's rest-day threshold + template
 * repeat-weeks inputs). Pass `suffix` for a unit label; set `hideStepper` for a
 * bare input. Value lives in Base UI (`value` / `defaultValue` /
 * `onValueChange`, plus `min` / `max` / `step`).
 */
export const NumberField = forwardRef<ComponentRef<typeof BaseNumberField.Input>, NumberFieldProps>(
  function NumberField(
    { suffix, hideStepper, className, inputClassName, 'aria-label': ariaLabel, ...root },
    ref
  ) {
    return (
      <BaseNumberField.Root {...root}>
        <BaseNumberField.Group
          className={cn(
            'inline-flex h-8 items-stretch overflow-hidden rounded-md border border-border-subtle bg-surface-raised transition-colors focus-within:border-border-strong',
            'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40',
            className
          )}
        >
          {!hideStepper && (
            <BaseNumberField.Decrement className={cn(stepBtn, 'border-r border-border-subtle')}>
              <Icon name="minus" className="text-sm" />
            </BaseNumberField.Decrement>
          )}
          <BaseNumberField.Input
            ref={ref}
            aria-label={ariaLabel}
            className={cn(
              'w-14 min-w-0 bg-transparent px-1 text-center text-base font-medium text-text-primary [font-variant-numeric:tabular-nums] placeholder:text-text-muted focus:outline-none',
              inputClassName
            )}
          />
          {suffix != null && (
            <span className="flex items-center pr-2 text-sm text-text-tertiary">{suffix}</span>
          )}
          {!hideStepper && (
            <BaseNumberField.Increment className={cn(stepBtn, 'border-l border-border-subtle')}>
              <Icon name="add" className="text-sm" />
            </BaseNumberField.Increment>
          )}
        </BaseNumberField.Group>
      </BaseNumberField.Root>
    )
  }
)
