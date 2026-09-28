// Pure formatting helpers (locale fixed to en-US for the demo).
import type { CurrencyCode } from '~/types'

const LOCALE = 'en-US'
const ZERO_DECIMAL: CurrencyCode[] = ['IDR']

export function formatMoney(value: number, currency: CurrencyCode, compact = false): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : ZERO_DECIMAL.includes(currency) ? 0 : 2,
    minimumFractionDigits: compact || ZERO_DECIMAL.includes(currency) ? 0 : 2,
  }).format(value)
}

export function formatNumber(value: number, compact = false): string {
  return new Intl.NumberFormat(LOCALE, {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value)
}

export function formatPercent(fraction: number, digits = 1): string {
  return new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: digits }).format(fraction)
}

export function formatDelta(fraction: number): string {
  const sign = fraction > 0 ? '+' : fraction < 0 ? '−' : ''
  return `${sign}${formatPercent(Math.abs(fraction))}`
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }): string {
  return new Intl.DateTimeFormat(LOCALE, opts).format(new Date(iso))
}

const RELATIVE_STEPS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
]

export function formatRelative(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000)
  const rtf = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' })
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit)
  }
  return 'just now'
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join('')
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64)
}
