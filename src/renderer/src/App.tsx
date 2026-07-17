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
  type Session,
  type SessionTypeKey
} from '@renderer/features/sessions'
import { addDays, isoDate, parseISO, setWeekStartDay } from '@renderer/lib/date'
import { setDistanceUnit } from '@renderer/lib/format'
import { Overview } from '@renderer/features/overview'
import { Calendar } from '@renderer/features/calendar'
import { Template, INITIAL_TEMPLATE, type TemplateEntry } from '@renderer/features/template'
import {
  Settings,
  SyncCard,
  timeAgo,
  DEFAULT_SETTINGS,
  type AppSettings,
  type IntegrationState
} from '@renderer/features/settings'
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
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [health, setHealth] = useState<IntegrationState>(() => ({
    connected: true,
    lastSynced: new Date(Date.now() - 8 * 60_000),
    syncing: false
  }))
  const [evolt, setEvolt] = useState<IntegrationState>({
    connected: false,
    lastSynced: null,
    syncing: false
  })
  const [template, setTemplate] = useState<TemplateEntry[]>(INITIAL_TEMPLATE)

  const addTemplateEntry = (day: number, type: SessionTypeKey, subtype: string): void => {
    setTemplate((prev) => [
      ...prev,
      { id: `t${Date.now()}${Math.random().toString(36).slice(2, 6)}`, day, type, subtype }
    ])
  }
  const removeTemplateEntry = (id: string): void => {
    setTemplate((prev) => prev.filter((e) => e.id !== id))
  }
  const moveTemplateEntry = (id: string, day: number): void => {
    setTemplate((prev) => prev.map((e) => (e.id === id ? { ...e, day } : e)))
  }

  // Write the template across [start, end]: drop planned (incomplete) sessions
  // in range, keep completed ones, then lay down one session per matching
  // day-of-week. Jumps to the calendar so the result is visible.
  const applyTemplate = (tmpl: TemplateEntry[], startISO: string, endISO: string): void => {
    const start = parseISO(startISO)
    const end = parseISO(endISO)
    setSessions((prev) => {
      const kept = prev.filter((s) => {
        const d = parseISO(s.date)
        const inRange = d >= start && d <= end
        return !inRange || s.actual != null
      })
      const added: Session[] = []
      let i = 0
      for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
        const dayIdx = (d.getDay() + 6) % 7
        for (const e of tmpl) {
          if (e.day !== dayIdx) continue
          added.push({
            id: `s${Date.now()}-${i++}`,
            date: isoDate(d),
            type: e.type,
            subtype: e.subtype,
            title: '',
            description: '',
            planned: defaultPlanned(e.type),
            actual: null,
            notes: ''
          })
        }
      }
      return [...kept, ...added]
    })
    setActive('calendar')
  }

  const moveSession = (id: string, date: string): void => {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, date } : s)))
  }

  // Settings changes that also drive module-level app behavior are applied here,
  // where the state lives: distance formatting + calendar week-start.
  const changeSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]): void => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    if (key === 'units') setDistanceUnit(value as AppSettings['units'])
    if (key === 'weekStart') setWeekStartDay(value === 'mon' ? 1 : 0)
  }

  // Mock a short sync: flip the spinner on, then stamp "last synced" after a beat.
  const runSync = (set: typeof setHealth): void => {
    set((p) => ({ ...p, syncing: true }))
    window.setTimeout(() => set((p) => ({ ...p, syncing: false, lastSynced: new Date() })), 900)
  }

  const toggleIntegration = (set: typeof setHealth, next: boolean): void => {
    set((p) => ({
      ...p,
      connected: next,
      lastSynced: next ? (p.lastSynced ?? new Date()) : p.lastSynced
    }))
  }

  const resetData = (): void => {
    setSessions(INITIAL_SESSIONS)
    setFitnessInbox(seedFitnessInbox())
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
                onConnect={() => toggleIntegration(setHealth, true)}
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
                onConnect={() => toggleIntegration(setEvolt, true)}
              />
            </Sidebar.Footer>
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
            ) : active === 'template' ? (
              <Template
                template={template}
                onAddEntry={addTemplateEntry}
                onRemoveEntry={removeTemplateEntry}
                onMoveEntry={moveTemplateEntry}
                onApply={applyTemplate}
              />
            ) : active === 'settings' ? (
              <Settings
                settings={settings}
                onChangeSetting={changeSetting}
                health={health}
                onToggleHealth={(next) => toggleIntegration(setHealth, next)}
                onSyncHealth={() => runSync(setHealth)}
                evolt={evolt}
                onToggleEvolt={(next) => toggleIntegration(setEvolt, next)}
                onSyncEvolt={() => runSync(setEvolt)}
                sessions={sessions}
                onResetData={resetData}
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
