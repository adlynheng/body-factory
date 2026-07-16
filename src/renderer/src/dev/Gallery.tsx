import { useState, type ReactNode } from 'react'
import { AppShell } from '@renderer/components/layout/AppShell'
import { Sidebar } from '@renderer/components/layout/Sidebar'
import { ThemeToggle } from '@renderer/components/layout/ThemeToggle'
import { Titlebar } from '@renderer/components/layout/Titlebar'
import { Badge } from '@renderer/components/ui/Badge'
import { Banner } from '@renderer/components/ui/Banner'
import { Button } from '@renderer/components/ui/Button'
import { Callout } from '@renderer/components/ui/Callout'
import { Card } from '@renderer/components/ui/Card'
import { CardSelect } from '@renderer/components/ui/CardSelect'
import { ChipSelect } from '@renderer/components/ui/ChipSelect'
import { Collapsible } from '@renderer/components/ui/Collapsible'
import { CompareBars } from '@renderer/components/ui/CompareBars'
import { CompareDelta } from '@renderer/components/ui/CompareDelta'
import { DatePicker } from '@renderer/components/ui/DatePicker'
import { Dialog } from '@renderer/components/ui/Dialog'
import { EditableText } from '@renderer/components/ui/EditableText'
import { EmptyState } from '@renderer/components/ui/EmptyState'
import { Field } from '@renderer/components/ui/Field'
import { Form } from '@renderer/components/ui/Form'
import { HRZoneBar } from '@renderer/components/ui/HRZoneBar'
import { Icon, iconRegistry, type IconName } from '@renderer/components/ui/Icon'
import { MetricCard, MetricCardGrid } from '@renderer/components/ui/MetricCard'
import { MetricsTable } from '@renderer/components/ui/MetricsTable'
import { NumberField } from '@renderer/components/ui/NumberField'
import { SegControl } from '@renderer/components/ui/SegControl'
import { SegmentBar } from '@renderer/components/ui/SegmentBar'
import { SettingRow } from '@renderer/components/ui/SettingRow'
import { Spinner } from '@renderer/components/ui/Spinner'
import { StatTile } from '@renderer/components/ui/StatTile'
import { StatusBadge } from '@renderer/components/ui/StatusBadge'
import { Switch } from '@renderer/components/ui/Switch'
import { SyncBadge } from '@renderer/components/ui/SyncBadge'
import { Tabs } from '@renderer/components/ui/Tabs'
import { TextField } from '@renderer/components/ui/TextField'
import { Textarea } from '@renderer/components/ui/Textarea'
import { Toolbar } from '@renderer/components/ui/Toolbar'
import { Tooltip, TooltipProvider } from '@renderer/components/ui/Tooltip'
import { Trendline } from '@renderer/components/ui/Trendline'

/**
 * Primitive Gallery — a development-only surface for building and eyeballing
 * design-system primitives in isolation, before they're composed into feature
 * screens. Each phase adds a section here. Not shipped in the real app shell.
 */
