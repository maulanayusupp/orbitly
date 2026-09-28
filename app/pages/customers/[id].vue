<script setup lang="ts">
definePageMeta({ layout: 'app', title: 'Customer' })

const route = useRoute()
const { byId, ordersOf, productsOwned, membershipOf, timelineOf, setTags } = useCustomers()
const { byId: productById, typeMeta } = useProducts()
const f = useFormat()

const id = computed(() => route.params.id as string)
const customer = computed(() => byId(id.value))
const orders = computed(() => ordersOf(id.value))
const owned = computed(() => productsOwned(id.value))
const membership = computed(() => membershipOf(id.value))
const timeline = computed(() => timelineOf(id.value))
const tags = computed({
  get: () => customer.value?.tags ?? [],
  set: v => setTags(id.value, v),
})
useHead({ title: () => customer.value?.name ?? 'Customer' })
</script>

<template>
  <div v-if="customer" class="cp">
    <NuxtLink to="/customers" class="cp__back"><UiIcon name="arrowLeft" :size="16" /> All customers</NuxtLink>

    <div class="cp__head">
      <UiAvatar :name="customer.name" size="lg" />
      <div>
        <h2>{{ customer.name }}</h2>
        <p>{{ customer.email }}<template v-if="customer.city"> · {{ customer.city }}</template> · first seen {{ f.date(customer.firstSeenAt) }}</p>
      </div>
    </div>

    <div class="cp__stats">
      <UiCard><p class="cp__k">Lifetime value</p><p class="cp__v num">{{ f.money(customer.lifetimeValue) }}</p></UiCard>
      <UiCard><p class="cp__k">Orders</p><p class="cp__v num">{{ orders.length }}</p></UiCard>
      <UiCard><p class="cp__k">Products owned</p><p class="cp__v num">{{ owned.length }}</p></UiCard>
      <UiCard>
        <p class="cp__k">Membership</p>
        <p class="cp__v cp__v--sm">
          <UiBadge v-if="membership" :tone="membership.status === 'active' ? 'success' : membership.status === 'trialing' ? 'info' : 'neutral'" dot>
            {{ membership.tierId === 'tier_patron' ? 'Patron' : 'Circle' }} · {{ membership.status }}
          </UiBadge>
          <span v-else>None</span>
        </p>
      </UiCard>
    </div>

    <div class="cp__grid">
      <div class="cp__col">
        <UiCard title="Tags" subtitle="Used for segments and campaigns">
          <UiTagInput id="cp-tags" v-model="tags" placeholder="Add a tag" />
        </UiCard>
        <UiCard title="Products owned">
          <ul v-if="owned.length" class="cp__owned">
            <li v-for="p in owned" :key="p.id">
              <UiIcon :name="typeMeta(p.type).icon" :size="18" />
              <NuxtLink :to="`/products/${p.id}`">{{ p.title }}</NuxtLink>
              <span>{{ typeMeta(p.type).label }}</span>
            </li>
          </ul>
          <UiEmpty v-else icon="box" title="No purchases yet" />
        </UiCard>
        <UiCard title="Orders" :padded="false">
          <div class="cp__table">
            <table>
              <thead><tr><th>Order</th><th>Items</th><th>Status</th><th class="r">Total</th><th>Date</th></tr></thead>
              <tbody>
                <tr v-for="o in orders" :key="o.id">
                  <td class="num">{{ o.id.toUpperCase() }}</td>
                  <td>{{ o.items.map(i => productById(i.productId)?.title ?? 'Removed product').join(', ') }}</td>
                  <td><UiBadge :tone="o.status === 'paid' ? 'success' : o.status === 'refunded' ? 'danger' : 'warn'">{{ o.status }}</UiBadge></td>
                  <td class="r num">{{ f.money(o.total) }}</td>
                  <td>{{ f.date(o.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <UiEmpty v-if="!orders.length" icon="cart" title="No orders" />
        </UiCard>
      </div>
      <UiCard title="Activity timeline">
        <ol class="cp__tl">
          <li v-for="e in timeline" :key="e.id">
            <span class="cp__dot" :class="`cp__dot--${e.kind}`" />
            <div><p>{{ e.message }}</p><time :datetime="e.createdAt">{{ f.date(e.createdAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }}</time></div>
          </li>
        </ol>
      </UiCard>
    </div>
  </div>
  <UiEmpty v-else icon="contact" title="Customer not found"><UiButton to="/customers" size="sm">Back</UiButton></UiEmpty>
</template>

<style lang="scss" scoped>
.cp {
  display: grid;
  gap: 1.25rem;

  &__back { display: inline-flex; align-items: center; gap: 0.35rem; justify-self: start; color: var(--c-muted); font-size: 0.85rem; }

  &__head {
    display: flex;
    align-items: center;
    gap: 1rem;

    h2 { font-size: 1.5rem; }
    p { color: var(--c-muted); font-size: 0.88rem; }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @include respond-to('md') { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  &__k { color: var(--c-muted); font-size: 0.78rem; }
  &__v { font-family: $font-display; font-size: 1.4rem; font-weight: 600; text-transform: capitalize; }
  &__v--sm { font-size: 1rem; margin-top: 0.3rem; }

  &__grid {
    display: grid;
    gap: 1.25rem;
    align-items: start;

    @include respond-to('lg') { grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); }
  }

  &__col { display: grid; gap: 1.25rem; }

  &__owned li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding-block: 0.5rem;
    border-bottom: 1px solid var(--c-line);
    font-size: 0.88rem;

    &:last-child { border-bottom: none; }
    .ui-icon { color: var(--c-primary); }
    a { flex: 1; font-weight: 500; &:hover { color: var(--c-primary); } }
    span { color: var(--c-muted); font-size: 0.78rem; }
  }

  &__table {
    overflow-x: auto;

    table { min-width: 34rem; font-size: 0.84rem; }
    th { padding: 0.6rem 1rem; background: var(--c-surface-2); color: var(--c-muted); font-size: 0.72rem; text-align: left; text-transform: uppercase; }
    td { padding: 0.6rem 1rem; border-top: 1px solid var(--c-line); text-transform: capitalize; }
    .r { text-align: right; }
  }

  &__tl {
    display: grid;
    gap: 1rem;

    li { position: relative; display: flex; gap: 0.75rem; }
    p { font-size: 0.86rem; }
    time { color: var(--c-faint); font-size: 0.74rem; }
  }

  &__dot {
    width: 0.65rem;
    height: 0.65rem;
    margin-top: 0.35rem;
    border-radius: 50%;
    background: var(--c-line-strong);
    flex-shrink: 0;

    &--order { background: var(--c-success); }
    &--signup { background: var(--c-primary); }
    &--post { background: var(--c-flare); }
  }
}
</style>
