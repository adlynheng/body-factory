import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export const bannerVariants = cva(
  'group flex w-full items-center gap-3 rounded-card border px-pad py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
  {
    variants: {
      tone: {
        accent: 'border-accent/25 bg-accent/10 hover:bg-accent/15',
        neutral: 'border-border-subtle bg-surface-raised hover:bg-surface-hover'
      }
    },
    defaultVariants: { tone: 'accent' }
  }
)

export interface BannerProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'>,
    VariantProps<typeof bannerVariants> {
  icon: IconName
  /** Count badge on the icon (e.g. number of pending imports). Hidden when 0/undefined. */
  count?: number
  title: ReactNode
  description?: ReactNode
  /** Trailing call-to-action label, e.g. "Import →". */
  cta?: ReactNode
}

/**
 * Banner — a full-width, clickable notice (design's Apple Fitness import
 * banner, `.bf-import-banner`): a leading icon with an optional count badge, a
 * title + description, and a trailing CTA. This is the *actionable* sibling of
 * `Callout` (which is a flat, non-interactive inline notice) — render it when
 * the whole strip is a button.
 */
export const Banner = forwardRef<HTMLButtonElement, BannerProps>(function Banner(
  { className, tone, icon, count, title, description, cta, type, ...props },
  ref
) {
  const accent = tone !== 'neutral'
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cn(bannerVariants({ tone }), className)}
      {...props}
    >
      <span className="relative shrink-0">
        <span
          className={cn(
            'flex size-9 items-center justify-center rounded-lg text-lg',
            accent ? 'bg-accent/15 text-accent' : 'bg-surface-hover text-text-secondary'
          )}
        >
          <Icon name={icon} />
        </span>
        {count != null && count > 0 && (
          <span className="mono absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-2xs font-bold text-black">
            {count}
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-base font-semibold text-text-primary">{title}</span>
        {description && <span className="text-sm text-text-secondary">{description}</span>}
      </span>
      {cta && (
        <span
          className={cn(
            'ml-auto shrink-0 text-sm font-semibold',
            accent ? 'text-accent' : 'text-text-secondary'
          )}
        >
          {cta}
        </span>
      )}
    </button>
  )
})
