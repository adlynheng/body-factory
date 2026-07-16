import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Icon, type IconName } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

type StatTone = 'neutral' | 'good' | 'bad' | 'info'
type StatSize = 'sm' | 'md'

const tileVariants = cva('flex items-center rounded-[11px]', {
  variants: {
    tone: {
      neutral: 'bg-surface-raised',
      good: 'border border-success/30 bg-success/10',
      bad: 'border border-danger/30 bg-danger/10',
      info: 'border border-floorball/30 bg-floorball/10'
    },
    size: {
      sm: 'gap-2 px-3 py-2',
      md: 'gap-2.5 px-3.5 py-3'
    }
  },
  defaultVariants: { tone: 'neutral', size: 'md' }
})

const iconToneClasses: Record<StatTone, string> = {
  neutral: 'bg-surface-hover text-text-tertiary',
  good: 'bg-success/20 text-success',
  bad: 'bg-danger/20 text-danger',
  info: 'bg-floorball/20 text-floorball'
}

const iconSizeClasses: Record<StatSize, string> = {
  sm: 'size-6 text-[14px]',
  md: 'size-[30px] text-[18px]'
}

const countSizeClasses: Record<StatSize, string> = {
  sm: 'text-lg',
  md: 'text-xl'
}

export interface StatTileProps extends VariantProps<typeof tileVariants> {
  icon: IconName
  count: ReactNode
  label: ReactNode
  className?: string
}

/**
 * StatTile — a KPI chip: tinted icon badge, big mono count, label (design's
 * `.bf-statchip`). Tone colors the tile and the icon badge together
 * (good/bad/info tint, neutral plain). `size="sm"` is the compact variant for
 * dense rows (the home week-summary chips); `md` is the default.
 */
export function StatTile({ tone, size, icon, count, label, className }: StatTileProps): ReactNode {
  const t: StatTone = tone ?? 'neutral'
  const s: StatSize = size ?? 'md'
  return (
    <div className={cn(tileVariants({ tone: t, size: s }), className)}>
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-md',
          iconSizeClasses[s],
          iconToneClasses[t]
        )}
      >
        <Icon name={icon} />
      </span>
      <span
        className={cn('mono font-extrabold tracking-tight text-text-primary', countSizeClasses[s])}
      >
        {count}
      </span>
      <span className="text-sm font-semibold text-text-tertiary">{label}</span>
    </div>
  )
}
