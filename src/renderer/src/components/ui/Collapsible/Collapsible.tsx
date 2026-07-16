import { Collapsible as BaseCollapsible } from '@base-ui-components/react/collapsible'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

/**
 * Collapsible — Base UI `Collapsible` (open state, ARIA, keyboard), our tokens.
 * Vertical show/hide for a single region (design's run-detail details panel).
 *
 * Compound: `Collapsible.Root` (`open` / `defaultOpen` / `onOpenChange`) >
 * `Collapsible.Trigger` (pass our `Button` via its `render` prop) >
 * `Collapsible.Panel`. The panel animates its height from the
 * `--collapsible-panel-height` var Base UI publishes; state is on `data-open` /
 * `data-closed`. Respects `prefers-reduced-motion` (snaps instead of sliding).
 */
const CollapsibleRoot = BaseCollapsible.Root
const CollapsibleTrigger = BaseCollapsible.Trigger

function CollapsiblePanel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>): ReactNode {
  return (
    <BaseCollapsible.Panel
      className={cn(
        'h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 ease-out',
        'motion-reduce:transition-none',
        'data-[starting-style]:h-0 data-[ending-style]:h-0',
        className
      )}
      {...props}
    />
  )
}

export const Collapsible = Object.assign(CollapsibleRoot, {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel
})
