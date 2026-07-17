import type { ReactNode } from 'react'
import { Button } from '@renderer/components/ui/Button'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { Spinner } from '@renderer/components/ui/Spinner'
import { cn } from '@renderer/lib/utils'
import { timeAgo } from './timeAgo'

export interface ConnectionCardProps {
  /** Glyph icon + its brand accent (integration-specific one-off colors). */
  icon: IconName
  accent: string
  /** Soft background wash behind the icon, e.g. an rgba of the accent. */
  accentSoft: string
  connected: boolean
  /** Shown when disconnected — what connecting unlocks. */
  offerText: string
  lastSynced: Date | null
  /** Data categories the integration syncs (shown as ✓ chips when connected). */
  types: string[]
  syncing: boolean
  onSyncNow: () => void
  onToggle: (next: boolean) => void
  /** Health pulses its live dot; Evolt shows a static ring. */
  pulse?: 'animated' | 'static'
}

/**
 * ConnectionCard — the Apple Health / Evolt integration row inside a settings
 * section (design's `.bf-set-health`): brand icon, connection status with a
 * live pulse dot, a wrap of synced-data ✓ chips, and Sync-Now / Connect
 * actions. The inverted-fill Sync button is styled inline — no `Button` variant
 * maps to the design's `bg-text color-bg` contrast fill; Connect/Disconnect
 * reuses `Button variant="soft"` (design's `.bf-btn`).
 */
export function ConnectionCard({
  icon,
  accent,
  accentSoft,
  connected,
  offerText,
  lastSynced,
  types,
  syncing,
  onSyncNow,
  onToggle,
  pulse = 'animated'
}: ConnectionCardProps): ReactNode {
  return (
    <div className="flex flex-wrap items-center gap-3.5 px-1 py-4">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-[10px] text-[19px]"
        style={{ color: accent, background: accentSoft }}
        aria-hidden="true"
      >
        <Icon name={icon} />
      </div>

      <div className="min-w-[220px] flex-1">
        <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
          <span>{connected ? 'Connected' : 'Not connected'}</span>
          {connected &&
            (pulse === 'animated' ? (
              <span className="size-[7px] shrink-0 animate-[bf-pulse_2s_infinite] rounded-full bg-success motion-reduce:animate-none" />
            ) : (
              <span
                className="size-[7px] shrink-0 rounded-full"
                style={{ background: accent, boxShadow: `0 0 0 3px ${accentSoft}` }}
              />
            ))}
        </div>
        <div className="mt-0.5 text-xs text-text-tertiary">
          {connected ? `Last synced ${timeAgo(lastSynced)}` : offerText}
        </div>

        {connected && types.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {types.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-raised px-2.5 py-1 text-[10.5px] font-semibold text-text-secondary"
              >
                <span className="font-extrabold text-success">✓</span>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {connected && (
          <button
            type="button"
            disabled={syncing}
            onClick={onSyncNow}
            className={cn(
              'flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg bg-text-primary px-3.5 text-xs font-bold text-surface',
              'transition-[filter] hover:brightness-110',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
              'disabled:cursor-default disabled:opacity-60 disabled:hover:brightness-100'
            )}
          >
            {syncing ? <Spinner size="sm" /> : <Icon name="repeat" className="text-sm" />}
            <span>{syncing ? 'Syncing…' : 'Sync Now'}</span>
          </button>
        )}
        <Button variant="soft" onClick={() => onToggle(!connected)}>
          {connected ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
    </div>
  )
}
