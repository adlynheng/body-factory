import type { CSSProperties, ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export interface SyncStat {
  value: string
  label: string
}

export interface SyncCardProps {
  /** Connected header name, e.g. "Apple Health". */
  name: string
  /** Disconnected prompt title, e.g. "Connect Apple Health". */
  connectTitle: string
  /** Disconnected sub-line — what connecting unlocks. */
  offerText: string
  icon: IconName
  /** Brand icon color + its soft background wash (disconnected state). */
  iconColor: string
  iconSoft: string
  connected: boolean
  /** Relative last-synced label shown in the connected header. */
  lastSyncedLabel: string
  /** Three compact metrics shown when connected. */
  stats: SyncStat[]
  /** Static ring color for the pulse dot; omit for the animated green pulse. */
  pulseColor?: string
  onConnect: () => void
}

// State-based card wash (design's `.bf-health-connected` / `-disconnected`,
// dark spec): green when connected, pink when prompting. color-mix against the
// theme-aware --bf-bg-card token so both themes get a matching tint.
const connectedStyle: CSSProperties = {
  background:
    'linear-gradient(180deg, color-mix(in oklab, var(--bf-success) 10%, var(--bf-bg-card)) 0%, var(--bf-bg-card) 72%)',
  borderColor: 'color-mix(in oklab, var(--bf-success) 30%, var(--bf-border))'
}
const disconnectedStyle: CSSProperties = {
  background:
    'linear-gradient(180deg, color-mix(in oklab, #ff6b8b 12%, var(--bf-bg-card)) 0%, var(--bf-bg-card) 72%)',
  borderColor: 'color-mix(in oklab, #ff6b8b 30%, var(--bf-border))'
}

/**
 * SyncCard — the compact integration card that lives in the sidebar footer
 * (design's `.bf-health` in `.bf-side-syncs`). Two states: a connect prompt
 * (icon + title + blurb + full-width Connect) or a connected summary (pulse +
 * name + last-synced, over a row of three metrics). Distinct from the settings
 * `ConnectionCard` — this one is denser and stat-forward.
 */
export function SyncCard({
  name,
  connectTitle,
  offerText,
  icon,
  iconColor,
  iconSoft,
  connected,
  lastSyncedLabel,
  stats,
  pulseColor,
  onConnect
}: SyncCardProps): ReactNode {
  const frame = 'overflow-hidden rounded-xl border p-3.5'

  if (!connected) {
    return (
      <div className={frame} style={disconnectedStyle}>
        <div
          className="mb-2.5 flex size-7 items-center justify-center rounded-lg text-[15px]"
          style={{ color: iconColor, background: iconSoft }}
          aria-hidden="true"
        >
          <Icon name={icon} />
        </div>
        <div className="mb-1 text-[13px] font-semibold text-text-primary">{connectTitle}</div>
        <div className="mb-2.5 text-[11.5px] leading-[1.4] text-text-tertiary">{offerText}</div>
        <button
          type="button"
          onClick={onConnect}
          className={cn(
            'w-full rounded-[7px] bg-text-primary py-1.5 text-xs font-semibold text-surface',
            'transition-[filter] hover:brightness-110',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60'
          )}
        >
          Connect
        </button>
      </div>
    )
  }

  return (
    <div className={frame} style={connectedStyle}>
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-[7px] text-xs font-semibold text-text-primary">
          {pulseColor ? (
            <span
              className="size-[7px] shrink-0 rounded-full"
              style={{ background: pulseColor, boxShadow: `0 0 0 3px ${iconSoft}` }}
            />
          ) : (
            <span className="size-[7px] shrink-0 animate-[bf-pulse_2s_infinite] rounded-full bg-success motion-reduce:animate-none" />
          )}
          <span>{name}</span>
        </div>
        <span className="mono text-[10.5px] text-text-tertiary">{lastSyncedLabel}</span>
      </div>
      <div className="flex gap-2">
        {stats.map((s) => (
          <div key={s.label} className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
            <span className="mono text-sm font-bold tracking-[-0.02em] text-text-primary">
              {s.value}
            </span>
            <span className="text-[9.5px] font-medium text-text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
