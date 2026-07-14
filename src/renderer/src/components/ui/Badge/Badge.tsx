import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-2xs font-semibold leading-none tracking-wide whitespace-nowrap',
  {
    variants: {
      // Soft tinted chips — background is the tone at low opacity, text is the
      // tone at full strength. Covers both status pills and +/- delta chips.
      tone: {
        neutral: 'bg-surface-raised text-text-secondary',
        accent: 'bg-accent/15 text-accent',
        success: 'bg-success/15 text-success',
        danger: 'bg-danger/15 text-danger',
        run: 'bg-run/15 text-run',
        gym: 'bg-gym/15 text-gym',
        floorball: 'bg-floorball/15 text-floorball',
        misc: 'bg-misc/15 text-misc'
      },
      // Pill vs. rounded-rectangle.
      shape: {
        rounded: 'rounded-md',
        pill: 'rounded-full'
      }
    },
    defaultVariants: {
      tone: 'neutral',
      shape: 'rounded'
    }
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children?: ReactNode
}

export function Badge({ className, tone, shape, ...props }: BadgeProps): ReactNode {
  return <span className={cn(badgeVariants({ tone, shape }), className)} {...props} />
}
