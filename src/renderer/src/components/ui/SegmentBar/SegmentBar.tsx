import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@renderer/lib/utils'

export type SegmentTone = 'success' | 'danger' | 'neutral' | 'accent'

export interface BarSegment {
  /** Relative weight — segments size proportionally (design uses raw counts). */
  value: number
  tone?: SegmentTone
  className?: string
  title?: string
}

export interface SegmentBarProps {
  segments: BarSegment[]
  className?: string
  'aria-label'?: string
}

const toneClasses: Record<SegmentTone, string> = {
  success: 'bg-success',
  danger: 'bg-danger',
  neutral: 'bg-border-strong',
  accent: 'bg-accent'
}

/**
 * SegmentBar — a single rounded track split into weighted segments (design's
 * week-progress bar, `.bf-progress-bar`: completed / missed / remaining).
 * Zero-value segments are dropped; each remaining one grows by its `value`.
 * For time-in-zone bars with inline labels + legend, use `HRZoneBar`.
 */
export function SegmentBar({
  segments,
  className,
  'aria-label': ariaLabel
}: SegmentBarProps): ReactNode {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn('flex h-3 gap-[3px] overflow-hidden rounded-full bg-surface-raised', className)}
    >
      {segments
        .filter((s) => s.value > 0)
        .map((s, i) => (
          <span
            key={i}
            title={s.title}
            style={{ flexGrow: s.value } as CSSProperties}
            className={cn('min-w-[4px] rounded-full', toneClasses[s.tone ?? 'neutral'], s.className)}
          />
        ))}
    </div>
  )
}
