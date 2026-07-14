import type { ReactNode } from 'react'
import { Icon, iconRegistry, type IconName } from '@renderer/components/ui/Icon'

/**
 * Primitive Gallery — a development-only surface for building and eyeballing
 * design-system primitives in isolation, before they're composed into feature
 * screens. Each phase adds a section here. Not shipped in the real app shell.
 */
export function Gallery(): ReactNode {
  return (
    <div className="min-h-screen px-8 py-10">
      <header className="mx-auto mb-10 max-w-5xl">
        <p className="text-2xs font-bold uppercase tracking-widest text-text-tertiary">
          Body Factory
        </p>
        <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-text-primary">
          Primitive Gallery
        </h1>
        <p className="mt-2 max-w-prose text-sm text-text-secondary">
          Design-system primitives in isolation. Sections are added phase by phase as each
          primitive is built.
        </p>
      </header>

      <main className="mx-auto max-w-5xl space-y-12">
        <GallerySection title="Icons" caption="Semantic registry — referenced by role, not glyph">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-gutter">
            {(Object.keys(iconRegistry) as IconName[]).map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-lg border border-border-subtle bg-surface-card p-pad"
              >
                <Icon name={name} className="text-2xl text-text-primary" />
                <span className="text-3xs font-medium text-text-tertiary">{name}</span>
              </div>
            ))}
          </div>
        </GallerySection>
      </main>
    </div>
  )
}

function GallerySection({
  title,
  caption,
  children
}: {
  title: string
  caption?: string
  children: ReactNode
}): ReactNode {
  return (
    <section>
      <div className="mb-4 flex items-baseline gap-3 border-b border-border-subtle pb-2">
        <h2 className="font-display text-xl font-bold tracking-snug text-text-primary">{title}</h2>
        {caption && <p className="text-xs text-text-tertiary">{caption}</p>}
      </div>
      {children}
    </section>
  )
}
