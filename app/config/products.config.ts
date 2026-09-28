import type { IconName } from '~/utils/iconPaths'
import type { ProductStatus, ProductType } from '~/types'

export interface ProductTypeMeta {
  id: ProductType
  label: string
  description: string
  icon: IconName
  /** What the buyer gets after checkout. */
  fulfillment: string
}

export const PRODUCT_TYPES: ProductTypeMeta[] = [
  { id: 'digital', label: 'Digital file', description: 'Templates, presets, e-books, packs.', icon: 'file', fulfillment: 'Instant download link' },
  { id: 'course', label: 'Course', description: 'Self-paced lessons with modules.', icon: 'book', fulfillment: 'Course player access' },
  { id: 'cohort', label: 'Cohort / event', description: 'Live sessions with a start date.', icon: 'calendar', fulfillment: 'Calendar invite + replay' },
  { id: 'membership', label: 'Membership', description: 'Recurring access to your community.', icon: 'crown', fulfillment: 'Community tier access' },
  { id: 'service', label: '1:1 service', description: 'Coaching calls, audits, reviews.', icon: 'video', fulfillment: 'Booking link' },
  { id: 'physical', label: 'Physical product', description: 'Goods you ship to a customer.', icon: 'truck', fulfillment: 'Shipping address + tracking' },
]

export const PRODUCT_STATUS_TONE: Record<ProductStatus, 'success' | 'neutral' | 'warn'> = {
  published: 'success',
  draft: 'warn',
  archived: 'neutral',
}

/** Steps of the manual create flow (PRD §5.B core flow). */
export const CREATE_STEPS = [
  { id: 'type', label: 'Type' },
  { id: 'details', label: 'Details' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'access', label: 'Access' },
  { id: 'publish', label: 'Publish' },
] as const

export type CreateStepId = (typeof CREATE_STEPS)[number]['id']
