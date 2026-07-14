import Highcharts from 'highcharts'
import { useEffect, useRef, type ReactNode } from 'react'

export interface TrendPoint {
  /** X-axis label under this point, e.g. "May 27". */
  label: string
  value: number
}

export interface TrendlineProps {
  data: TrendPoint[]
  title: string
  /** Right-aligned header meta, e.g. "last 6 sessions". */
  caption?: string
  /** Line/area/last-point color (CSS color or var like "var(--bf-run)"). */
  accent?: string
}

// Resolve a CSS color (incl. `var(--…)`) to a concrete rgb string. Highcharts
// parses series colors internally (hover/brighten), so a raw `var(--x)` string
// would break — resolve it against the DOM first.
function resolveColor(el: HTMLElement, color: string): string {
  const prev = el.style.color
  el.style.color = color
  const resolved = getComputedStyle(el).color
  el.style.color = prev
  return resolved || color
}

function buildOptions(el: HTMLElement, data: TrendPoint[], accent: string): Highcharts.Options {
  const color = resolveColor(el, accent)
  const vals = data.map((d) => d.value)
  const last = vals.length - 1

  return {
    chart: { type: 'area', backgroundColor: 'transparent', height: 124, margin: [8, 2, 26, 2] },
    title: { text: undefined },
    credits: { enabled: false },
    legend: { enabled: false },
    accessibility: { enabled: false },
    xAxis: {
      categories: data.map((d) => d.label),
      lineWidth: 0,
      tickWidth: 0,
      labels: {
        style: { color: 'var(--bf-text-3)', fontSize: '10px', fontFamily: 'var(--font-mono)' }
      }
    },
    yAxis: {
      visible: false,
      startOnTick: false,
      endOnTick: false,
      min: Math.min(...vals) * 0.9,
      max: Math.max(...vals) * 1.05
    },
    tooltip: {
      backgroundColor: 'var(--bf-bg-card)',
      borderColor: 'var(--bf-border)',
      borderRadius: 8,
      style: { color: 'var(--bf-text)', fontFamily: 'var(--font-mono)', fontSize: '11px' },
      headerFormat: '',
      pointFormat: '<b>{point.y}</b>'
    },
    plotOptions: {
      area: {
        color,
        lineWidth: 2,
        fillOpacity: 0.12,
        marker: {
          enabled: true,
          radius: 3,
          symbol: 'circle',
          fillColor: '#0b0b0b',
          lineColor: color,
          lineWidth: 2
        }
      }
    },
    series: [
      {
        type: 'area',
        data: vals.map((y, i) =>
          i === last ? { y, marker: { radius: 5, fillColor: color } } : { y }
        )
      }
    ]
  }
}

/**
 * Trendline — a filled sparkline of the last N sessions, rendered with
 * Highcharts (thin ref/effect wrapper; no highcharts-react-official needed).
 * The final point is emphasized. Header/frame use our tokens; the chart's
 * accent resolves from a CSS var so it tracks the session type's color.
 */
export function Trendline({
  data,
  title,
  caption,
  accent = 'var(--accent)'
}: TrendlineProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<Highcharts.Chart | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const options = buildOptions(el, data, accent)
    if (chartRef.current) {
      chartRef.current.update(options, true, true)
    } else {
      chartRef.current = Highcharts.chart(el, options)
    }
  }, [data, accent])

  // Destroy on unmount only.
  useEffect(() => {
    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [])

  return (
    <div className="rounded-lg border border-border-subtle bg-surface-raised px-4 py-3.5">
      <div className="mb-2 flex items-baseline justify-between text-sm font-semibold text-text-secondary">
        <span>{title}</span>
        {caption && <span className="mono text-[10.5px] text-text-tertiary">{caption}</span>}
      </div>
      <div ref={containerRef} />
    </div>
  )
}
