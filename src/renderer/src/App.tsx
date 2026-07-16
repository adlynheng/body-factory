import { useState } from 'react'
import { AppShell } from '@renderer/components/layout/AppShell'
import { Sidebar } from '@renderer/components/layout/Sidebar'
import { ThemeToggle } from '@renderer/components/layout/ThemeToggle'
import { Titlebar } from '@renderer/components/layout/Titlebar'
import { EmptyState } from '@renderer/components/ui/EmptyState'
import { Icon, IconProvider, type IconName } from '@renderer/components/ui/Icon'
import { TooltipProvider } from '@renderer/components/ui/Tooltip'
import { INITIAL_SESSIONS } from '@renderer/features/sessions'
import { Overview } from '@renderer/features/overview'
import { Gallery } from '@renderer/dev/Gallery'

type ScreenId = 'home' | 'calendar' | 'template' | 'trends' | 'settings'

const NAV: { id: ScreenId; label: string; icon: IconName }[] = [
  { id: 'home', label: 'Overview', icon: 'overview' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'template', label: 'Weekly Template', icon: 'template' },
  { id: 'trends', label: 'Trends', icon: 'trends' },
  { id: 'settings', label: 'Settings', icon: 'settings' }
]

function MainApp(): React.JSX.Element {
  const [active, setActive] = useState<ScreenId>('home')

  return (
    <TooltipProvider>
      <AppShell>
        <Titlebar logo={<Icon name="run" />} title="Body Factory" meta="Wk 22 · May 2026">
          <ThemeToggle />
        </Titlebar>
        <AppShell.Body>
          <Sidebar>
            <Sidebar.Section>
              <Sidebar.Label>Workspace</Sidebar.Label>
              {NAV.map((n) => (
                <Sidebar.Item
                  key={n.id}
                  icon={n.icon}
                  label={n.label}
                  active={active === n.id}
                  onClick={() => setActive(n.id)}
                />
              ))}
            </Sidebar.Section>
            <Sidebar.Spacer />
          </Sidebar>
          <AppShell.Main>
            {active === 'home' ? (
              <Overview
                sessions={INITIAL_SESSIONS}
                fitnessInboxCount={3}
                onNavCalendar={() => setActive('calendar')}
              />
            ) : (
              <div className="grid h-full place-items-center p-8">
                <EmptyState
                  icon={NAV.find((n) => n.id === active)?.icon ?? 'calendar'}
                  title={`${NAV.find((n) => n.id === active)?.label} — coming soon`}
                  description="This screen isn't built yet. Overview is live with mock data."
                />
              </div>
            )}
          </AppShell.Main>
        </AppShell.Body>
      </AppShell>
    </TooltipProvider>
  )
}

function App(): React.JSX.Element {
  // Dev surface: the primitive gallery is still reachable at #gallery.
  const isGallery = typeof window !== 'undefined' && window.location.hash === '#gallery'
  return <IconProvider>{isGallery ? <Gallery /> : <MainApp />}</IconProvider>
}

export default App
