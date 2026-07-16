import 'react-calendar/dist/Calendar.css'
import './datepicker.css'

import { Popover } from '@base-ui-components/react/popover'
import Calendar from 'react-calendar'
import { useState, type ReactNode } from 'react'
import { Icon } from '@renderer/components/ui/Icon'
import { cn } from '@renderer/lib/utils'

export interface DatePickerProps {
  value: Date | null
  onChange: (value: Date | null) => void
  /** Popover edge to align to the trigger (design uses 'end' for the until-date). */
  align?: 'start' | 'end'
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

// Trigger label — matches the design's DatePicker exactly: `Wed, May 27 2026`
// (Monday-first 3-letter weekday, 3-letter month, day, space, full year).
// These mirror the prototype's DAY_NAMES / MONTH_NAMES; they'll move to
// `domain/` once that module exists.
const DP_DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DP_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function formatTriggerDate(d: Date): string {
  return `${DP_DAY_NAMES[(d.getDay() + 6) % 7]}, ${DP_MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()} ${d.getFullYear()}`
}

/**
 * Date field — a Base UI `Popover` trigger (the design's read-only formatted
 * button) over a `react-calendar` month grid. react-date-picker's editable
 * day/month/year spinners can't reproduce the design's weekday string trigger,
 * so the popover owns positioning/dismiss and we render the trigger ourselves.
 * Calendar styling lives in datepicker.css (keyed to --bf-* tokens).
 */
export function DatePicker({
  value,
  onChange,
  align = 'start',
  minDate,
  maxDate,
  disabled,
  className,
  'aria-label': ariaLabel
}: DatePickerProps): ReactNode {
  const [open, setOpen] = useState(false)

  return (
    <Popover.Root open={open} onOpenChange={(next) => setOpen(next)}>
      <Popover.Trigger
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          'flex cursor-pointer items-center gap-2.5 rounded-[7px] border border-border-subtle bg-surface-raised px-2.5 py-1.5 text-[12.5px] font-semibold text-text-primary',
          'hover:bg-surface-hover',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
      >
        <span>{value ? formatTriggerDate(value) : 'Select date'}</span>
        <span className="inline-flex text-[15px] text-text-secondary">
          <Icon name="calendar" />
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align={align} sideOffset={0}>
          <Popover.Popup className="z-[60] origin-[var(--transform-origin)] outline-none">
            <Calendar
              value={value}
              onChange={(v) => {
                onChange(v as Date | null)
                setOpen(false)
              }}
              minDate={minDate}
              maxDate={maxDate}
              prevLabel={<Icon name="caretLeft" />}
              nextLabel={<Icon name="caretRight" />}
              prev2Label={null}
              next2Label={null}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