export function Gallery(): ReactNode {
  return (
    <TooltipProvider>
      <div className="min-h-screen px-8 py-10">
        <header className="mx-auto mb-10 max-w-5xl">
          <p className="text-2xs font-bold uppercase tracking-widest text-text-tertiary">
            Body Factory
          </p>
          <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-text-primary">
            Primitive Gallery
          </h1>
          <p className="mt-2 max-w-prose text-sm text-text-secondary">
            Design-system primitives in isolation. Sections are added phase by phase as each
            primitive is built.
          </p>
        </header>

        <main className="mx-auto max-w-5xl space-y-12">
          <GallerySection
            title="AppShell · Titlebar · Sidebar"
            caption="The window frame — titlebar chrome, left nav rail, scrolling main"
          >
            <ShellDemo />
          </GallerySection>

          <GallerySection title="Button" caption="variant × size — size='icon' folds in IconButton">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="solid">Solid</Button>
                <Button variant="soft">Soft</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="soft" disabled>
                  Disabled
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="solid">
                  Small
                </Button>
                <Button size="md" variant="solid">
                  Medium
                </Button>
                <Button size="lg" variant="solid">
                  Large
                </Button>
                <Button size="icon" variant="soft" aria-label="Add session">
                  <Icon name="add" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="More">
                  <Icon name="more" />
                </Button>
                <Button variant="soft">
                  <Icon name="calendar" />
                  With icon
                </Button>
              </div>
            </div>
          </GallerySection>

          <GallerySection
            title="Toolbar"
            caption="Radix roving focus (arrow keys) — items are our Button"
          >
            <Toolbar.Root
              aria-label="Formatting"
              className="w-fit rounded-lg border border-border-subtle bg-surface-card p-1"
            >
              <Toolbar.Button size="icon" variant="ghost" aria-label="Previous">
                <Icon name="caretLeft" />
              </Toolbar.Button>
              <Toolbar.Button size="icon" variant="ghost" aria-label="Next">
                <Icon name="caretRight" />
              </Toolbar.Button>
              <Toolbar.Separator />
              <Toolbar.Button size="sm" variant="ghost">
                Today
              </Toolbar.Button>
              <Toolbar.Separator />
              <Toolbar.Button size="icon" variant="ghost" aria-label="Add">
                <Icon name="add" />
              </Toolbar.Button>
            </Toolbar.Root>
          </GallerySection>

          <GallerySection title="Badge" caption="Unified status + delta chips — tone × shape">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">Neutral</Badge>
              <Badge tone="accent">Accent</Badge>
              <Badge tone="success">
                <Icon name="arrowUp" />
                12%
              </Badge>
              <Badge tone="danger">
                <Icon name="arrowDown" />
                4%
              </Badge>
              <Badge tone="run">Run</Badge>
              <Badge tone="gym">Gym</Badge>
              <Badge tone="floorball">Floorball</Badge>
              <Badge tone="misc">Misc</Badge>
              <Badge tone="accent" shape="pill">
                Pill
              </Badge>
            </div>
          </GallerySection>

          <GallerySection title="Card" caption="Compound: Card.Header / Title / Content / Footer">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-gutter">
              <Card>
                <Card.Header>
                  <Card.Title>Default card</Card.Title>
                  <Card.Description>Header, content, footer</Card.Description>
                </Card.Header>
                <Card.Content>
                  <p className="text-sm text-text-secondary">Body content sits here.</p>
                </Card.Content>
                <Card.Footer>
                  <Button size="sm" variant="solid">
                    Action
                  </Button>
                </Card.Footer>
              </Card>
              <Card variant="raised">
                <Card.Header>
                  <Card.Title>Raised</Card.Title>
                  <Card.Description>surface-raised background</Card.Description>
                </Card.Header>
                <Card.Content>
                  <Badge tone="accent">Tag</Badge>
                </Card.Content>
              </Card>
              <Card interactive>
                <Card.Header>
                  <Card.Title>Interactive</Card.Title>
                  <Card.Description>Hover me</Card.Description>
                </Card.Header>
              </Card>
            </div>
          </GallerySection>

          <GallerySection
            title="MetricCard"
            caption="Icon badge · big mono value · plan + delta chip"
          >
            <div
              className="max-w-md"
              style={{ '--accent': 'var(--bf-run)' } as React.CSSProperties}
            >
              <MetricCardGrid accent="var(--bf-run)">
                <MetricCard
                  icon="distance"
                  label="Distance"
                  value="10.2"
                  unit="km"
                  planned="10.0 km"
                  delta={0.2}
                  deltaUnit="km"
                  precision={1}
                  positive="up"
                  hasActual
                />
                <MetricCard
                  icon="pace"
                  label="Avg Pace"
                  value="5:32"
                  unit="/km"
                  planned="5:37/km"
                  delta={-5}
                  deltaUnit="sec"
                  precision={0}
                  positive="down"
                  hasActual
                />
                <MetricCard
                  icon="heartRate"
                  label="Avg HR"
                  value={148}
                  unit="bpm"
                  planned="150 bpm"
                  delta={-2}
                  deltaUnit="bpm"
                  precision={0}
                  positive="down"
                  hasActual
                />
                <MetricCard
                  icon="time"
                  label="Time"
                  value="0:56:24"
                  planned="0:56:00"
                  hasActual={false}
                />
              </MetricCardGrid>
            </div>
          </GallerySection>

          <GallerySection title="HRZoneBar" caption="Stacked time-in-zone + legend">
            <div className="max-w-md">
              <HRZoneBar zones={[10, 35, 45, 8, 2]} meta="Max 174 bpm · 45m gain" />
            </div>
          </GallerySection>

          <GallerySection title="Trendline" caption="Highcharts area sparkline of recent sessions">
            <div
              className="max-w-2xl"
              style={{ '--accent': 'var(--bf-run)' } as React.CSSProperties}
            >
              <Trendline
                title="Distance trend"
                caption="last 6 sessions"
                data={[
                  { label: 'Apr 20', value: 10.0 },
                  { label: 'Apr 27', value: 10.5 },
                  { label: 'May 4', value: 10.2 },
                  { label: 'May 11', value: 11.0 },
                  { label: 'May 18', value: 10.8 },
                  { label: 'May 27', value: 11.4 }
                ]}
              />
            </div>
          </GallerySection>

          <GallerySection
            title="Form controls"
            caption="Switch · SegControl · DatePicker — Base UI behavior, our tokens"
          >
            <FormControlsDemo />
          </GallerySection>

          <GallerySection
            title="Inputs & Field"
            caption="TextField / Textarea · Base UI Field + Form (validate on submit)"
          >
            <InputsDemo />
          </GallerySection>

          <GallerySection
            title="EditableText"
            caption="Inline contentEditable — commits on blur/Enter, reverts on Escape"
          >
            <EditableTextDemo />
          </GallerySection>

          <GallerySection
            title="Dialog"
            caption="Base UI Dialog — scrollable body, pinned header/footer"
          >
            <DialogDemo />
          </GallerySection>

          <GallerySection
            title="ChipSelect"
            caption="Wrapping single-select pills — subtype picker"
          >
            <ChipSelectDemo />
          </GallerySection>

          <GallerySection
            title="CardSelect"
            caption="Single-select card grid — the New-Session type picker"
          >
            <CardSelectDemo />
          </GallerySection>

          <GallerySection title="Callout" caption="Inline tinted notices — tone × icon">
            <div className="flex max-w-md flex-col gap-2">
              <Callout tone="danger" icon="close">
                3 days without rest — consider scheduling a rest day.
              </Callout>
              <Callout tone="warning" icon="trend">
                You&apos;re trending above your planned weekly volume.
              </Callout>
              <Callout tone="success" icon="check">
                All sessions completed this week — nice work.
              </Callout>
              <Callout tone="info" icon="note">
                Connect Apple Health to auto-sync completed runs.
              </Callout>
            </div>
          </GallerySection>

          <GallerySection title="EmptyState" caption="Placeholder — default card + mini line">
            <div className="flex max-w-md flex-col gap-4">
              <EmptyState
                icon="heartRate"
                title="No actual data yet"
                description="Connect Apple Health to auto-sync, or log manually."
                actions={
                  <>
                    <Button size="sm" variant="solid">
                      Log manually
                    </Button>
                    <Button size="sm" variant="soft">
                      Connect Health
                    </Button>
                  </>
                }
              />
              <EmptyState size="mini" description="No previous sessions yet." />
            </div>
          </GallerySection>

          <GallerySection title="StatTile · SegmentBar" caption="KPI chips + weighted progress bar">
            <div className="flex max-w-xl flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <StatTile tone="good" icon="check" count={4} label="Done" />
                <StatTile tone="bad" icon="close" count={1} label="Missed" />
                <StatTile tone="info" icon="time" count={2} label="To go" />
              </div>
              <div className="flex flex-wrap gap-2">
                <StatTile size="sm" tone="good" icon="check" count={4} label="Done" />
                <StatTile size="sm" tone="bad" icon="close" count={1} label="Missed" />
                <StatTile size="sm" icon="time" count={2} label="To go" />
              </div>
              <SegmentBar
                aria-label="Week progress: 4 done, 1 missed, 2 to go"
                segments={[
                  { value: 4, tone: 'success', title: '4 completed' },
                  { value: 1, tone: 'danger', title: '1 missed' },
                  { value: 2, tone: 'neutral', title: '2 to go' }
                ]}
              />
            </div>
          </GallerySection>

          <GallerySection title="StatusBadge · SyncBadge" caption="Status pills + live sync source">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status="completed" />
              <StatusBadge status="today" />
              <StatusBadge status="planned" />
              <StatusBadge status="missed" />
              <SyncBadge />
            </div>
          </GallerySection>

          <GallerySection
            title="CompareBars"
            caption="Paired previous vs current bars + delta pill"
          >
            <div className="max-w-xl">
              <CompareBars
                prevDateLabel="May 13"
                curDateLabel="May 27"
                rows={[
                  {
                    label: 'Distance',
                    icon: 'distance',
                    prevValue: 10.0,
                    curValue: 11.4,
                    prevLabel: '10.0 km',
                    curLabel: '11.4 km',
                    delta: 1.4,
                    deltaUnit: 'km',
                    precision: 1,
                    positive: 'up'
                  },
                  {
                    label: 'Avg Pace',
                    icon: 'pace',
                    prevValue: 340,
                    curValue: 332,
                    prevLabel: '5:40/km',
                    curLabel: '5:32/km',
                    delta: -8,
                    deltaUnit: 'sec',
                    precision: 0,
                    positive: 'down'
                  },
                  {
                    label: 'Avg HR',
                    icon: 'heartRate',
                    prevValue: 150,
                    curValue: 152,
                    prevLabel: '150 bpm',
                    curLabel: '152 bpm',
                    delta: 2,
                    deltaUnit: 'bpm',
                    precision: 0,
                    positive: 'down'
                  }
                ]}
              />
            </div>
          </GallerySection>

          <GallerySection title="CompareDelta" caption="Single-metric previous → current + % chip">
            <div className="grid max-w-lg grid-cols-2 gap-2.5">
              <CompareDelta label="Duration" prev={45} cur={52} precision={0} positive="up" />
              <CompareDelta
                label="Avg Pace"
                prev={340}
                cur={332}
                positive="down"
                format={(v) => `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`}
              />
            </div>
          </GallerySection>

          <GallerySection
            title="ThemeToggle"
            caption="Titlebar chrome — flips [data-theme] on the document root"
          >
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <span className="text-sm text-text-tertiary">
                Toggles the whole gallery light/dark.
              </span>
            </div>
          </GallerySection>

          <GallerySection title="Icons" caption="Semantic registry — referenced by role, not glyph">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-gutter">
              {(Object.keys(iconRegistry) as IconName[]).map((name) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-2 rounded-lg border border-border-subtle bg-surface-card p-pad"
                >
                  <Icon name={name} className="text-2xl text-text-primary" />
                  <span className="text-3xs font-medium text-text-tertiary">{name}</span>
                </div>
              ))}
            </div>
          </GallerySection>

          <GallerySection
            title="Tabs"
            caption="Base UI Tabs — arrow-key nav, sliding accent underline"
          >
            <div
              className="max-w-lg"
              style={{ '--accent': 'var(--bf-run)' } as React.CSSProperties}
            >
              <Tabs defaultValue="overview">
                <Tabs.List>
                  <Tabs.Tab value="overview">Overview</Tabs.Tab>
                  <Tabs.Tab value="splits">Splits</Tabs.Tab>
                  <Tabs.Tab value="notes">Notes</Tabs.Tab>
                  <Tabs.Tab value="charts">Charts</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="overview" className="pt-4 text-sm text-text-secondary">
                  Overview panel — workout details and description.
                </Tabs.Panel>
                <Tabs.Panel value="splits" className="pt-4 text-sm text-text-secondary">
                  Splits panel — per-kilometre pace ladder.
                </Tabs.Panel>
                <Tabs.Panel value="notes" className="pt-4 text-sm text-text-secondary">
                  Notes panel — subtype + notes.
                </Tabs.Panel>
                <Tabs.Panel value="charts" className="pt-4 text-sm text-text-secondary">
                  Charts panel — HR &amp; pace.
                </Tabs.Panel>
              </Tabs>
            </div>
          </GallerySection>

          <GallerySection
            title="Collapsible"
            caption="Base UI Collapsible — height-animated show/hide"
          >
            <CollapsibleDemo />
          </GallerySection>

          <GallerySection
            title="Spinner"
            caption="Loading / syncing states — size × tone, halts on reduced-motion"
          >
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 text-text-secondary">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" />
              </div>
              <Spinner tone="accent" size="lg" />
              <Spinner tone="muted" size="lg" />
              <Button variant="soft" size="sm" disabled>
                <Spinner size="sm" />
                Syncing…
              </Button>
            </div>
          </GallerySection>

          <GallerySection
            title="NumberField"
            caption="Base UI NumberField — bounded stepper, optional unit suffix"
          >
            <NumberFieldDemo />
          </GallerySection>

          <GallerySection
            title="Tooltip"
            caption="Base UI Tooltip — hover/focus intent, collision flip"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Tooltip content="Delete session">
                <Button variant="ghost" size="icon" aria-label="Delete">
                  <Icon name="delete" />
                </Button>
              </Tooltip>
              <Tooltip content="Repeat this week forward" side="right">
                <Button variant="soft" size="sm">
                  <Icon name="repeat" />
                  Hover me
                </Button>
              </Tooltip>
              <Tooltip content="Z2 · Easy — 35%" side="bottom">
                <span className="cursor-default text-sm text-text-secondary underline decoration-dotted underline-offset-4">
                  Zone label
                </span>
              </Tooltip>
            </div>
          </GallerySection>

          <GallerySection
            title="MetricsTable"
            caption="Actual / planned / diff rows — clearer than a MetricCard grid for many metrics"
          >
            <div className="max-w-lg">
              <MetricsTable
                hasActual
                rows={[
                  {
                    icon: 'distance',
                    label: 'Distance',
                    actual: '11.4 km',
                    planned: '10.0 km',
                    delta: 1.4,
                    deltaUnit: 'km',
                    precision: 1,
                    positive: 'up'
                  },
                  {
                    icon: 'time',
                    label: 'Time',
                    actual: '58:24',
                    planned: '56:00',
                    delta: 2.4,
                    deltaUnit: 'min',
                    precision: 1,
                    positive: 'down'
                  },
                  {
                    icon: 'pace',
                    label: 'Avg Pace',
                    actual: '5:32/km',
                    planned: '5:37/km',
                    delta: -5,
                    deltaUnit: 'sec',
                    precision: 0,
                    positive: 'down'
                  },
                  {
                    icon: 'heartRate',
                    label: 'Avg HR',
                    actual: '150 bpm',
                    planned: '150 bpm',
                    delta: 0,
                    deltaUnit: 'bpm',
                    precision: 0,
                    positive: 'down'
                  }
                ]}
              />
            </div>
          </GallerySection>

          <GallerySection
            title="SettingRow"
            caption="Labeled row + control — the Settings building block"
          >
            <Card className="max-w-lg px-pad">
              <SettingRow
                label="Session reminders"
                description="A nudge before each planned session."
              >
                <Switch defaultChecked aria-label="Session reminders" />
              </SettingRow>
              <div className="border-t border-border-subtle" />
              <SettingRow label="Distance" description="Used across runs, trends, and comparisons.">
                <SegControl
                  value="km"
                  onValueChange={() => {}}
                  aria-label="Units"
                  options={[
                    { value: 'km', label: 'Kilometers' },
                    { value: 'mi', label: 'Miles' }
                  ]}
                />
              </SettingRow>
              <div className="border-t border-border-subtle" />
              <SettingRow
                label="Rest-day threshold"
                description="Flag when you've gone this long without rest."
              >
                <NumberField
                  defaultValue={3}
                  min={1}
                  max={14}
                  suffix="days"
                  aria-label="Rest threshold"
                />
              </SettingRow>
            </Card>
          </GallerySection>

          <GallerySection
            title="Banner"
            caption="Actionable full-width notice — icon + count badge, title/desc, CTA"
          >
            <div
              className="flex max-w-lg flex-col gap-3"
              style={{ '--accent': 'var(--bf-run)' } as React.CSSProperties}
            >
              <Banner
                icon="health"
                count={3}
                title="New from Apple Fitness"
                description="3 recorded workouts are ready to sync to a planned session."
                cta="Import →"
              />
              <Banner
                tone="neutral"
                icon="repeat"
                title="Weekly template ready"
                description="Apply your repeating week forward to the calendar."
                cta="Apply →"
              />
            </div>
          </GallerySection>
        </main>
      </div>
    </TooltipProvider>
  )
}

