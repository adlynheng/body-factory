import { useState, type ReactNode } from 'react'
import { Button } from '@renderer/components/ui/Button'
import { CardSelect } from '@renderer/components/ui/CardSelect'
import { Dialog } from '@renderer/components/ui/Dialog'
import { SESSION_TYPES, type SessionTypeKey } from '@renderer/features/sessions'
import { DAY_NAMES_LONG } from '@renderer/lib/date'

export interface AddTemplateEntryModalProps {
  /** Day-of-week index (0 = Mon) the entry is being added to, or null when closed. */
  dayIdx: number | null
  onOpenChange: (open: boolean) => void
  onCreate: (dayIdx: number, type: SessionTypeKey, subtype: string) => void
}

/**
 * AddTemplateEntryModal — picks a type, then a subtype (design's
 * `AddTemplateEntryModal`). Simpler than the calendar's New Session dialog:
 * clicking a subtype creates the entry immediately and closes. Built on the
 * `Dialog` primitive; reuses `CardSelect` for the type grid.
 */
export function AddTemplateEntryModal({
  dayIdx,
  onOpenChange,
  onCreate
}: AddTemplateEntryModalProps): ReactNode {
  const open = dayIdx != null
  const [type, setType] = useState<SessionTypeKey>('run')

  // Reset to Run each time the modal opens (adjust state during render).
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setType('run')
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>New Template Entry</Dialog.Title>
          {dayIdx != null && (
            <span className="text-[12.5px] font-semibold text-text-tertiary">
              {DAY_NAMES_LONG[dayIdx]}
            </span>
          )}
        </Dialog.Header>

        <Dialog.Body className="flex flex-col gap-[18px]">
          <Section label="Type">
            <CardSelect
              aria-label="Entry type"
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
            <div className="flex flex-col gap-1">
              {SESSION_TYPES[type].subtypes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => dayIdx != null && onCreate(dayIdx, type, s)}
                  className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-3 text-left text-[13px] font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                >
                  {s}
                  <span className="text-base text-text-tertiary" aria-hidden="true">
                    ›
                  </span>
                </button>
              ))}
            </div>
          </Section>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.Close render={<Button variant="soft">Cancel</Button>} />
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
