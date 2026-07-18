import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@renderer/components/ui/Button'
import { EmptyState } from '@renderer/components/ui/EmptyState'
import { sessionLabel } from '@renderer/features/sessions'
import { useAppStore } from '@renderer/store/appStore'

/**
 * `/session/:sessionId` — the session detail screen. Placeholder for now; the
 * design's `session-detail.jsx` / `run-detail.jsx` get ported here next. Resolves
 * the session from the store so a bad id shows a "not found" state.
 */
export function SessionPage(): ReactNode {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const session = useAppStore((s) => s.sessions.find((x) => x.id === sessionId))

  return (
    <div className="grid h-full place-items-center p-8">
      <EmptyState
        icon={session ? 'run' : 'calendar'}
        title={session ? `${sessionLabel(session)} — coming soon` : 'Session not found'}
        description={
          session
            ? "Session detail isn't built yet. It'll land here next."
            : `No session with id “${sessionId}”.`
        }
        actions={
          <Button variant="soft" onClick={() => navigate(-1)}>
            Back
          </Button>
        }
      />
    </div>
  )
}
