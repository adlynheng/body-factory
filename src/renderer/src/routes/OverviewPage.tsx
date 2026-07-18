import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Overview } from '@renderer/features/overview'
import { useAppStore } from '@renderer/store/appStore'

/** `/` — the Overview screen. */
export function OverviewPage(): ReactNode {
  const navigate = useNavigate()
  const sessions = useAppStore((s) => s.sessions)
  const fitnessInbox = useAppStore((s) => s.fitnessInbox)
  const openImport = useAppStore((s) => s.openImport)
  const restThreshold = useAppStore((s) => s.settings.restThreshold)
  const restNudges = useAppStore((s) => s.settings.restNudges)

  return (
    <Overview
      sessions={sessions}
      fitnessInboxCount={fitnessInbox.length}
      onOpenImport={openImport}
      onNavCalendar={() => navigate('/calendar')}
      onOpenSession={(id) => navigate(`/session/${id}`)}
      restThreshold={restThreshold}
      restNudgesEnabled={restNudges}
    />
  )
}