function CollapsibleDemo(): ReactNode {
  const [open, setOpen] = useState(false)

  return (
    <div className="max-w-md">
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger
          render={
            <Button variant="soft" size="sm">
              <Icon name={open ? 'caretDown' : 'caretRight'} />
              {open ? 'Hide details' : 'Show details'}
            </Button>
          }
        />
        <Collapsible.Panel>
          <div className="mt-2 rounded-card border border-border-subtle bg-surface-card p-pad text-sm text-text-secondary">
            The panel animates its height from the value Base UI publishes. Header and trigger stay
            put; this region slides open and shut.
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  )
}

function NumberFieldDemo(): ReactNode {
  const [weeks, setWeeks] = useState<number | null>(8)
  const [rest, setRest] = useState<number | null>(3)

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-tertiary">Repeat</span>
        <NumberField
          value={weeks}
          onValueChange={setWeeks}
          min={1}
          max={52}
          suffix="weeks"
          aria-label="Repeat weeks"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-tertiary">Rest threshold</span>
        <NumberField
          value={rest}
          onValueChange={setRest}
          min={1}
          max={14}
          suffix="days"
          aria-label="Rest-day threshold"
        />
      </div>
      <NumberField defaultValue={5} min={0} hideStepper aria-label="Bare number" />
    </div>
  )
}

