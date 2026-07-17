import type { ReactNode } from 'react'
import { Button } from '@renderer/components/ui/Button'
import { Card } from '@renderer/components/ui/Card'
import { NumberField } from '@renderer/components/ui/NumberField'
import { SegControl } from '@renderer/components/ui/SegControl'
import { SettingRow } from '@renderer/components/ui/SettingRow'
import { Switch } from '@renderer/components/ui/Switch'
import type { Session } from '@renderer/features/sessions'
import { cn } from '@renderer/lib/utils'
import { ConnectionCard } from './ConnectionCard'
import type { AppSettings } from './types'

export interface IntegrationState {
  connected: boolean
  lastSynced: Date | null
  syncing: boolean
}

export interface SettingsProps {
  settings: AppSettings
  onChangeSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  health: IntegrationState
  onToggleHealth: (next: boolean) => void
  onSyncHealth: () => void
  evolt: IntegrationState
  onToggleEvolt: (next: boolean) => void
  onSyncEvolt: () => void
  sessions: Session[]
  onResetData: () => void
}

/** Section frame — design's `.bf-card` with the uppercase `.bf-card-title`. */
function Section({ title, children }: { title: string; children: ReactNode }): ReactNode {
  return (
    <Card className="p-5">
      <h2 className="mb-4 text-[13px] font-bold uppercase tracking-[0.06em] text-text-secondary">
        {title}
      </h2>
      {children}
    </Card>
  )
}

/** Stack of SettingRows with dividers between (design's `.bf-set-row` borders). */
function Rows({ children }: { children: ReactNode }): ReactNode {
  return <div className="flex flex-col divide-y divide-border-subtle">{children}</div>
}

/**
 * SettingsView — app preferences (design's `SettingsView`): Apple Health &
 * Evolt integrations, units, calendar, notifications, and data export/reset.
 * Reuses `SettingRow` + `SegControl` + `Switch` + `NumberField`; the two
 * integration cards share `ConnectionCard`.
 */
export function Settings({
  settings,
  onChangeSetting,
  health,
  onToggleHealth,
  onSyncHealth,
  evolt,
  onToggleEvolt,
  onSyncEvolt,
  sessions,
  onResetData
}: SettingsProps): ReactNode {
  const exportData = (): void => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'body-factory-export.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto px-8 pb-[60px] pt-7">
      <div className="w-full max-w-[720px]">
        <header className="mb-[22px]">
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-text-primary">
            Settings
          </h1>
          <p className="mt-1 text-[12.5px] text-text-tertiary">Preferences for Body Factory</p>
        </header>

        <div className="flex flex-col gap-4">
          <Section title="Apple Health">
            <ConnectionCard
              icon="health"
              accent="#ff6b8b"
              accentSoft="rgba(255,60,96,0.12)"
              connected={health.connected}
              offerText="Connect to auto-sync workouts, heart rate, and steps."
              lastSynced={health.lastSynced}
              syncing={health.syncing}
              types={['Workouts', 'Heart Rate', 'Distance', 'Steps']}
              onSyncNow={onSyncHealth}
              onToggle={onToggleHealth}
              pulse="animated"
            />
          </Section>

          <Section title="Evolt Active">
            <ConnectionCard
              icon="evolt"
              accent="#6be0c8"
              accentSoft="rgba(107,224,200,0.14)"
              connected={evolt.connected}
              offerText="Connect to sync body composition from your Evolt 360 scans."
              lastSynced={evolt.lastSynced}
              syncing={evolt.syncing}
              types={['Body Fat', 'Muscle Mass', 'Weight', 'Body Age']}
              onSyncNow={onSyncEvolt}
              onToggle={onToggleEvolt}
              pulse="static"
            />
          </Section>

          <Section title="Units">
            <SettingRow label="Distance" description="Used across runs, trends, and comparisons.">
              <SegControl
                aria-label="Distance units"
                value={settings.units}
                options={[
                  { value: 'km', label: 'Kilometers' },
                  { value: 'mi', label: 'Miles' }
                ]}
                onValueChange={(v) => onChangeSetting('units', v as AppSettings['units'])}
              />
            </SettingRow>
          </Section>

          <Section title="Calendar">
            <Rows>
              <SettingRow label="Week starts on" description="Applies to month and week views.">
                <SegControl
                  aria-label="Week starts on"
                  value={settings.weekStart}
                  options={[
                    { value: 'mon', label: 'Monday' },
                    { value: 'sun', label: 'Sunday' }
                  ]}
                  onValueChange={(v) => onChangeSetting('weekStart', v as AppSettings['weekStart'])}
                />
              </SettingRow>
              <SettingRow label="Default view" description="What the calendar opens to.">
                <SegControl
                  aria-label="Default view"
                  value={settings.defaultView}
                  options={[
                    { value: 'month', label: 'Month' },
                    { value: 'week', label: 'Week' }
                  ]}
                  onValueChange={(v) =>
                    onChangeSetting('defaultView', v as AppSettings['defaultView'])
                  }
                />
              </SettingRow>
            </Rows>
          </Section>

          <Section title="Notifications">
            <Rows>
              <SettingRow
                label="Session reminders"
                description="A nudge shortly before each planned session."
              >
                <Switch
                  aria-label="Session reminders"
                  checked={settings.reminders}
                  onCheckedChange={(v) => onChangeSetting('reminders', v)}
                />
              </SettingRow>
              <SettingRow
                label="Rest day suggestions"
                description={`Flag when you've gone ${settings.restThreshold}+ days without rest.`}
              >
                <NumberField
                  aria-label="Rest day threshold"
                  min={1}
                  max={14}
                  value={settings.restThreshold}
                  onValueChange={(v) =>
                    onChangeSetting('restThreshold', Math.max(1, Math.min(14, v ?? 1)))
                  }
                  suffix="days"
                />
                <Switch
                  aria-label="Rest day suggestions"
                  checked={settings.restNudges}
                  onCheckedChange={(v) => onChangeSetting('restNudges', v)}
                />
              </SettingRow>
            </Rows>
          </Section>

          <Section title="Data">
            <Rows>
              <SettingRow
                label="Export training data"
                description="Download all sessions as a JSON file."
              >
                <Button variant="soft" onClick={exportData}>
                  Export
                </Button>
              </SettingRow>
              <SettingRow
                label="Reset to demo data"
                description="Discard changes and reload the sample schedule."
              >
                <Button
                  variant="soft"
                  onClick={onResetData}
                  className={cn(
                    'text-text-secondary',
                    'hover:border-danger hover:bg-surface-card hover:text-danger'
                  )}
                >
                  Reset
                </Button>
              </SettingRow>
            </Rows>
          </Section>
        </div>
      </div>
    </div>
  )
}
