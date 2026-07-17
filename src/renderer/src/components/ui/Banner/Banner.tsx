import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export const bannerVariants = cva(
  'group flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-[border-color,background-color,box-shadow,transform] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
  {
    variants: {
      tone: {
        accent: 'border-accent/25 bg-accent/10 hover:bg-accent/15',
        // Design's Apple Fitness import banner (`.bf-import-banner`): a fixed
        // 135° green gradient over the card surface (not a corner gradient),
        // faithful border/shadow, and a lift on hover.
        success:
          'border-[color-mix(in_oklab,var(--bf-success)_45%,var(--bf-border))] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--bf-success)_22%,var(--bf-bg-card))_0%,color-mix(in_oklab,var(--bf-success)_8%,var(--bf-bg-card))_100%)] shadow-[0_4px_18px_color-mix(in_oklab,var(--bf-success)_12%,transparent)] hover:border-success hover:shadow-[0_6px_22px_color-mix(in_oklab,var(--bf-success)_20%,transparent)]',
        neutral: 'border-border-subtle bg-surface-raised hover:bg-surface-hover'
      }
    },
    defaultVariants: { tone: 'accent' }
  }
)

type BannerTone = NonNullable<VariantProps<typeof bannerVariants>['tone']>

const iconToneClasses: Record<BannerTone, string> = {
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/25 text-success',
  neutral: 'bg-surface-hover text-text-secondary'
}

const ctaToneClasses: Record<BannerTone, string> = {
  accent: 'text-accent',
  success: 'text-success',
  neutral: 'text-text-secondary'
}

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
  const t: BannerTone = tone ?? 'accent'
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
            'flex size-[42px] items-center justify-center rounded-xl text-xl',
            iconToneClasses[t]
          )}
        >
          <Icon name={icon} />
        </span>
        {count != null && count > 0 && (
          <span className="mono absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-2xs font-extrabold text-white ring-2 ring-surface-card">
            {count}
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-base font-bold text-text-primary">{title}</span>
        {description && <span className="text-sm text-text-tertiary">{description}</span>}
      </span>
      {cta && (
        <span className={cn('ml-auto shrink-0 text-sm font-bold', ctaToneClasses[t])}>{cta}</span>
      )}
    </button>
  )
})
