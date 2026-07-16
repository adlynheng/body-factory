import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

/**
 * Fake macOS traffic lights — only for previews (the Gallery's mock window),
 * where there's no real OS window to draw them. The shipped app uses the
 * genuine native lights via the window's `titleBarStyle: 'hiddenInset'`, so
 * `Titlebar` renders these only when `trafficLights` is explicitly set.
 */
export function TrafficLights(): ReactNode {
  return (
    <div className="flex items-center gap-2 [-webkit-app-region:no-drag]">
      <span className="size-3 rounded-full bg-[#ff5f57]" />
      <span className="size-3 rounded-full bg-[#febc2e]" />
      <span className="size-3 rounded-full bg-[#28c840]" />
    </div>
  )
}

export interface TitlebarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Leading brand mark, shown in the centered cluster before the title. */
  logo?: ReactNode
  title?: ReactNode
  /**
   * Draw fake macOS traffic lights on the left. Leave off in the shipped app —
   * the OS draws real lights into this strip via `titleBarStyle: 'hiddenInset'`.
   * Turn on only for previews (the Gallery mock window). When off, the left
   * cell reserves room so the native lights never overlap our chrome.
   */
  trafficLights?: boolean
  /** Right-side muted text (e.g. "Wk 22 · May 2026"). */
  meta?: ReactNode
  /** Right-side controls (e.g. ThemeToggle). */
  children?: ReactNode
}

/**
 * Titlebar — the app window's top chrome, rendered into the macOS native title
 * bar strip (the window is created with `titleBarStyle: 'hiddenInset'`, so the
 * real traffic lights sit inset over our left cell). A centered logo + title,
 * right-aligned meta + controls. The whole bar is a drag region
 * (`-webkit-app-region: drag`); interactive children sit in a no-drag zone so
 * they stay clickable. The left cell reserves ~64px so nothing collides with
 * the native lights.
 */
export function Titlebar({
  logo,
  title,
  trafficLights = false,
  meta,
  className,
  children,
  ...props
}: TitlebarProps): ReactNode {
  return (
    <header
      className={cn(
        'grid h-10 shrink-0 grid-cols-[minmax(64px,1fr)_auto_1fr] items-center gap-2 border-b border-border-titlebar bg-titlebar px-3 [-webkit-app-region:drag]',
        className
      )}
      {...props}
    >
      <div className="flex items-center">{trafficLights && <TrafficLights />}</div>
      <div className="flex items-center gap-1.5 justify-self-center">
        {logo && <span className="text-md text-text-secondary">{logo}</span>}
        {title && (
          <span className="text-sm font-semibold tracking-snug text-text-primary">{title}</span>
        )}
      </div>
      <div className="flex items-center gap-2 justify-self-end [-webkit-app-region:no-drag]">
        {meta && <span className="mono text-xs text-text-tertiary">{meta}</span>}
        {children}
      </div>
    </header>
  )
}
