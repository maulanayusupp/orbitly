// Checkout + product lifecycle rules as pure functions. They return new records
// and never mutate their inputs; the store decides how to apply them.
import type { ActivityEvent, Customer, Order, Product, ProductDraft, Workspace } from '~/types'
import { createId } from '~/utils/id'
import { slugify } from '~/utils/format'

export interface CheckoutInput {
  product: Product
  quantity: number
  buyer: { name: string; email: string }
  existing: Customer | undefined
  /** Client-generated key: the same key never produces two orders (mirrors an
   *  idempotent payment webhook, PRD §12). */
  idempotencyKey: string
}

export interface CheckoutResult {
  order: Order
  customer: Customer
  customerIsNew: boolean
  activity: ActivityEvent
}

export function checkout(input: CheckoutInput, workspace: Workspace): CheckoutResult {
  const { product, quantity, buyer, existing } = input
  const orderId = createId('o')
  const total = product.price * quantity
  const now = new Date().toISOString()

  const customer: Customer = existing
    ? {
        ...existing,
        status: 'active',
        lifetimeValue: existing.lifetimeValue + total,
        tags: existing.tags.includes(product.type) ? existing.tags : [...existing.tags, product.type],
      }
    : {
        id: createId('c'),
        workspaceId: workspace.id,
        name: buyer.name,
        email: buyer.email,
        status: 'active',
        lifetimeValue: total,
        firstSeenAt: now,
        tags: ['new', product.type],
      }

  const order: Order = {
    id: orderId,
    workspaceId: workspace.id,
    customerId: customer.id,
    total,
    currency: product.currency,
    status: 'paid',
    paymentReference: `sim_${input.idempotencyKey}`,
    items: [{ id: `${orderId}_1`, orderId, productId: product.id, quantity, unitPrice: product.price }],
    createdAt: now,
  }

  return {
    order,
    customer,
    customerIsNew: !existing,
    activity: { id: createId('a'), kind: 'order', customerId: customer.id, message: `${customer.name} bought ${product.title}`, createdAt: now },
  }
}

export function productFromDraft(draft: ProductDraft, workspace: Workspace, extras: Partial<Product> = {}): Product {
  return {
    id: createId('p'),
    workspaceId: workspace.id,
    type: draft.type,
    title: draft.title.trim() || 'Untitled product',
    slug: slugify(draft.title) || createId('item'),
    description: draft.description.trim(),
    price: Math.max(0, draft.price ?? 0),
    currency: workspace.currency,
    status: 'draft',
    category: draft.category,
    sku: draft.sku,
    tags: draft.tags,
    seoTitle: draft.seoTitle,
    seoDescription: draft.seoDescription,
    sales: 0,
    views: 0,
    createdAt: new Date().toISOString(),
    ...extras,
  }
}

/** Unique slug within the catalog. */
export function uniqueSlug(slug: string, products: Product[]): string {
  let candidate = slug
  let n = 2
  while (products.some(p => p.slug === candidate)) candidate = `${slug}-${n++}`
  return candidate
}

export function emptyDraft(): ProductDraft {
  return { title: '', description: '', category: '', price: null, sku: '', tags: [], seoTitle: '', seoDescription: '', type: 'digital' }
}

export function publishBlockers(p: Pick<Product, 'title' | 'description' | 'price'>): string[] {
  const issues: string[] = []
  if (!p.title.trim()) issues.push('Add a title')
  if (p.description.trim().length < 20) issues.push('Write a description of at least 20 characters')
  if (!(p.price >= 0)) issues.push('Set a price')
  return issues
}
