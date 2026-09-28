<script setup lang="ts">
// Order confirmation + customer access page (PRD §5.C).
definePageMeta({ layout: 'store' })
useHead({ title: 'Order confirmed' })

const route = useRoute()
const { store } = useWorkspace()
const { byId: productById, typeMeta } = useProducts()
const { byId: customerById } = useCustomers()
const f = useFormat()

const order = computed(() => store.snapshot?.orders.find(o => o.id === route.params.id))
const customer = computed(() => (order.value ? customerById(order.value.customerId) : undefined))
const items = computed(() => order.value?.items.map(i => ({ ...i, product: productById(i.productId) })) ?? [])
</script>

<template>
  <div v-if="order" class="oc">
    <div class="oc__head">
      <span class="oc__check"><UiIcon name="check" :size="28" :stroke-width="2.4" /></span>
      <h1>Thank you, {{ customer?.name.split(' ')[0] }}!</h1>
      <p>Order <strong class="num">{{ order.id.toUpperCase() }}</strong> is confirmed. A receipt would go to {{ customer?.email }}.</p>
    </div>

    <UiCard title="Your access">
      <ul class="oc__items">
        <li v-for="i in items" :key="i.id">
          <UiIcon :name="i.product ? typeMeta(i.product.type).icon : 'box'" :size="22" />
          <div>
            <strong>{{ i.product?.title }}</strong>
            <span>{{ i.product ? typeMeta(i.product.type).fulfillment : '' }} · qty {{ i.quantity }}</span>
          </div>
          <UiButton size="sm" variant="secondary" icon="arrowUpRight" :to="i.product?.type === 'membership' ? '/community' : undefined">
            {{ i.product?.type === 'membership' ? 'Enter community' : i.product?.type === 'physical' ? 'Track order' : 'Open' }}
          </UiButton>
        </li>
      </ul>
      <div class="oc__total"><span>Paid</span><strong class="num">{{ f.money(order.total) }}</strong></div>
    </UiCard>

    <div class="oc__owner">
      <UiIcon name="info" :size="18" />
      <p>As the store owner, this order is already in your CRM, revenue and activity feed.</p>
      <UiButton size="sm" variant="dark" :to="`/customers/${order.customerId}`">View customer</UiButton>
    </div>
  </div>
  <UiEmpty v-else icon="cart" title="Order not found" />
</template>

<style lang="scss" scoped>
.oc {
  display: grid;
  gap: 1.5rem;
  max-width: 40rem;
  margin-inline: auto;

  &__head {
    display: grid;
    justify-items: center;
    gap: 0.5rem;
    text-align: center;

    h1 { font-size: clamp(1.6rem, 4vw, 2.2rem); }
    p { color: var(--c-muted); }
  }

  &__check {
    display: grid;
    place-items: center;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: var(--c-success-soft);
    color: var(--c-success);
  }

  &__items {
    display: grid;
    gap: 0.8rem;

    li { display: flex; align-items: center; gap: 0.8rem; }
    .ui-icon { color: var(--c-primary); }
    div { display: grid; flex: 1; min-width: 0; }
    span { color: var(--c-muted); font-size: 0.8rem; }
  }

  &__total {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    padding-top: 0.8rem;
    border-top: 1px solid var(--c-line);
  }

  &__owner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.7rem;
    padding: 0.9rem 1rem;
    border-radius: var(--radius-md);
    background: var(--c-surface-2);
    font-size: 0.85rem;

    p { flex: 1 1 14rem; }
  }
}
</style>
