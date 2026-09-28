<script setup lang="ts">
definePageMeta({ layout: 'app', title: 'Customers' })
useHead({ title: 'Customers' })

const { customers, segments, ordersOf } = useCustomers()
const f = useFormat()
const segment = ref('all')
const query = ref('')
const sort = ref<'ltv' | 'recent'>('ltv')

const rows = computed(() => {
  const seg = segments.find(s => s.id === segment.value)!
  const q = query.value.toLowerCase()
  return customers.value
    .filter(c => seg.match(c) && (!q || `${c.name} ${c.email} ${c.tags.join(' ')}`.toLowerCase().includes(q)))
    .map(c => {
      const orders = ordersOf(c.id)
      return { ...c, orders: orders.length, last: orders[0]?.createdAt }
    })
    .sort((a, b) => sort.value === 'ltv' ? b.lifetimeValue - a.lifetimeValue : (b.last ?? b.firstSeenAt).localeCompare(a.last ?? a.firstSeenAt))
})

const counts = computed(() => Object.fromEntries(segments.map(s => [s.id, customers.value.filter(c => s.match(c)).length])))
const totalLtv = computed(() => rows.value.reduce((s, c) => s + c.lifetimeValue, 0))
const statusTone = { active: 'success', lead: 'info', churned: 'neutral' } as const
</script>

<template>
  <div>
    <PageIntro lead="Every buyer, member and lead in one place — with what they bought and what they did.">
      <UiButton variant="secondary" size="sm" icon="megaphone" to="/marketing">Message a segment</UiButton>
    </PageIntro>

    <div class="segs" role="tablist" aria-label="Segments">
      <button
        v-for="s in segments"
        :key="s.id"
        type="button"
        role="tab"
        class="segs__tab"
        :class="{ 'is-on': segment === s.id }"
        :aria-selected="segment === s.id"
        @click="segment = s.id"
      >
        {{ s.label }} <span class="num">{{ counts[s.id] }}</span>
      </button>
    </div>

    <UiCard :padded="false">
      <div class="tbar">
        <label class="tbar__search">
          <UiIcon name="search" :size="16" />
          <span class="visually-hidden">Search customers</span>
          <input v-model="query" type="search" placeholder="Search name, email or tag">
        </label>
        <UiSegmented v-model="sort" label="Sort" :options="[{ value: 'ltv', label: 'Top LTV' }, { value: 'recent', label: 'Recent' }]" />
        <span class="tbar__sum num">{{ rows.length }} customers · {{ f.money(totalLtv, true) }} LTV</span>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr><th>Customer</th><th>Status</th><th>Tags</th><th class="r">Orders</th><th class="r">Lifetime value</th><th>Last activity</th></tr>
          </thead>
          <tbody>
            <tr v-for="c in rows" :key="c.id">
              <td>
                <NuxtLink :to="`/customers/${c.id}`" class="who">
                  <UiAvatar :name="c.name" size="sm" />
                  <span><strong>{{ c.name }}</strong><small>{{ c.email }}</small></span>
                </NuxtLink>
              </td>
              <td><UiBadge :tone="statusTone[c.status]" dot>{{ c.status }}</UiBadge></td>
              <td><span class="tags"><UiBadge v-for="t in c.tags.slice(0, 3)" :key="t" :tone="t === 'vip' ? 'flare' : 'neutral'">{{ t }}</UiBadge></span></td>
              <td class="r num">{{ c.orders }}</td>
              <td class="r num"><strong>{{ f.money(c.lifetimeValue) }}</strong></td>
              <td class="muted">{{ c.last ? f.relative(c.last) : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <UiEmpty v-if="!rows.length" icon="contact" title="No customers in this view" />
    </UiCard>
  </div>
</template>

<style lang="scss" scoped>
.segs {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 0.2rem;

  &__tab {
    flex-shrink: 0;
    padding: 0.45rem 0.9rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-pill);
    background: var(--c-surface);
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--c-ink-2);

    span { margin-left: 0.25rem; color: var(--c-faint); }
    &.is-on { border-color: var(--c-ink); background: var(--c-ink); color: var(--c-surface); span { color: var(--c-faint); } }
  }
}

.tbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--c-line);

  &__search {
    display: flex;
    flex: 1 1 14rem;
    align-items: center;
    gap: 0.5rem;
    height: 2.3rem;
    padding-inline: 0.8rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-pill);
    color: var(--c-muted);

    input { flex: 1; min-width: 0; border: none; outline: none; background: none; color: var(--c-ink); font-size: 0.85rem; }
  }

  &__sum { color: var(--c-muted); font-size: 0.8rem; }
}

.table-wrap { overflow-x: auto; }

.table {
  min-width: 46rem;
  font-size: 0.86rem;

  th {
    padding: 0.7rem 1rem;
    color: var(--c-muted);
    font-size: 0.74rem;
    font-weight: 600;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: var(--c-surface-2);
  }

  td {
    padding: 0.7rem 1rem;
    border-top: 1px solid var(--c-line);
    text-transform: capitalize;
  }

  tbody tr:hover { background: var(--c-surface-2); }

  .r { text-align: right; }
  .muted { color: var(--c-muted); text-transform: none; }
}

.who {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-transform: none;

  span { display: grid; line-height: 1.3; }
  small { color: var(--c-muted); font-size: 0.75rem; }
  &:hover strong { color: var(--c-primary); }
}

.tags { display: flex; flex-wrap: wrap; gap: 0.25rem; text-transform: none; }
</style>
