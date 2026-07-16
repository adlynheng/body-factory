import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@renderer/lib/utils'

export const textareaVariants = cva(
  'min-h-[60px] w-full resize-y rounded-md border bg-surface-raised px-2.5 py-2 text-base font-medium leading-[1.45] text-text-primary placeholder:text-text-muted transition-colors focus:border-border-strong focus:bg-surface-hover focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 data-invalid:border-danger',
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

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

/**
 * Multi-line text input — native `<textarea>` + our tokens (design's
 * `.bf-textarea-input`, the notes box). Vertically resizable, 60px min. Shares
 * the field look with `TextField`; pass to a `Field.Control` via `render` when
 * validation/labelling is wanted.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref
) {
  return <textarea ref={ref} className={cn(textareaVariants({ invalid }), className)} {...props} />
})