function FormControlsDemo(): ReactNode {
  const [on, setOn] = useState(true)
  const [units, setUnits] = useState('km')
  const [view, setView] = useState('month')
  const [status, setStatus] = useState('done')
  const [date, setDate] = useState<Date | null>(new Date(2026, 4, 27))

  return (
    <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-text-tertiary">Switch</span>
        <div className="flex items-center gap-3">
          <Switch checked={on} onCheckedChange={setOn} aria-label="Toggle" />
          <Switch checked={false} disabled aria-label="Disabled toggle" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-text-tertiary">SegControl</span>
        <div className="flex flex-col items-start gap-2">
          <SegControl
            value={units}
            onValueChange={setUnits}
            aria-label="Distance units"
            options={[
              { value: 'km', label: 'Kilometers' },
              { value: 'mi', label: 'Miles' }
            ]}
          />
          <SegControl
            value={view}
            onValueChange={setView}
            aria-label="Default view"
            options={[
              { value: 'month', label: 'Month' },
              { value: 'week', label: 'Week' }
            ]}
          />
          <SegControl
            value={status}
            onValueChange={setStatus}
            aria-label="Session status"
            options={[
              { value: 'done', label: 'Completed', icon: 'check', tone: 'success' },
              { value: 'missed', label: 'Missed', icon: 'close', tone: 'danger' }
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-text-tertiary">DatePicker</span>
        <div className="w-52">
          <DatePicker value={date} onChange={setDate} />
        </div>
      </div>
    </div>
  )
}

function InputsDemo(): ReactNode {
  const [name, setName] = useState('')

  return (
    <div className="flex max-w-md flex-col gap-5">
      <div className="flex flex-col gap-3">
        <TextField
          placeholder="Standalone TextField"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea placeholder="Standalone Textarea — how did it feel?" rows={3} />
      </div>

      <Form
        className="rounded-card border border-border-subtle bg-surface-card p-pad"
        onSubmit={(e) => e.preventDefault()}
      >
        <Field.Root name="title">
          <Field.Label>Session title</Field.Label>
          <Field.Control required placeholder="e.g. Tempo run" />
          <Field.Error match="valueMissing">A title is required.</Field.Error>
        </Field.Root>
        <Field.Root name="target">
          <Field.Label>Target distance</Field.Label>
          <Field.Control type="number" min={0} placeholder="10" />
          <Field.Description>Kilometers — leave blank to decide later.</Field.Description>
        </Field.Root>
        <div className="flex justify-end">
          <Button type="submit" variant="solid" size="sm">
            Save
          </Button>
        </div>
      </Form>
    </div>
  )
}

function EditableTextDemo(): ReactNode {
  const [title, setTitle] = useState('Tempo run · 10 km')
  const [desc, setDesc] = useState('')

  return (
    <div
      className="max-w-lg rounded-card border border-border-subtle bg-surface-card p-pad"
      style={{ '--accent': 'var(--bf-run)' } as React.CSSProperties}
    >
      <EditableText
        as="h2"
        aria-label="Session title"
        className="text-3xl font-extrabold tracking-tight text-text-primary"
        value={title}
        onCommit={setTitle}
      />
      <EditableText
        as="p"
        aria-label="Session description"
        className="mt-2 text-sm text-text-secondary"
        placeholder="Add a description…"
        value={desc}
        onCommit={setDesc}
      />
    </div>
  )
}

function DialogDemo(): ReactNode {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={(next) => setOpen(next)}>
      <Dialog.Trigger render={<Button variant="solid">Open dialog</Button>} />
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add session</Dialog.Title>
          <Dialog.Close render={<Button variant="ghost" size="icon" aria-label="Close" />}>
            <Icon name="close" />
          </Dialog.Close>
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex flex-col gap-3 pb-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <p key={i} className="text-sm text-text-secondary">
                Scrollable body line {i + 1} — the header and footer stay pinned while this area
                scrolls.
              </p>
            ))}
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="soft">Cancel</Button>} />
          <Button variant="solid" onClick={() => setOpen(false)}>
            Save
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}

