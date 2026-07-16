import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

/**
 * Dialog — Base UI `Dialog` (focus trap, scroll lock, dismiss, ARIA), our
 * tokens. `Dialog.Content` bundles the portal, backdrop, and centered popup
 * frame; compose `Dialog.Header` / `Dialog.Body` / `Dialog.Footer` inside it.
 * The body scrolls independently (design's `.bf-modal-body`) while the header
 * and footer stay pinned, and the whole popup is capped at `100vh − 80px`.
 * Always include a `Dialog.Title` for accessibility.
 */
const DialogRoot = BaseDialog.Root
const DialogTrigger = BaseDialog.Trigger
const DialogClose = BaseDialog.Close

function DialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof BaseDialog.Popup>): ReactNode {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[8px] transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <BaseDialog.Popup
        className={cn(
          'fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100vh-80px)] w-full max-w-[560px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-card border border-border-strong bg-surface-card p-6 shadow-modal outline-none',
          className
        )}
        {...props}
      >
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return (
    <div
      className={cn('mb-5 flex shrink-0 items-baseline justify-between gap-3', className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseDialog.Title>): ReactNode {
  return (
    <BaseDialog.Title
      className={cn('font-display text-xl font-extrabold tracking-tight text-text-primary', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof BaseDialog.Description>): ReactNode {
  return <BaseDialog.Description className={cn('text-sm text-text-tertiary', className)} {...props} />
}

function DialogBody({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return <div className={cn('-mx-6 min-h-0 flex-1 overflow-y-auto px-6', className)} {...props} />
}

function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactNode {
  return (
    <div
      className={cn(
        'mt-5 flex shrink-0 justify-end gap-2 border-t border-border-subtle pt-3',
        className
      )}
      {...props}
    />
  )
}

export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Close: DialogClose,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter
})
