import { useState, type ReactNode } from 'react'
import { Button } from '@renderer/components/ui/Button'
import { CardSelect } from '@renderer/components/ui/CardSelect'
import { DatePicker } from '@renderer/components/ui/DatePicker'
import { Dialog } from '@renderer/components/ui/Dialog'
import { TextField } from '@renderer/components/ui/TextField'
import { Textarea } from '@renderer/components/ui/Textarea'
import { isoDate, parseISO } from '@renderer/lib/date'
import { cn } from '@renderer/lib/utils'
import { SESSION_TYPES, type SessionTypeKey } from './types'

export interface NewSessionInput {
  type: SessionTypeKey
  subtype: string
  date: string
  title: string
  description: string
}

export interface AddSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** ISO date the session is being created for (the day the user clicked). */
  date: string
  onCreate: (input: NewSessionInput) => void
}

/**
 * AddSessionModal — the New Session dialog (design's `AddSessionModal`): title,
 * description, date, a type-card grid, and a subtype list. Built on the `Dialog`
 * primitive; reuses `CardSelect` for the type grid and `DatePicker` for the
 * date. Fields reset each time it opens for a new day.
 */
export function AddSessionModal({
  open,
  onOpenChange,
  date,
  onCreate
}: AddSessionModalProps): ReactNode {
  const [type, setType] = useState<SessionTypeKey>('run')
  const [subtype, setSubtype] = useState<string>(SESSION_TYPES.run.subtypes[0])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selDate, setSelDate] = useState(date)

  // Reset the form each time the modal opens for a (possibly new) date. React's
  // "adjust state during render" pattern — no effect, keeps the same instance.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setType('run')
      setSubtype(SESSION_TYPES.run.subtypes[0])
      setTitle('')
      setDescription('')
      setSelDate(date)
    }
  }

  // Keep subtype valid when the type changes.
  const [prevType, setPrevType] = useState(type)
  if (type !== prevType) {
    setPrevType(type)
    setSubtype(SESSION_TYPES[type].subtypes[0])
  }

  const create = (): void => {
    onCreate({ type, subtype, date: selDate, title, description })
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>New Session</Dialog.Title>
        </Dialog.Header>

        <Dialog.Body className="flex flex-col gap-[18px]">
          <Section label="Title">
            <TextField
              value={title}
              placeholder={subtype}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Section>

          <Section label="Description">
            <Textarea
              value={description}
              rows={3}
              placeholder="Add a short note about this session…"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Section>

          <Section label="Date">
            <DatePicker
              aria-label="Session date"
              value={parseISO(selDate)}
              onChange={(d) => d && setSelDate(isoDate(d))}
              side="top"
              className="w-full justify-between"
            />
          </Section>

          <Section label="Type">
            <CardSelect
              aria-label="Session type"
              value={type}
              onValueChange={(v) => setType(v as SessionTypeKey)}
              columns={4}
              options={Object.values(SESSION_TYPES).map((t) => ({
                value: t.key,
                label: t.label,
                color: t.color
              }))}
            />
          </Section>

          <Section label="Subtype">
            <SubtypeList
              subtypes={SESSION_TYPES[type].subtypes}
              value={subtype}
              onChange={setSubtype}
            />
          </Section>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close render={<Button variant="soft">Cancel</Button>} />
          <Button variant="solid" onClick={create}>
            Create
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }): ReactNode {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-text-tertiary">
        {label}
      </span>
      {children}
    </div>
  )
}

/**
 * SubtypeList — the modal's vertical, full-width subtype picker (design's
 * `.bf-subtype-card`): the selected row inverts to a filled pill with a check.
 * A `radiogroup` for keyboard/AT semantics.
 */
function SubtypeList({
  subtypes,
  value,
  onChange
}: {
  subtypes: string[]
  value: string
  onChange: (v: string) => void
}): ReactNode {
  return (
    <div role="radiogroup" aria-label="Subtype" className="flex flex-col gap-1">
      {subtypes.map((s) => {
        const on = s === value
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(s)}
            className={cn(
              'flex items-center justify-between rounded-lg border px-3.5 py-3 text-left text-[13px] font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
              on
                ? 'border-text-primary bg-text-primary text-surface'
                : 'border-border-subtle bg-surface-raised text-text-primary hover:border-border-strong hover:bg-surface-hover'
            )}
          >
            {s}
            <span className="text-base" aria-hidden="true">
              {on ? '✓' : ''}
            </span>
          </button>
        )
      })}
    </div>
  )
}
