/** Relative "last synced" label (design's `timeAgo`, extended to days). */
export function timeAgo(date: Date | null): string {
  if (!date) return 'never'
  const sec = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000))
  if (sec < 60) return 'just now'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.round(hr / 24)}d ago`
}
