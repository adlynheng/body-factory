import { useState } from 'react'
import { AppShell } from '@renderer/components/layout/AppShell'
import { Sidebar } from '@renderer/components/layout/Sidebar'
import { ThemeToggle } from '@renderer/components/layout/ThemeToggle'
import { Titlebar } from '@renderer/components/layout/Titlebar'
import { EmptyState } from '@renderer/components/ui/EmptyState'
import { Icon, IconProvider, type IconName } from '@renderer/components/ui/Icon'
import { TooltipProvider } from '@renderer/components/ui/Tooltip'
import {
  AddSessionModal,
  defaultPlanned,
  INITIAL_SESSIONS,
  TODAY,
  type NewSessionInput,
  type Session
} from '@renderer/features/sessions'
import { isoDate } from '@renderer/lib/date'
import { Overview } from '@renderer/features/overview'
import { Calendar } from '@renderer/features/calendar'
import {
  ImportPicker,
  seedFitnessInbox,
  workoutToActual,
  type FitnessWorkout
} from '@renderer/features/import'
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
  const [sessions, setSessions] = useState(INITIAL_SESSIONS)
  const [fitnessInbox, setFitnessInbox] = useState<FitnessWorkout[]>(seedFitnessInbox)
  const [importOpen, setImportOpen] = useState(false)
  const [addingForDate, setAddingForDate] = useState<string | null>(null)

  const moveSession = (id: string, date: string): void => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, date } : s)))
  }

  const createSession = ({ type, subtype, date, title, description }: NewSessionInput): void => {
    const session: Session = {
      id: `s${Date.now()}`,
      date,
      type,
      subtype,
      title: title.trim(),
      description: description.trim(),
      planned: defaultPlanned(type),
      actual: null,
      notes: ''
    }
    setSessions((prev) => [...prev, session])
  }

  const importToSession = (workout: FitnessWorkout, targetId: string): void => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === targetId ? { ...s, actual: workoutToActual(workout, s.type), missed: false } : s
      )
    )
    setFitnessInbox((prev) => prev.filter((w) => w.id !== workout.id))
  }

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
                sessions={sessions}
                fitnessInboxCount={fitnessInbox.length}
                onOpenImport={() => setImportOpen(true)}
                onNavCalendar={() => setActive('calendar')}
              />
            ) : active === 'calendar' ? (
              <Calendar
                sessions={sessions}
                onMoveSession={moveSession}
                onAddSession={setAddingForDate}
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

      <ImportPicker
        open={importOpen}
        onOpenChange={setImportOpen}
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
    </TooltipProvider>
  )
}

function App(): React.JSX.Element {
  // Dev surface: the primitive gallery is still reachable at #gallery.
  const isGallery = typeof window !== 'undefined' && window.location.hash === '#gallery'
  return <IconProvider>{isGallery ? <Gallery /> : <MainApp />}</IconProvider>
  // return <IconProvider><Gallery /></IconProvider>
}

export default App
