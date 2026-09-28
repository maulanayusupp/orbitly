// Structural constants shared across the app. No UI copy that belongs to a
// single component lives here — only values reused in more than one place.
import type { CurrencyCode } from '~/types'

export const BRAND = {
  name: 'Orbitly',
  tagline: 'The creator business OS',
} as const

export const DEFAULT_WORKSPACE_ID = 'ws_kiln'
export const DEFAULT_CURRENCY: CurrencyCode = 'USD'

/** Simulated network latency for the mock adapter (ms). */
export const MOCK_LATENCY = { min: 180, max: 420 } as const

/** localStorage key for the demo snapshot. Bump the version to invalidate. */
export const DEMO_STORAGE_KEY = 'orbitly:demo:v2'

export const TOAST_DURATION_MS = 3600

/** Longest edge of a generated product cover, in px (kept small so the demo
 *  snapshot fits comfortably in localStorage). */
export const COVER_MAX_EDGE = 720
