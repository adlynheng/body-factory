import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { AppShell } from '@renderer/components/layout/AppShell'
import { Sidebar, sidebarItemClass, SidebarItemContent } from '@renderer/components/layout/Sidebar'
import { ThemeToggle } from '@renderer/components/layout/ThemeToggle'
import { Titlebar } from '@renderer/components/layout/Titlebar'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { AddSessionModal, TODAY } from '@renderer/features/sessions'
import { ImportPicker } from '@renderer/features/import'
import { SyncCard, timeAgo } from '@renderer/features/settings'
import { isoDate, MONTH_NAMES, weekNum } from '@renderer/lib/date'
import { useAppStore } from '@renderer/store/appStore'

/** Titlebar contextual label — the app's current period (week number · month). */
const PERIOD_LABEL = `Wk ${weekNum(TODAY)} · ${MONTH_NAMES[TODAY.getMonth()]} ${TODAY.getFullYear()}`

const NAV: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/', label: 'Overview', icon: 'overview', end: true },
  { to: '/calendar', label: 'Calendar', icon: 'calendar' },
  { to: '/weekly-template', label: 'Weekly Template', icon: 'template' },
  { to: '/trends', label: 'Trends', icon: 'trends' },
  { to: '/settings', label: 'Settings', icon: 'settings' }
]

/**
 * RootLayout — the persistent app chrome (titlebar, sidebar, sync cards) with the
 * active route rendered into `<Outlet/>`. Nav rows are real `NavLink`s so the
 * browser/history treats them as navigation and `aria-current` tracks the route.
 * The global overlays (import picker, add-session modal) live here since they can
 * be triggered from any page and read their state from the store.
 */
export function RootLayout(): ReactNode {
  const health = useAppStore((s) => s.health)
  const evolt = useAppStore((s) => s.evolt)
  const toggleHealth = useAppStore((s) => s.toggleHealth)
  const toggleEvolt = useAppStore((s) => s.toggleEvolt)

  const importOpen = useAppStore((s) => s.importOpen)
  const closeImport = useAppStore((s) => s.closeImport)
  const fitnessInbox = useAppStore((s) => s.fitnessInbox)
  const sessions = useAppStore((s) => s.sessions)
  const importToSession = useAppStore((s) => s.importToSession)

  const addingForDate = useAppStore((s) => s.addingForDate)
  const setAddingForDate = useAppStore((s) => s.setAddingForDate)
  const createSession = useAppStore((s) => s.createSession)

  return (
    <>
      <AppShell>
        <Titlebar logo={<Icon name="run" />} title="Body Factory" meta={PERIOD_LABEL}>
          <ThemeToggle />
        </Titlebar>
        <AppShell.Body>
          <Sidebar>
            <Sidebar.Section>
              <Sidebar.Label>Workspace</Sidebar.Label>
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) => sidebarItemClass(isActive)}
                >
                  <SidebarItemContent icon={n.icon} label={n.label} />
                </NavLink>
              ))}
            </Sidebar.Section>
            <Sidebar.Spacer />
            <Sidebar.Footer>
              <SyncCard
                name="Apple Health"
                connectTitle="Connect Apple Health"
                offerText="Auto-sync runs, HR, and workouts from your iPhone."
                icon="health"
                iconColor="#ff6b8b"
                iconSoft="rgba(255,60,96,0.12)"
                connected={health.connected}
                lastSyncedLabel={timeAgo(health.lastSynced)}
                stats={[
                  { value: '9', label: 'workouts' },
                  { value: '142', label: 'bpm' },
                  { value: '7,124', label: 'steps' }
                ]}
                onConnect={() => toggleHealth(true)}
              />
              <SyncCard
                name="Evolt Active"
                connectTitle="Connect Evolt Active"
                offerText="Sync body composition from your Evolt 360 scans."
                icon="evolt"
                iconColor="#6be0c8"
                iconSoft="rgba(107,224,200,0.14)"
                connected={evolt.connected}
                lastSyncedLabel={timeAgo(evolt.lastSynced)}
                stats={[
                  { value: '14.2', label: '% fat' },
                  { value: '36.1', label: 'muscle' },
                  { value: '72.4', label: 'kg' }
                ]}
                pulseColor="#6be0c8"
                onConnect={() => toggleEvolt(true)}
              />
            </Sidebar.Footer>
          </Sidebar>
          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
        </AppShell.Body>
      </AppShell>

      <ImportPicker
        open={importOpen}
        onOpenChange={(o) => !o && closeImport()}
        inbox={fitnessInbox}
        sessions={sessions}
        onImport={importToSession}
      />

      <AddSessionModal
        open={addingForDate != null}
        onOpenChange={(o) => !o && setAddingForDate(null)}
        date={addingForDate ?? isoDate(TODAY)}
        onCreate={createSession}
      />
    </>
  )
}
