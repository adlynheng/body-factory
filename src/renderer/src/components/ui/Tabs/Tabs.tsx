import { Tabs as BaseTabs } from '@base-ui-components/react/tabs'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

/**
 * Tabs — Base UI `Tabs` (roving-focus arrow-key nav, ARIA, selection state),
 * our tokens for the underline look (design's run-detail tabs, `.bf-rc-tabs`).
 *
 * Compound: `Tabs.Root` > `Tabs.List` (with a sliding `Tabs.Indicator`) > many
 * `Tabs.Tab value=…`, then a `Tabs.Panel value=…` per tab. Selection lives in
 * Base UI (`value` / `defaultValue` / `onValueChange` on Root); the active tab
 * exposes `data-selected`, styled directly with Tailwind.
 */
function TabsRoot({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseTabs.Root>): ReactNode {
  return <BaseTabs.Root className={cn('flex flex-col', className)} {...props} />
}

function TabsList({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof BaseTabs.List>): ReactNode {
  return (
    <BaseTabs.List
      className={cn('relative flex items-center gap-1 border-b border-border-subtle', className)}
      {...props}
    >
      {children}
      <TabsIndicator />
    </BaseTabs.List>
  )
}

function TabsTab({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseTabs.Tab>): ReactNode {
  return (
    <BaseTabs.Tab
      className={cn(
        'relative -mb-px cursor-pointer select-none whitespace-nowrap px-2.5 py-2 text-sm font-medium tracking-snug text-text-secondary transition-colors',
        'hover:text-text-primary data-selected:text-text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:rounded-sm',
        'disabled:pointer-events-none disabled:opacity-40',
        className
      )}
      {...props}
    />
  )
}

/**
 * The sliding underline. Base UI positions it over the active tab via the
 * `--active-tab-*` CSS vars it publishes on the list; we just size/offset from
 * them and animate. Rendered automatically inside `Tabs.List`.
 */
function TabsIndicator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseTabs.Indicator>): ReactNode {
  return (
    <BaseTabs.Indicator
      className={cn(
        'absolute bottom-0 left-0 h-[2px] w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] rounded-full bg-accent transition-all duration-200 ease-out',
        className
      )}
      {...props}
    />
  )
}

function TabsPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseTabs.Panel>): ReactNode {
  return (
    <BaseTabs.Panel
      className={cn(
        'outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:rounded-sm',
        className
      )}
      {...props}
    />
  )
}

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Indicator: TabsIndicator,
  Panel: TabsPanel
})
