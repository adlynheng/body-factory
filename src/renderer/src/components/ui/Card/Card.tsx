import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

const cardVariants = cva('rounded-card border text-text-primary', {
  variants: {
    variant: {
      default: 'border-border-subtle bg-surface-card',
      raised: 'border-border-subtle bg-surface-raised',
      // Borderless — for cards that sit directly on a tinted panel.
      plain: 'border-transparent bg-surface-card'
    },
    interactive: {
      true: 'cursor-pointer transition-colors hover:border-border-strong hover:bg-surface-hover',
      false: ''
    }
  },
  defaultVariants: {
    variant: 'default',
    interactive: false
  }
})

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

function CardRoot({ className, variant, interactive, ...props }: CardProps): ReactNode {
  return <div className={cn(cardVariants({ variant, interactive }), className)} {...props} />
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return <div className={cn('flex flex-col gap-1 p-pad', className)} {...props} />
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>): ReactNode {
  return (
    <h3
      className={cn('font-display text-md font-semibold tracking-snug text-text-primary', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>): ReactNode {
  return <p className={cn('text-xs text-text-tertiary', className)} {...props} />
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return <div className={cn('p-pad pt-0', className)} {...props} />
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return <div className={cn('flex items-center gap-2 p-pad pt-0', className)} {...props} />
}

/**
 * Compound Card. Root owns the frame (border/bg/radius); Header/Content/Footer
 * own their own padding so any composition of them lines up. Reach for the
 * subcomponents instead of adding layout props to the root.
 */
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter
})
