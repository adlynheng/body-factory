import { useMemo, useState, type ReactNode } from 'react'
import { Button } from '@renderer/components/ui/Button'
import { Dialog } from '@renderer/components/ui/Dialog'
import { Icon } from '@renderer/components/ui/Icon'
import { SESSION_TYPES, sessionLabel, type Session } from '@renderer/features/sessions'
import { DAY_NAMES_LONG, MONTH_NAMES, parseISO } from '@renderer/lib/date'
import { fmtDistance, fmtTime } from '@renderer/lib/format'
import { cn } from '@renderer/lib/utils'
import type { FitnessWorkout } from './fitnessInbox'

export interface ImportPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inbox: FitnessWorkout[]
  sessions: Session[]
  /** Sync a recorded workout onto a planned session. */
  onImport: (workout: FitnessWorkout, targetSessionId: string) => void
}

const DAY_MS = 86400000

function longDate(iso: string): string {
  const d = parseISO(iso)
  return `${DAY_NAMES_LONG[(d.getDay() + 6) % 7]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`
}

/**
 * ImportPicker — the Apple Fitness import modal (design's `ImportPicker`, banner
 * flow): choose a recorded workout, then the planned session to sync it onto.
 * Candidate sessions are the still-incomplete ones of the same type, ranked by
 * how close their date is to the workout's. Built on the `Dialog` primitive.
 */
export function ImportPicker({
  open,
  onOpenChange,
  inbox,
  sessions,
  onImport
}: ImportPickerProps): ReactNode {
  const [pickId, setPickId] = useState<string | null>(inbox[0]?.id ?? null)
  const [targetId, setTargetId] = useState<string | null>(null)

  // Fresh selection each time the picker opens (the modal stays mounted, so a
  // reopened picker must not point at an already-imported workout). React's
  // "adjust state during render" pattern — no effect, same instance.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setPickId(inbox[0]?.id ?? null)
      setTargetId(null)
    }
  }

  const workout = inbox.find((w) => w.id === pickId) ?? null

  // Candidate sessions: not completed, same type, nearest date first.
  const candidates = useMemo(() => {
    if (!workout) return []
    const wDate = parseISO(workout.date).getTime()
    return sessions
      .filter((s) => s.actual == null && s.type === workout.type)
      .map((s) => ({ s, gap: Math.abs((parseISO(s.date).getTime() - wDate) / DAY_MS) }))
      .sort((a, b) => a.gap - b.gap)
      .slice(0, 6)
      .map((x) => x.s)
  }, [workout, sessions])

  const pickWorkout = (id: string): void => {
    setPickId(id)
    setTargetId(null)
  }

  const confirm = (): void => {
    if (workout && targetId) {
      onImport(workout, targetId)
      onOpenChange(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Import from Apple Fitness</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body>
          {inbox.length === 0 ? (
            <p className="px-0.5 py-2 text-[12.5px] text-text-tertiary">
              No new workouts to import. You&apos;re all synced up.
            </p>
          ) : (
            <>
              <SectionLabel className="mt-0">New workouts ({inbox.length})</SectionLabel>
              {inbox.map((w) => (
                <WorkoutRow
                  key={w.id}
                  workout={w}
                  selected={w.id === pickId}
                  onSelect={() => pickWorkout(w.id)}
                />
              ))}

              {workout && (
                <>
                  <SectionLabel>Sync “{workout.name}” to which session?</SectionLabel>
                  {candidates.length === 0 ? (
                    <p className="px-0.5 py-2 text-[12.5px] text-text-tertiary">
                      No matching planned {SESSION_TYPES[workout.type].label.toLowerCase()} sessions
                      to sync to.
                    </p>
                  ) : (
                    candidates.map((s) => (
                      <TargetRow
                        key={s.id}
                        session={s}
                        selected={s.id === targetId}
                        onSelect={() => setTargetId(s.id)}
                      />
                    ))
                  )}
                </>
              )}
            </>
          )}
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close render={<Button variant="soft">Close</Button>} />
          <Button variant="solid" disabled={!targetId} onClick={confirm}>
            Confirm
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

function SectionLabel({
  className,
  children
}: {
  className?: string
  children: ReactNode
}): ReactNode {
  return (
    <div className={cn('mb-2.5 mt-4 text-[13px] font-bold text-text-secondary', className)}>
      {children}
    </div>
  )
}

/** Shared row shell for both workout and target rows (design's `.bf-imp-workout`). */
function ImpRow({
  selected,
  onSelect,
  children
}: {
  selected: boolean
  onSelect: () => void
  children: ReactNode
}): ReactNode {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'mb-2 flex w-full items-center gap-3.5 rounded-xl border px-[15px] py-[13px] text-left transition-[border-color,background-color]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        selected
          ? 'border-success bg-[color-mix(in_oklab,var(--bf-success)_8%,var(--bf-bg-card-2))]'
          : 'border-border-subtle bg-surface-raised hover:border-border-strong hover:bg-surface-hover'
      )}
    >
      {children}
    </button>
  )
}

function TypeIcon({ type }: { type: FitnessWorkout['type'] | Session['type'] }): ReactNode {
  const t = SESSION_TYPES[type]
  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded-[11px] text-lg"
      style={{ background: `color-mix(in oklab, ${t.color} 18%, transparent)`, color: t.color }}
    >
      <Icon name={type === 'run' ? 'distance' : 'duration'} />
    </span>
  )
}

function WorkoutRow({
  workout: w,
  selected,
  onSelect
}: {
  workout: FitnessWorkout
  selected: boolean
  onSelect: () => void
}): ReactNode {
  const isRun = w.type === 'run'
  return (
    <ImpRow selected={selected} onSelect={onSelect}>
      <TypeIcon type={w.type} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-[13.5px] font-bold text-text-primary">{w.name}</span>
        <span className="truncate text-[12px] text-text-tertiary">
          {w.source} · {longDate(w.date)}
        </span>
      </span>
      <span className="flex shrink-0 gap-5">
        {isRun ? (
          <>
            <Stat value={fmtDistance(w.distance ?? 0)} caption="Distance" />
            <Stat value={fmtTime(w.time ?? 0)} caption="Time" />
          </>
        ) : (
          <Stat value={`${w.duration} min`} caption="Time" />
        )}
      </span>
    </ImpRow>
  )
}

function Stat({ value, caption }: { value: string; caption: string }): ReactNode {
  return (
    <span className="flex flex-col gap-[3px] text-right">
      <span className="mono text-[13px] font-bold text-text-primary">{value}</span>
      <span className="text-[10.5px] text-text-tertiary">{caption}</span>
    </span>
  )
}

function TargetRow({
  session: s,
  selected,
  onSelect
}: {
  session: Session
  selected: boolean
  onSelect: () => void
}): ReactNode {
  const t = SESSION_TYPES[s.type]
  return (
    <ImpRow selected={selected} onSelect={onSelect}>
      <TypeIcon type={s.type} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-[13.5px] font-bold text-text-primary">
          {sessionLabel(s)}
        </span>
        <span className="truncate text-[12px] text-text-tertiary">
          {t.label} · {s.subtype} · {longDate(s.date)}
        </span>
      </span>
      <span
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[13px] font-extrabold text-white',
          selected ? 'border-success bg-success' : 'border-border-strong'
        )}
        aria-hidden="true"
      >
        {selected ? '✓' : ''}
      </span>
    </ImpRow>
  )
}
