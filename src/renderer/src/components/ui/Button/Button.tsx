import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@renderer/lib/utils'

export const buttonVariants = cva(
  // Base: layout, type, focus ring, disabled + transition. Spacing/color come
  // from the variants below so every valid combo lives in one place.
  'inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium tracking-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        // Accent fill — the one high-emphasis action per view. Fixed dark ink
        // pairs with every accent hue in both themes.
        solid: 'bg-accent text-black hover:brightness-110 active:brightness-95',
        // Tinted card-like button for secondary actions.
        soft: 'border border-border-subtle bg-surface-raised text-text-primary hover:bg-surface-hover',
        // Bordered, transparent fill.
        outline: 'border border-border-strong text-text-primary hover:bg-surface-hover',
        // Chromeless — toolbar / inline actions.
        ghost: 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
        // Destructive.
        danger: 'bg-danger text-white hover:brightness-110 active:brightness-95'
      },
      size: {
        sm: 'h-7 px-2.5 text-xs',
        md: 'h-8 px-3 text-sm',
        lg: 'h-9 px-4 text-md',
        // Square icon button — folds the old IconButton into Button.
        icon: 'h-8 w-8 shrink-0 p-0 text-md'
      }
    },
    defaultVariants: {
      variant: 'soft',
      size: 'md'
    }
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * Styled button. Plain `<button>` — for composition (toolbar rows, popover /
 * dialog triggers) pass it to a Base UI part's `render` prop, e.g.
 * `<Toolbar.Button render={<Button variant="ghost" />} />`. Base UI merges its
 * behavior/props (className, data-state, handlers, ref) onto this element.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, type, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})
