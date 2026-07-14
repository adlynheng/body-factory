import { useState, type ReactNode } from 'react'
import { Badge } from '@renderer/components/ui/Badge'
import { Button } from '@renderer/components/ui/Button'
import { Card } from '@renderer/components/ui/Card'
import { DatePicker } from '@renderer/components/ui/DatePicker'
import { HRZoneBar } from '@renderer/components/ui/HRZoneBar'
import { Icon, iconRegistry, type IconName } from '@renderer/components/ui/Icon'
import { MetricCard, MetricCardGrid } from '@renderer/components/ui/MetricCard'
import { SegControl } from '@renderer/components/ui/SegControl'
import { Switch } from '@renderer/components/ui/Switch'
import { Toolbar } from '@renderer/components/ui/Toolbar'
import { Trendline } from '@renderer/components/ui/Trendline'

/**
 * Primitive Gallery — a development-only surface for building and eyeballing
 * design-system primitives in isolation, before they're composed into feature
 * screens. Each phase adds a section here. Not shipped in the real app shell.
 */
export function Gallery(): ReactNode {
  return (
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

        <GallerySection title="Toolbar" caption="Radix roving focus (arrow keys) — items are our Button">
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

        <GallerySection title="MetricCard" caption="Icon badge · big mono value · plan + delta chip">
          <div className="max-w-md" style={{ '--accent': 'var(--bf-run)' } as React.CSSProperties}>
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

        <GallerySection title="Trendline" caption="Bespoke SVG sparkline of recent sessions">
          <div className="max-w-2xl" style={{ '--accent': 'var(--bf-run)' } as React.CSSProperties}>
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

        <GallerySection title="Form controls" caption="Switch · SegControl · DatePicker — Radix behavior, our tokens">
          <FormControlsDemo />
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
      </main>
    </div>
  )
}

function FormControlsDemo(): ReactNode {
  const [on, setOn] = useState(true)
  const [units, setUnits] = useState('km')
  const [view, setView] = useState('month')
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
