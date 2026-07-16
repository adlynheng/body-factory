import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

const emptyStateVariants = cva('', {
  variants: {
    size: {
      // Full placeholder card (design's `.bf-empty-actual`).
      default:
        'rounded-xl border border-dashed border-border-strong bg-surface-raised px-5 py-7 text-center',
      // One-line muted note (design's `.bf-empty-mini` / `.bf-cmp-empty`).
      mini: 'py-2 text-xs text-text-tertiary'
    }
  },
  defaultVariants: { size: 'default' }
})

export interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  icon?: IconName
  title?: ReactNode
  description?: ReactNode
  /** Buttons/links shown under the copy (default size only). */
  actions?: ReactNode
  className?: string
}

/**
 * EmptyState — the "nothing here yet" placeholder. `default` is the dashed card
 * with an icon, title, description, and actions; `mini` is a single muted line
 * for tight spots (related list, comparison). Parent owns outer spacing.
 */
export function EmptyState({
  size,
  icon,
  title,
  description,
  actions,
  className
}: EmptyStateProps): ReactNode {
  if (size === 'mini') {
    return <div className={cn(emptyStateVariants({ size }), className)}>{description}</div>
  }
  return (
    <div className={cn(emptyStateVariants({ size }), className)}>
      {icon && (
        <div className="mb-2 flex justify-center text-2xl text-text-tertiary">
          <Icon name={icon} />
        </div>
      )}
      {title && <div className="mb-1 text-md font-bold text-text-primary">{title}</div>}
      {description && <div className="text-sm text-text-tertiary">{description}</div>}
      {actions && <div className="mt-4 flex justify-center gap-2">{actions}</div>}
    </div>
  )
}
