import { Form as BaseForm } from '@base-ui-components/react/form'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

/**
 * Form — Base UI `Form`, our tokens. Optional wrapper around `Field`s that adds
 * submit-level validation coordination (focuses the first invalid field, maps
 * server `errors` back onto fields). `Field` works without it; reach for `Form`
 * when a group of fields is submitted together (the add-session / template
 * modals). Stacks its children with the design's field spacing.
 */
export function Form({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseForm>): ReactNode {
  return <BaseForm className={cn('flex flex-col gap-[18px]', className)} {...props} />
}
