import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with Tailwind-aware conflict resolution.
 *
 * `clsx` handles conditional/array/object class values; `twMerge` ensures a
 * later Tailwind utility wins over an earlier conflicting one (e.g. passing
 * `p-4` overrides a component's default `p-2` instead of both landing in the
 * class list). Use this everywhere className strings are composed.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
