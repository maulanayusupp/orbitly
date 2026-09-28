// Pure analytics over the workspace snapshot (PRD §5.H). No Vue imports.
import type { Campaign, Customer, KpiMetric, Membership, Order, Product, SeriesPoint } from '~/types'

const DAY = 86_400_000

function paid(orders: Order[]) {
  return orders.filter(o => o.status === 'paid')
}

function inWindow(orders: Order[], fromDaysAgo: number, toDaysAgo: number, now: number) {
  const from = now - fromDaysAgo * DAY
  const to = now - toDaysAgo * DAY
  return orders.filter((o) => {
    const t = new Date(o.createdAt).getTime()
    return t > from && t <= to
  })
}

function change(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 1 : 0
  return (current - previous) / previous
}

export function computeKpis(input: {
  orders: Order[]
  customers: Customer[]
  memberships: Membership[]
  periodDays?: number
  now?: number
}): KpiMetric[] {
  const { periodDays = 30, now = Date.now() } = input
  const current = paid(inWindow(input.orders, periodDays, 0, now))
  const previous = paid(inWindow(input.orders, periodDays * 2, periodDays, now))
  const sum = (os: Order[]) => os.reduce((s, o) => s + o.total, 0)
  const revenue = sum(current)
  const prevRevenue = sum(previous)
  const aov = current.length ? revenue / current.length : 0
  const prevAov = previous.length ? prevRevenue / previous.length : 0
  const uniq = (os: Order[]) => new Set(os.map(o => o.customerId)).size
  const active = input.memberships.filter(m => m.status !== 'cancelled')
  const joinedInPeriod = active.filter(m => now - new Date(m.startedAt).getTime() <= periodDays * DAY).length

  return [
    { id: 'revenue', label: 'Revenue', value: revenue, format: 'currency', delta: change(revenue, prevRevenue) },
    { id: 'orders', label: 'Orders', value: current.length, format: 'number', delta: change(current.length, previous.length) },
    { id: 'aov', label: 'Avg. order value', value: aov, format: 'currency', delta: change(aov, prevAov) },
    { id: 'customers', label: 'Paying customers', value: uniq(current), format: 'number', delta: change(uniq(current), uniq(previous)) },
    { id: 'members', label: 'Active members', value: active.length, format: 'number', delta: change(active.length, active.length - joinedInPeriod) },
  ]
}

export function revenueSeries(orders: Order[], days = 30, now = Date.now()): SeriesPoint[] {
  const buckets: SeriesPoint[] = []
  const end = new Date(now)
  end.setHours(0, 0, 0, 0)
  for (let i = days - 1; i >= 0; i--) {
    const start = end.getTime() - i * DAY
    const total = paid(orders)
      .filter((o) => {
        const t = new Date(o.createdAt).getTime()
        return t >= start && t < start + DAY
      })
      .reduce((s, o) => s + o.total, 0)
    buckets.push({
      label: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(start),
      value: total,
    })
  }
  return buckets
}

export function revenueByProduct(orders: Order[], products: Product[]): Array<{ product: Product; revenue: number; units: number }> {
  const map = new Map<string, { revenue: number; units: number }>()
  for (const o of paid(orders)) {
    for (const item of o.items) {
      const row = map.get(item.productId) ?? { revenue: 0, units: 0 }
      row.revenue += item.unitPrice * item.quantity
      row.units += item.quantity
      map.set(item.productId, row)
    }
  }
  return products
    .map(p => ({ product: p, ...(map.get(p.id) ?? { revenue: 0, units: 0 }) }))
    .sort((a, b) => b.revenue - a.revenue)
}

/** Buyers / views — the demo's product conversion metric. */
export function conversionRate(product: Product): number {
  return product.views ? product.sales / product.views : 0
}

export function campaignRates(c: Campaign) {
  return {
    openRate: c.sent ? c.opened / c.sent : 0,
    clickRate: c.opened ? c.clicked / c.opened : 0,
  }
}

export function communityGrowth(baseMembers: number, weeks = 8): SeriesPoint[] {
  // Back-cast a steady ~4% weekly growth curve ending at today's member count.
  return Array.from({ length: weeks }, (_, i) => {
    const w = weeks - 1 - i
    return { label: w === 0 ? 'Now' : `-${w}w`, value: Math.round(baseMembers / 1.04 ** w) }
  })
}
