import type { CustomerStatus } from '~/types'

export interface Segment {
  id: string
  label: string
  match: (c: { status: CustomerStatus; tags: string[]; lifetimeValue: number }) => boolean
}

export const SEGMENTS: Segment[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'vip', label: 'VIP', match: c => c.tags.includes('vip') },
  { id: 'members', label: 'Members', match: c => c.tags.includes('membership') },
  { id: 'course', label: 'Course buyers', match: c => c.tags.includes('course') },
  { id: 'leads', label: 'Leads', match: c => c.status === 'lead' },
  { id: 'churned', label: 'Churned', match: c => c.status === 'churned' },
]

export function useCustomers() {
  const { store } = useWorkspace()
  const customers = computed(() => store.snapshot?.customers ?? [])
  const orders = computed(() => store.snapshot?.orders ?? [])

  function byId(id: string) {
    return customers.value.find(c => c.id === id)
  }

  function nameOf(id: string) {
    return byId(id)?.name ?? store.snapshot?.team.find(u => u.id === id)?.name ?? 'Member'
  }

  function ordersOf(id: string) {
    return orders.value.filter(o => o.customerId === id)
  }

  function productsOwned(id: string) {
    const ids = new Set(ordersOf(id).filter(o => o.status === 'paid').flatMap(o => o.items.map(i => i.productId)))
    return (store.snapshot?.products ?? []).filter(p => ids.has(p.id))
  }

  function membershipOf(id: string) {
    return store.snapshot?.memberships.find(m => m.customerId === id)
  }

  function timelineOf(id: string) {
    const events = (store.snapshot?.activity ?? []).filter(a => a.customerId === id)
    const orderEvents = ordersOf(id).map(o => ({
      id: `t_${o.id}`,
      kind: 'order' as const,
      message: `Order ${o.id.toUpperCase()} — ${o.items.length} item(s), ${o.status}`,
      createdAt: o.createdAt,
    }))
    const seen = byId(id)
    const first = seen ? [{ id: `t_first_${id}`, kind: 'signup' as const, message: 'First seen', createdAt: seen.firstSeenAt }] : []
    const merged = [...events, ...orderEvents, ...first]
    return merged
      .filter((e, i) => merged.findIndex(x => x.createdAt === e.createdAt && x.kind === e.kind) === i)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  return {
    customers,
    orders,
    segments: SEGMENTS,
    byId,
    nameOf,
    ordersOf,
    productsOwned,
    membershipOf,
    timelineOf,
    setTags: store.setCustomerTags,
  }
}
