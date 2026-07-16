import { Field as BaseField } from '@base-ui-components/react/field'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { textFieldVariants } from '@renderer/components/ui/TextField'
import { cn } from '@renderer/lib/utils'

/**
 * Form field — Base UI `Field`, our tokens. Unlike Radix Form, Base UI `Field`
 * works standalone: no surrounding `<Form>` is required (a `Form` only adds
 * submit-level validation coordination). `Field.Label` auto-associates with
 * `Field.Control`; `Field.Error` renders validation messages and the control
 * picks up `data-invalid` styling automatically.
 *
 * `Field.Control` defaults to the shared text-field look. For a textarea/select
 * or our `TextField`, pass `render` (e.g. `<Field.Control render={<Textarea />} />`).
 */
function FieldRoot({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseField.Root>): ReactNode {
  return <BaseField.Root className={cn('flex flex-col gap-1.5', className)} {...props} />
}

function FieldLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseField.Label>): ReactNode {
  return (
    <BaseField.Label
      className={cn('text-2xs font-bold uppercase tracking-wider text-text-tertiary', className)}
      {...props}
    />
  )
}

function FieldControl({
  className,
  render,
  ...props
}: ComponentPropsWithoutRef<typeof BaseField.Control>): ReactNode {
  // Default: a styled native input. When a custom control is supplied via
  // `render` (e.g. `<Textarea />`), that element owns its own look — don't add
  // the text-field classes on top, or the two style sets collide.
  return (
    <BaseField.Control
      render={render}
      className={render ? className : cn(textFieldVariants(), className)}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseField.Description>): ReactNode {
  return (
    <BaseField.Description className={cn('text-xs text-text-tertiary', className)} {...props} />
  )
}

function FieldError({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseField.Error>): ReactNode {
  return <BaseField.Error className={cn('text-xs font-medium text-danger', className)} {...props} />
}

export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError
})
