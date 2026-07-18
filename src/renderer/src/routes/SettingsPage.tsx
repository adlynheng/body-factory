import type { ReactNode } from 'react'
import { Settings } from '@renderer/features/settings'
import { useAppStore } from '@renderer/store/appStore'

/** `/settings` — app preferences + integrations. */
export function SettingsPage(): ReactNode {
  const settings = useAppStore((s) => s.settings)
  const changeSetting = useAppStore((s) => s.changeSetting)
  const health = useAppStore((s) => s.health)
  const evolt = useAppStore((s) => s.evolt)
  const toggleHealth = useAppStore((s) => s.toggleHealth)
  const toggleEvolt = useAppStore((s) => s.toggleEvolt)
  const syncHealth = useAppStore((s) => s.syncHealth)
  const syncEvolt = useAppStore((s) => s.syncEvolt)
  const sessions = useAppStore((s) => s.sessions)
  const resetData = useAppStore((s) => s.resetData)

  return (
    <Settings
      settings={settings}
      onChangeSetting={changeSetting}
      health={health}
      onToggleHealth={toggleHealth}
      onSyncHealth={syncHealth}
      evolt={evolt}
      onToggleEvolt={toggleEvolt}
      onSyncEvolt={syncEvolt}
      sessions={sessions}
      onResetData={resetData}
    />
  )
}
