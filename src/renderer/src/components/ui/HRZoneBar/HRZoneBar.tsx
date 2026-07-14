import type { ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

const ZONE_LEGEND = ['Z1 Recover', 'Z2 Easy', 'Z3 Moderate', 'Z4 Threshold', 'Z5 Max']

// Zone index (0-based) → token background utility. Zones are a fixed 5-band
// scale, so the mapping is static rather than a variant.
const ZONE_BG = ['bg-zone-1', 'bg-zone-2', 'bg-zone-3', 'bg-zone-4', 'bg-zone-5']

export interface HRZoneBarProps {
  /** Percentage of time in each HR zone, Z1→Z5 (should sum to ~100). */
  zones: number[]
  /** Optional right-aligned header meta (e.g. "Max 174 bpm · 45m gain"). */
  meta?: ReactNode
  className?: string
}

/**
 * HRZoneBar — a stacked proportional bar of time-in-HR-zone, with a legend.
 * Segment labels are hidden below 8% where they wouldn't fit.
 */
export function HRZoneBar({ zones, meta, className }: HRZoneBarProps): ReactNode {
  return (
    <div className={className}>
      <div className="mb-2.5 flex items-baseline justify-between text-sm font-semibold text-text-secondary">
        <span>HR Zones</span>
        {meta && <span className="mono text-[11px] text-text-tertiary">{meta}</span>}
      </div>

      <div className="flex h-6 overflow-hidden rounded-sm border border-border-subtle bg-surface-raised">
        {zones.map((pct, i) => (
          <div
            key={i}
            className={cn(
              'flex min-w-0 items-center justify-center text-[10px] font-bold text-[#0a0a0a]',
              ZONE_BG[i]
            )}
            style={{ width: `${pct}%` }}
            title={`Z${i + 1}: ${pct}%`}
          >
            {pct >= 8 && <span className="mono">{pct}%</span>}
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1.5">
        {ZONE_LEGEND.map((label, i) => (
          <div key={i} className="flex items-center gap-[5px] text-[10.5px] text-text-tertiary">
            <span className={cn('size-2 rounded-[2px]', ZONE_BG[i])} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
