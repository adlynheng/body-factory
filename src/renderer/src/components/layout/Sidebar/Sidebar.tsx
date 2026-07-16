import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

/**
 * Sidebar — the app's left rail (design's `.bf-sidebar`). Compound:
 * `Sidebar` > `Sidebar.Section` (with an optional `Sidebar.Label`) of
 * `Sidebar.Item`s, a `Sidebar.Spacer` to push the rest down, and a
 * `Sidebar.Footer` for the integration cards. Nav items are `Sidebar.Item` —
 * an icon + label button that marks itself `aria-current="page"` when active.
 */
function SidebarRoot({ className, ...props }: HTMLAttributes<HTMLElement>): ReactNode {
  return (
    <aside
      className={cn(
        'flex w-[220px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-border-subtle bg-surface-sidebar p-3',
        className
      )}
      {...props}
    />
  )
}

function SidebarSection({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return <div className={cn('flex flex-col gap-0.5', className)} {...props} />
}

function SidebarLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return (
    <div
      className={cn(
        'px-2.5 pb-1 text-2xs font-bold uppercase tracking-widest text-text-tertiary',
        className
      )}
      {...props}
    />
  )
}

export interface SidebarItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  label: ReactNode
  active?: boolean
}

function SidebarItem({
  icon,
  label,
  active,
  className,
  type,
  ...props
}: SidebarItemProps): ReactNode {
  return (
    <button
      type={type ?? 'button'}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        active
          ? 'bg-surface-hover text-text-primary'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
        className
      )}
      {...props}
    >
      <Icon name={icon} className="shrink-0 text-md" />
      <span className="truncate">{label}</span>
    </button>
  )
}

function SidebarSpacer(): ReactNode {
  return <div className="flex-1" />
}

function SidebarFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return <div className={cn('flex flex-col gap-2', className)} {...props} />
}

export const Sidebar = Object.assign(SidebarRoot, {
  Root: SidebarRoot,
  Section: SidebarSection,
  Label: SidebarLabel,
  Item: SidebarItem,
  Spacer: SidebarSpacer,
  Footer: SidebarFooter
})
