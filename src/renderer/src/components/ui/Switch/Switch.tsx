import { Switch as BaseSwitch } from '@base-ui-components/react/switch'
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { cn } from '@renderer/lib/utils'

/**
 * Toggle switch — Base UI `Switch` for behavior (checked state, keyboard, ARIA,
 * hidden form input), our tokens for looks. Geometry mirrors the design: 38×22
 * track, 18px knob, success-green when on. Base UI exposes state as
 * `data-checked` / `data-unchecked` attributes, styled directly with Tailwind.
 */
export const Switch = forwardRef<
  ComponentRef<typeof BaseSwitch.Root>,
  ComponentPropsWithoutRef<typeof BaseSwitch.Root>
>(function Switch({ className, ...props }, ref) {
  return (
    <BaseSwitch.Root
      ref={ref}
      className={cn(
        'inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer items-center rounded-full px-0.5 transition-colors',
        'bg-border-strong data-checked:bg-success',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      {...props}
    >
      <BaseSwitch.Thumb className="pointer-events-none block size-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform data-checked:translate-x-4 data-unchecked:translate-x-0" />
    </BaseSwitch.Root>
  )
})
