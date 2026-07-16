import { Tooltip as BaseTooltip } from '@base-ui-components/react/tooltip'
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

/**
 * App-wide tooltip timing. Mount once near the app root so hovering between
 * adjacent triggers doesn't re-wait the full open delay. Individual `Tooltip`s
 * can still override `delay`.
 */
export function TooltipProvider({
  delay = 300,
  closeDelay = 0,
  ...props
}: ComponentPropsWithoutRef<typeof BaseTooltip.Provider>): ReactNode {
  return <BaseTooltip.Provider delay={delay} closeDelay={closeDelay} {...props} />
}

export interface TooltipProps {
  /** Tooltip contents. */
  content: ReactNode
  /** The trigger element — Base UI merges its behavior onto this via `render`. */
  children: ReactElement
  side?: ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>['side']
  align?: ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>['align']
  sideOffset?: number
  className?: string
}

/**
 * Tooltip — Base UI `Tooltip` (hover/focus intent, dismiss, positioning with
 * collision flip, ARIA), our tokens. Convenience wrapper for the common case:
 * one trigger, one string/node of content. Wrap the trigger element directly —
 * `<Tooltip content="Delete"><Button …/></Tooltip>`. Needs a `TooltipProvider`
 * ancestor. Entry/exit fade+scale respects `prefers-reduced-motion`.
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  sideOffset = 6,
  className
}: TooltipProps): ReactNode {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children as ReactElement<Record<string, unknown>>} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset}>
          <BaseTooltip.Popup
            className={cn(
              'z-[60] origin-[var(--transform-origin)] rounded-md border border-border-strong bg-surface-raised px-2 py-1 text-xs font-medium text-text-primary shadow-modal',
              'transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none',
              'data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
              'data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
              className
            )}
          >
            <BaseTooltip.Arrow className="text-border-strong data-[side=bottom]:-top-[3px] data-[side=top]:-bottom-[3px]">
              <span className="block size-1.5 rotate-45 border-b border-r border-border-strong bg-surface-raised" />
            </BaseTooltip.Arrow>
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
