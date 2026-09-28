<script setup lang="ts">
definePageMeta({ layout: 'app', title: 'Products' })
useHead({ title: 'Products' })

const route = useRoute()
const router = useRouter()
const { products, types } = useProducts()

const status = ref<'all' | 'published' | 'draft'>('all')
const type = ref<string>('all')
const query = ref('')
const wizardOpen = ref(route.query.new === '1')

const filtered = computed(() => products.value.filter(p =>
  (status.value === 'all' || p.status === status.value)
  && (type.value === 'all' || p.type === type.value)
  && (!query.value || `${p.title} ${p.tags.join(' ')}`.toLowerCase().includes(query.value.toLowerCase())),
))

function onCreated(id: string) {
  wizardOpen.value = false
  void navigateTo(`/products/${id}`)
}

function closeWizard() {
  wizardOpen.value = false
  if (route.query.new) void router.replace({ query: {} })
}
</script>

<template>
  <div>
    <PageIntro lead="Everything you sell — digital, live, recurring and physical — in one catalog.">
      <UiButton variant="secondary" icon="wand" to="/">Generate from photo</UiButton>
      <UiButton icon="plus" @click="wizardOpen = true">New product</UiButton>
    </PageIntro>

    <div class="toolbar">
      <UiSegmented v-model="status" label="Status" :options="[{ value: 'all', label: 'All' }, { value: 'published', label: 'Published' }, { value: 'draft', label: 'Drafts' }]" />
      <select v-model="type" class="toolbar__select" aria-label="Product type">
        <option value="all">All types</option>
        <option v-for="t in types" :key="t.id" :value="t.id">{{ t.label }}</option>
      </select>
      <label class="toolbar__search">
        <UiIcon name="search" :size="16" />
        <span class="visually-hidden">Search products</span>
        <input v-model="query" type="search" placeholder="Search products">
      </label>
    </div>

    <div v-if="filtered.length" class="grid">
      <ProductCard v-for="p in filtered" :key="p.id" :product="p" :to="`/products/${p.id}`" />
    </div>
    <UiEmpty v-else icon="box" title="No products match" text="Try another filter, or create a product.">
      <UiButton size="sm" icon="plus" @click="wizardOpen = true">New product</UiButton>
    </UiEmpty>

    <ProductCreateWizard :open="wizardOpen" @close="closeWizard" @created="onCreated" />
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  &__select,
  &__search {
    height: 2.4rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-pill);
    background: var(--c-surface);
    font-size: 0.85rem;
  }

  &__select { padding-inline: 0.9rem; }

  &__search {
    display: flex;
    flex: 1 1 14rem;
    align-items: center;
    gap: 0.5rem;
    padding-inline: 0.9rem;
    color: var(--c-muted);

    &:focus-within { border-color: var(--c-primary); }

    input { flex: 1; min-width: 0; border: none; background: none; outline: none; color: var(--c-ink); }
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
  gap: 1rem;
}
</style>
