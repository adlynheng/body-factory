import { create } from 'zustand'
import {
  defaultPlanned,
  INITIAL_SESSIONS,
  type NewSessionInput,
  type Session,
  type SessionTypeKey
} from '@renderer/features/sessions'
import { seedFitnessInbox, workoutToActual, type FitnessWorkout } from '@renderer/features/import'
import {
  DEFAULT_SETTINGS,
  type AppSettings,
  type IntegrationState
} from '@renderer/features/settings'
import { INITIAL_TEMPLATE, type TemplateEntry } from '@renderer/features/template'
import { addDays, isoDate, parseISO, setWeekStartDay } from '@renderer/lib/date'
import { setDistanceUnit } from '@renderer/lib/format'

/**
 * appStore — the app's single source of domain + overlay state. Lifted out of the
 * old `MainApp` component when the app moved to `react-router-dom`, so each route
 * page can read/write directly instead of prop-drilling through a layout hub.
 *
 * Navigation is deliberately NOT in the store: actions only mutate data. The one
 * place that used to jump screens (`applyTemplate` → calendar) now leaves that to
 * the calling page, which owns the router.
 */
export interface AppState {
  sessions: Session[]
  template: TemplateEntry[]
  settings: AppSettings
  health: IntegrationState
  evolt: IntegrationState
  fitnessInbox: FitnessWorkout[]

  /** Import picker open flag (Apple Fitness → session). */
  importOpen: boolean
  /** ISO date the Add-Session modal is open for, or null when closed. */
  addingForDate: string | null

  // sessions
  moveSession: (id: string, date: string) => void
  createSession: (input: NewSessionInput) => void
  importToSession: (workout: FitnessWorkout, targetId: string) => void
  resetData: () => void

  // template
  addTemplateEntry: (day: number, type: SessionTypeKey, subtype: string) => void
  removeTemplateEntry: (id: string) => void
  moveTemplateEntry: (id: string, day: number) => void
  /** Write the template across [startISO, endISO]; does not navigate. */
  applyTemplate: (tmpl: TemplateEntry[], startISO: string, endISO: string) => void

  // settings + integrations
  changeSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  toggleHealth: (next: boolean) => void
  toggleEvolt: (next: boolean) => void
  syncHealth: () => void
  syncEvolt: () => void

  // overlays
  openImport: () => void
  closeImport: () => void
  setAddingForDate: (date: string | null) => void
}

// Flip an integration's spinner on, then stamp "last synced" after a beat.
const runSync = (
  set: (fn: (s: AppState) => Partial<AppState>) => void,
  key: 'health' | 'evolt'
): void => {
  set((s) => ({ [key]: { ...s[key], syncing: true } }) as Partial<AppState>)
  window.setTimeout(() => {
    set(
      (s) => ({ [key]: { ...s[key], syncing: false, lastSynced: new Date() } }) as Partial<AppState>
    )
  }, 900)
}

const toggle = (prev: IntegrationState, next: boolean): IntegrationState => ({
  ...prev,
  connected: next,
  lastSynced: next ? (prev.lastSynced ?? new Date()) : prev.lastSynced
})

export const useAppStore = create<AppState>((set) => ({
  sessions: INITIAL_SESSIONS,
  template: INITIAL_TEMPLATE,
  settings: DEFAULT_SETTINGS,
  health: { connected: true, lastSynced: new Date(Date.now() - 8 * 60_000), syncing: false },
  evolt: { connected: false, lastSynced: null, syncing: false },
  fitnessInbox: seedFitnessInbox(),

  importOpen: false,
  addingForDate: null,

  moveSession: (id, date) =>
    set((s) => ({ sessions: s.sessions.map((x) => (x.id === id ? { ...x, date } : x)) })),

  createSession: ({ type, subtype, date, title, description }) =>
    set((s) => ({
      sessions: [
        ...s.sessions,
        {
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
      ]
    })),

  importToSession: (workout, targetId) =>
    set((s) => ({
      sessions: s.sessions.map((x) =>
        x.id === targetId ? { ...x, actual: workoutToActual(workout, x.type), missed: false } : x
      ),
      fitnessInbox: s.fitnessInbox.filter((w) => w.id !== workout.id)
    })),

  resetData: () => set({ sessions: INITIAL_SESSIONS, fitnessInbox: seedFitnessInbox() }),

  addTemplateEntry: (day, type, subtype) =>
    set((s) => ({
      template: [
        ...s.template,
        { id: `t${Date.now()}${Math.random().toString(36).slice(2, 6)}`, day, type, subtype }
      ]
    })),

  removeTemplateEntry: (id) => set((s) => ({ template: s.template.filter((e) => e.id !== id) })),

  moveTemplateEntry: (id, day) =>
    set((s) => ({ template: s.template.map((e) => (e.id === id ? { ...e, day } : e)) })),

  // Drop planned (incomplete) sessions in range, keep completed ones, then lay
  // down one session per matching day-of-week across [start, end].
  applyTemplate: (tmpl, startISO, endISO) => {
    const start = parseISO(startISO)
    const end = parseISO(endISO)
    set((s) => {
      const kept = s.sessions.filter((sess) => {
        const d = parseISO(sess.date)
        const inRange = d >= start && d <= end
        return !inRange || sess.actual != null
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
      return { sessions: [...kept, ...added] }
    })
  },

  // Settings changes that also drive module-level app behavior are applied here,
  // where the state lives: distance formatting + calendar week-start.
  changeSetting: (key, value) => {
    set((s) => ({ settings: { ...s.settings, [key]: value } }))
    if (key === 'units') setDistanceUnit(value as AppSettings['units'])
    if (key === 'weekStart') setWeekStartDay(value === 'mon' ? 1 : 0)
  },

  toggleHealth: (next) => set((s) => ({ health: toggle(s.health, next) })),
  toggleEvolt: (next) => set((s) => ({ evolt: toggle(s.evolt, next) })),
  syncHealth: () => runSync(set, 'health'),
  syncEvolt: () => runSync(set, 'evolt'),

  openImport: () => set({ importOpen: true }),
  closeImport: () => set({ importOpen: false }),
  setAddingForDate: (date) => set({ addingForDate: date })
}))
