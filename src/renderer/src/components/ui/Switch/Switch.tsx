import { Switch as RadixSwitch } from 'radix-ui'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '@renderer/lib/utils'

/**
 * Toggle switch — Radix `Switch` for behavior (checked state, keyboard, ARIA),
 * our tokens for looks. Geometry mirrors the design: 38×22 track, 18px knob,
 * success-green when on. The knob travels 16px (`translate-x-4`) from a 2px
 * inset, landing 2px from the far edge.
 */
export const Switch = forwardRef<
  ElementRef<typeof RadixSwitch.Root>,
  ComponentPropsWithoutRef<typeof RadixSwitch.Root>
>(function Switch({ className, ...props }, ref) {
  return (
    <RadixSwitch.Root
      ref={ref}
      className={cn(
        'inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer items-center rounded-full px-0.5 transition-colors',
        'bg-border-strong data-[state=checked]:bg-success',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      {...props}
    >
      <RadixSwitch.Thumb className="pointer-events-none block size-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
    </RadixSwitch.Root>
  )
})
