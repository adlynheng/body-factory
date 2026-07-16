import { Input } from '@base-ui-components/react/input'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'
import { cn } from '@renderer/lib/utils'

export const textFieldVariants = cva(
  'w-full rounded-md border bg-surface-raised px-2.5 py-2 text-base font-medium text-text-primary placeholder:text-text-muted transition-colors focus:border-border-strong focus:bg-surface-hover focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 data-invalid:border-danger',
  {
    variants: {
      invalid: {
        true: 'border-danger',
        false: 'border-border-subtle'
      }
    },
    defaultVariants: { invalid: false }
  }
)

export interface TextFieldProps
  extends Omit<ComponentPropsWithoutRef<typeof Input>, 'className'>,
    VariantProps<typeof textFieldVariants> {
  className?: string
}

/**
 * Single-line text input — Base UI `Input` + our tokens (design's
 * `.bf-text-input`). Usable anywhere on its own; inside a `Field` it inherits
 * the field's validation wiring and turns danger-bordered via `data-invalid`.
 * `invalid` forces that state manually. `textFieldVariants` is shared with
 * `Field.Control` so both render identically.
 */
export const TextField = forwardRef<ComponentRef<typeof Input>, TextFieldProps>(function TextField(
  { className, invalid, ...props },
  ref
) {
  return <Input ref={ref} className={cn(textFieldVariants({ invalid }), className)} {...props} />
})
