import { useCallback, useState, type ReactNode } from 'react'
import { Icon } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

function readTheme(): 'dark' | 'light' {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export interface ThemeToggleProps {
  className?: string
}

/**
 * ThemeToggle — the 24px titlebar button that flips `[data-theme]` on the
 * document root (design's `.bf-theme-toggle`). Shows the icon of the theme it
 * switches *to*. Chrome, not a design primitive — hence `components/layout`.
 * This owns the theme attribute directly for now; lift into a store/persistence
 * layer when settings land.
 */
export function ThemeToggle({ className }: ThemeToggleProps): ReactNode {
  const [theme, setTheme] = useState<'dark' | 'light'>(readTheme)
  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      return next
    })
  }, [])

  const target = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${target} theme`}
      className={cn(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-sm border border-border-titlebar bg-transparent text-text-secondary transition-colors',
        'hover:border-border-strong hover:bg-surface-hover hover:text-text-primary active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        className
      )}
    >
      <Icon name={target} className="text-[15px]" />
    </button>
  )
}