function ChipSelectDemo(): ReactNode {
  const [subtype, setSubtype] = useState('Tempo')

  return (
    <div className="max-w-md" style={{ '--accent': 'var(--bf-run)' } as React.CSSProperties}>
      <ChipSelect
        value={subtype}
        onValueChange={setSubtype}
        accent="var(--bf-run)"
        aria-label="Run subtype"
        options={[
          { value: 'Easy', label: 'Easy' },
          { value: 'Tempo', label: 'Tempo' },
          { value: 'Intervals', label: 'Intervals' },
          { value: 'Long', label: 'Long' },
          { value: 'Recovery', label: 'Recovery' }
        ]}
      />
    </div>
  )
}

function ShellDemo(): ReactNode {
  const [active, setActive] = useState('calendar')
  const nav: { id: string; label: string; icon: IconName }[] = [
    { id: 'home', label: 'Overview', icon: 'overview' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar' },
    { id: 'template', label: 'Weekly Template', icon: 'template' },
    { id: 'trends', label: 'Trends', icon: 'trends' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ]

  return (
    <AppShell className="h-[440px] rounded-card border border-border-strong shadow-window">
      <Titlebar
        trafficLights
        logo={<Icon name="run" />}
        title="Body Factory"
        meta="Wk 22 · May 2026"
      >
        <ThemeToggle />
      </Titlebar>
      <AppShell.Body>
        <Sidebar>
          <Sidebar.Section>
            <Sidebar.Label>Workspace</Sidebar.Label>
            {nav.map((n) => (
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
            <div className="rounded-lg border border-border-subtle bg-surface-card p-pad text-xs text-text-tertiary">
              Integration cards (Apple Health, Evolt) live here.
            </div>
          </Sidebar.Footer>
        </Sidebar>
        <AppShell.Main className="p-8">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-text-primary">
            {nav.find((n) => n.id === active)?.label}
          </h2>
          <p className="mt-2 max-w-prose text-sm text-text-secondary">
            Feature screens render here. The main area scrolls independently while the titlebar and
            sidebar stay pinned.
          </p>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell>
  )
}

function CardSelectDemo(): ReactNode {
  const [type, setType] = useState('run')

  return (
    <div className="max-w-lg">
      <CardSelect
        value={type}
        onValueChange={setType}
        columns={4}
        aria-label="Session type"
        options={[
          { value: 'run', label: 'Run', icon: 'run', color: 'var(--bf-run)' },
          { value: 'gym', label: 'Gym', icon: 'gym', color: 'var(--bf-gym)' },
          {
            value: 'floorball',
            label: 'Floorball',
            icon: 'floorball',
            color: 'var(--bf-floorball)'
          },
          { value: 'misc', label: 'Misc', icon: 'misc', color: 'var(--bf-misc)' }
        ]}
      />
    </div>
  )
}

function GallerySection({
  title,
  caption,
  children
}: {
  title: string
  caption?: string
  children: ReactNode
}): ReactNode {
  return (
    <section>
      <div className="mb-4 flex items-baseline gap-3 border-b border-border-subtle pb-2">
        <h2 className="font-display text-xl font-bold tracking-snug text-text-primary">{title}</h2>
        {caption && <p className="text-xs text-text-tertiary">{caption}</p>}
      </div>
      {children}
    </section>
  )
}
