import { Toolbar as BaseToolbar } from '@base-ui-components/react/toolbar'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Button, type ButtonProps } from '@renderer/components/ui/Button'
import { cn } from '@renderer/lib/utils'

/**
 * Toolbar — Base UI `Toolbar` gives a row of controls one-tab-stop roving focus
 * (arrow keys move between items). Use this for actual toolbars: the window
 * titlebar, the calendar header controls, etc.
 *
 * `Toolbar.Button` passes our styled `Button` to Base UI `Toolbar.Button` via
 * its `render` prop, so toolbar items get the roving-focus behavior *and* our
 * design. A bare `Toolbar.Button` requires this `Root` for its focus context —
 * that's why standalone `Button` stays a plain `<button>` and only picks up
 * toolbar semantics here.
 */
function ToolbarRoot({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseToolbar.Root>): ReactNode {
  return <BaseToolbar.Root className={cn('flex items-center gap-1', className)} {...props} />
}

function ToolbarButton(props: ButtonProps): ReactNode {
  return <BaseToolbar.Button render={<Button {...props} />} />
}

function ToolbarSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseToolbar.Separator>): ReactNode {
  return (
    <BaseToolbar.Separator
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
