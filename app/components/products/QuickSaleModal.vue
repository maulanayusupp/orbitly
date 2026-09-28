<script setup lang="ts">
// "Simulate a new sale" (PRD §14.4): runs the same checkout path as the
// storefront, with a random published product and a random or new buyer.
import { pick } from '~/utils/id'
import { createId } from '~/utils/id'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const { store } = useWorkspace()
const { published } = useProducts()
const { customers } = useCustomers()
const { push } = useToast()
const f = useFormat()

const productId = ref('')
const buyerMode = ref<'existing' | 'new'>('existing')
const customerId = ref('')
const NEW_BUYERS = [['Nadia Putri', 'nadia.putri'], ['Leo Hartman', 'leo.hartman'], ['Sekar Ayu', 'sekar.ayu'], ['Marco Diaz', 'marco.diaz']] as const

watch(() => props.open, (open) => {
  if (!open) return
  productId.value = pick(published.value).id
  customerId.value = pick(customers.value.filter(c => c.status !== 'lead')).id
  buyerMode.value = Math.random() > 0.5 ? 'new' : 'existing'
})

const product = computed(() => published.value.find(p => p.id === productId.value))

function submit() {
  if (!product.value) return
  let buyer: { name: string; email: string }
  if (buyerMode.value === 'existing') {
    const c = customers.value.find(x => x.id === customerId.value)!
    buyer = { name: c.name, email: c.email }
  } else {
    const [name, handle] = pick(NEW_BUYERS)
    buyer = { name, email: `${handle}.${Math.floor(Math.random() * 900 + 100)}@mail.example` }
  }
  const result = store.placeOrder({ product: product.value, quantity: 1, buyer, idempotencyKey: createId('key') })
  if (result) push(`New sale: ${result.customer.name} bought ${product.value.title} (${f.money(result.order.total)})`)
  emit('close')
}
</script>

<template>
  <UiModal :open="open" title="Simulate a sale" size="sm" @close="emit('close')">
    <form id="quick-sale" class="qs" @submit.prevent="submit">
      <UiField label="Product" for="qs-product">
        <select id="qs-product" v-model="productId" class="input">
          <option v-for="p in published" :key="p.id" :value="p.id">{{ p.title }} — {{ f.money(p.price) }}</option>
        </select>
      </UiField>
      <UiSegmented
        v-model="buyerMode"
        label="Buyer"
        :options="[{ value: 'existing', label: 'Returning customer' }, { value: 'new', label: 'New customer' }]"
      />
      <UiField v-if="buyerMode === 'existing'" label="Customer" for="qs-customer">
        <select id="qs-customer" v-model="customerId" class="input">
          <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </UiField>
      <p class="qs__note">Runs the same checkout as the storefront: the order, customer record, revenue and activity feed all update.</p>
    </form>
    <template #footer>
      <UiButton variant="ghost" @click="emit('close')">Cancel</UiButton>
      <UiButton type="submit" form="quick-sale" icon="cart">Place test order</UiButton>
    </template>
  </UiModal>
</template>

<style lang="scss" scoped>
.qs {
  display: grid;
  gap: 1rem;

  &__note { color: var(--c-muted); font-size: 0.8rem; }
}
</style>
