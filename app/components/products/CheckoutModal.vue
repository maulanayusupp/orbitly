<script setup lang="ts">
// Simulated checkout. No payment details are collected: the demo only asks for
// a name and email, then runs the same order path a payment webhook would.
import type { Product } from '~/types'
import { createId } from '~/utils/id'

const props = defineProps<{ open: boolean; product: Product }>()
const emit = defineEmits<{ close: [] }>()
const { store } = useWorkspace()
const f = useFormat()

const name = ref('')
const email = ref('')
const quantity = ref(1)
const submitting = ref(false)
const error = ref('')
// One key per modal opening: double-clicking "Pay" cannot create two orders.
const key = ref(createId('key'))

watch(() => props.open, (o) => {
  if (o) { key.value = createId('key'); error.value = ''; quantity.value = 1 }
})

const total = computed(() => props.product.price * quantity.value)
const physical = computed(() => props.product.type === 'physical')

async function pay() {
  if (!name.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) {
    error.value = 'Enter your name and a valid email.'
    return
  }
  submitting.value = true
  await new Promise(r => setTimeout(r, 900))
  const result = store.placeOrder({
    product: props.product,
    quantity: quantity.value,
    buyer: { name: name.value.trim(), email: email.value.trim() },
    idempotencyKey: key.value,
  })
  submitting.value = false
  if (result) await navigateTo(`/store/order/${result.order.id}`)
}
</script>

<template>
  <UiModal :open="open" title="Checkout" size="sm" @close="emit('close')">
    <form id="checkout" class="co" novalidate @submit.prevent="pay">
      <div class="co__item">
        <strong>{{ product.title }}</strong>
        <span class="num">{{ f.money(product.price) }}</span>
      </div>
      <UiField v-if="physical" label="Quantity" for="co-qty">
        <input id="co-qty" v-model.number="quantity" type="number" min="1" max="10" class="input num">
      </UiField>
      <UiField label="Full name" for="co-name">
        <input id="co-name" v-model="name" class="input" autocomplete="name" placeholder="Your name">
      </UiField>
      <UiField label="Email" for="co-email" hint="Your access link is sent here.">
        <input id="co-email" v-model="email" type="email" class="input" autocomplete="email" placeholder="you@example.com">
      </UiField>
      <p class="co__sim"><UiIcon name="info" :size="16" /> Demo checkout — no payment is taken and no card details are requested.</p>
      <p v-if="error" class="co__err" role="alert">{{ error }}</p>
      <div class="co__total"><span>Total</span><strong class="num">{{ f.money(total) }}</strong></div>
    </form>
    <template #footer>
      <UiButton variant="ghost" @click="emit('close')">Cancel</UiButton>
      <UiButton type="submit" form="checkout" icon="lock" :loading="submitting">Pay {{ f.money(total) }}</UiButton>
    </template>
  </UiModal>
</template>

<style lang="scss" scoped>
.co {
  display: grid;
  gap: 1rem;

  &__item, &__total {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  &__item {
    padding: 0.8rem 1rem;
    border-radius: var(--radius-sm);
    background: var(--c-surface-2);
    font-size: 0.9rem;
  }

  &__total {
    padding-top: 0.8rem;
    border-top: 1px solid var(--c-line);
    font-size: 1.05rem;
  }

  &__sim {
    display: flex;
    gap: 0.4rem;
    color: var(--c-muted);
    font-size: 0.78rem;
  }

  &__err { color: var(--c-danger); font-size: 0.82rem; }
}
</style>
