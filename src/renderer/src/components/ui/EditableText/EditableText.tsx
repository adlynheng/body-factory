import { createElement, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'
import './editable.css'

export interface EditableTextProps {
  value: string
  onCommit: (value: string) => void
  placeholder?: string
  /** Element to render (design uses `h1` for the hero title, `p` for its description). */
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  'aria-label'?: string
}

/**
 * Inline-editable text — a `contentEditable` element that commits on blur,
 * commits on Enter, and reverts on Escape (design's hero title + description).
 * Whitespace is collapsed on commit. The initial text is uncontrolled after
 * mount (as contentEditable requires), so pass a stable `key` that changes when
 * the underlying record changes, to reset the content — e.g.
 * `<EditableText key={session.id} … />`.
 */
export function EditableText({
  value,
  onCommit,
  placeholder,
  as = 'span',
  className,
  'aria-label': ariaLabel
}: EditableTextProps): ReactNode {
  const clean = (el: HTMLElement): string => el.textContent?.replace(/\s+/g, ' ').trim() ?? ''
  return createElement(
    as,
    {
      className: cn('bf-editable', className),
      contentEditable: true,
      suppressContentEditableWarning: true,
      spellCheck: false,
      role: 'textbox',
      'aria-label': ariaLabel,
      'data-empty': value.trim() === '' ? '' : undefined,
      'data-placeholder': placeholder,
      onBlur: (e: FocusEvent<HTMLElement>) => onCommit(clean(e.currentTarget)),
      onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.currentTarget.blur()
        }
        if (e.key === 'Escape') {
          e.currentTarget.textContent = value
          e.currentTarget.blur()
        }
      }
    },
    value
  )
}
