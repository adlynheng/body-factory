import { Toolbar as RadixToolbar } from 'radix-ui'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Button, type ButtonProps } from '@renderer/components/ui/Button'
import { cn } from '@renderer/lib/utils'

/**
 * Toolbar — Radix `Toolbar` gives a row of controls one-tab-stop roving focus
 * (arrow keys move between items). Use this for actual toolbars: the window
 * titlebar, the calendar header controls, etc.
 *
 * `Toolbar.Button` wraps Radix `Toolbar.Button` (`asChild`) around our styled
 * `Button`, so toolbar items get the roving-focus behavior *and* our design.
 * A bare Radix `Toolbar.Button` requires this `Root` for its focus context —
 * that's why standalone `Button` stays a plain `<button>` and only picks up
 * toolbar semantics here.
 */
function ToolbarRoot({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixToolbar.Root>): ReactNode {
  return (
    <RadixToolbar.Root className={cn('flex items-center gap-1', className)} {...props} />
  )
}

function ToolbarButton(props: ButtonProps): ReactNode {
  return (
    <RadixToolbar.Button asChild>
      <Button {...props} />
    </RadixToolbar.Button>
  )
}

function ToolbarSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadixToolbar.Separator>): ReactNode {
  return (
    <RadixToolbar.Separator
      className={cn('mx-1 h-4 w-px shrink-0 bg-border-subtle', className)}
      {...props}
    />
  )
}

export const Toolbar = Object.assign(ToolbarRoot, {
  Root: ToolbarRoot,
  Button: ToolbarButton,
  Separator: ToolbarSeparator
})
