import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Rhythm density — mirrors the design's window `data-density`; drives token spacing. */
  density?: 'compact' | 'regular' | 'comfy'
}

/**
 * AppShell — the window frame (design's `.bf-window`). A full-height column:
 * `Titlebar` at the top, then `AppShell.Body` holding the `Sidebar` and
 * `AppShell.Main` scroll region. `density` sets `data-density` so
 * `[data-density]` spacing tokens flow through. Defaults to `h-screen`; pass a
 * height via `className` to embed it (e.g. a preview).
 */
function AppShellRoot({ className, density, ...props }: AppShellProps): ReactNode {
  return (
    <div
      data-density={density}
      className={cn(
        'flex h-screen flex-col overflow-hidden bg-surface-window text-text-primary',
        className
      )}
      {...props}
    />
  )
}

function AppShellBody({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return <div className={cn('flex min-h-0 flex-1', className)} {...props} />
}

function AppShellMain({ className, ...props }: HTMLAttributes<HTMLElement>): ReactNode {
  return <main className={cn('min-w-0 flex-1 overflow-y-auto', className)} {...props} />
}

export const AppShell = Object.assign(AppShellRoot, {
  Root: AppShellRoot,
  Body: AppShellBody,
  Main: AppShellMain
})
