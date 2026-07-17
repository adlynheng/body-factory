import { createPortal } from 'react-dom'
import type { ReactElement } from 'react'

/**
 * A single body-level container that dragged calendar items are portaled into.
 * The month/week cells use `overflow: hidden`, which would clip a card while it
 * is dragged across cells; `@hello-pangea/dnd` positions the dragging element
 * `fixed`, so rendering it under `<body>` (outside every clipping ancestor)
 * lets it travel freely. Created lazily on first drag.
 */
let node: HTMLElement | null = null
function portalNode(): HTMLElement {
  if (!node) {
    node = document.createElement('div')
    node.setAttribute('data-bf-drag-portal', '')
    document.body.appendChild(node)
  }
  return node
}

/** Portal `children` to the body-level drag layer while `active` (dragging). */
export function DragPortal({
  active,
  children
}: {
  active: boolean
  children: ReactElement
}): ReactElement {
  return active ? createPortal(children, portalNode()) : children
}
