import type { ReactNode } from 'react'
import { EmptyState } from '@renderer/components/ui/EmptyState'

/** `/trends` — placeholder until the Trends screen is built. */
export function TrendsPage(): ReactNode {
  return (
    <div className="grid h-full place-items-center p-8">
      <EmptyState
        icon="trends"
        title="Trends — coming soon"
        description="This screen isn't built yet. Overview is live with mock data."
      />
    </div>
  )
}
