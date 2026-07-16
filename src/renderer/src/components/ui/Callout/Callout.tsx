import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export const calloutVariants = cva(
  'flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[12.5px] font-semibold',
  {
    variants: {
      tone: {
        danger: 'border-danger/25 bg-danger/10 text-danger',
        warning: 'border-gym/25 bg-gym/10 text-gym',
        success: 'border-success/25 bg-success/10 text-success',
        info: 'border-floorball/25 bg-floorball/10 text-floorball'
      }
    },
    defaultVariants: { tone: 'info' }
  }
)

export interface CalloutProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  icon?: IconName
}

/**
 * Callout — an inline tinted banner for a single notice (design's rest-day
 * nudge, `.bf-rest-banner`, is the `danger` tone). Tone sets border, tint, and
 * text together; pass an optional leading `icon` from the registry.
 */
export function Callout({ className, tone, icon, children, ...props }: CalloutProps): ReactNode {
  return (
    <div role="status" className={cn(calloutVariants({ tone }), className)} {...props}>
      {icon && <Icon name={icon} className="shrink-0 text-base" />}
      <span className="min-w-0">{children}</span>
    </div>
  )
}
