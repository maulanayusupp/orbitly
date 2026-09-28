<script setup lang="ts">
definePageMeta({ layout: 'app', title: 'Product' })

const route = useRoute()
const { byId, update, setStatus, remove, blockers, typeMeta, types, conversion } = useProducts()
const { workspace } = useWorkspace()
const { push } = useToast()
const f = useFormat()

const product = computed(() => byId(route.params.id as string))
const fromGenerator = computed(() => route.query.from === 'generator')
const confirmDelete = ref(false)
useHead({ title: () => product.value?.title ?? 'Product' })

const issues = computed(() => (product.value ? blockers(product.value) : []))
const storeUrl = computed(() => (product.value ? `/store/${product.value.slug}` : ''))

function patch<K extends keyof NonNullable<typeof product.value>>(key: K, value: NonNullable<typeof product.value>[K]) {
  if (product.value) update(product.value.id, { [key]: value })
}

function publish() {
  if (!product.value || issues.value.length) return
  setStatus(product.value.id, 'published')
  push(`“${product.value.title}” is live on your storefront`)
}

function unpublish() {
  if (!product.value) return
  setStatus(product.value.id, 'draft')
  push('Moved back to drafts', 'info')
}

async function copyLink() {
  const url = `${window.location.origin}${storeUrl.value}`
  try {
    await navigator.clipboard.writeText(url)
    push('Product link copied')
  } catch {
    push(url, 'info')
  }
}

async function destroy() {
  if (!product.value) return
  const title = product.value.title
  remove(product.value.id)
  push(`Deleted “${title}”`, 'info')
  await navigateTo('/products')
}
</script>

<template>
  <div v-if="product" class="pe">
    <NuxtLink to="/products" class="pe__back"><UiIcon name="arrowLeft" :size="16" /> All products</NuxtLink>

    <div v-if="fromGenerator && product.status === 'draft'" class="pe__banner">
      <UiIcon name="sparkles" :size="20" />
      <div>
        <strong>Your AI-generated product now lives in {{ workspace?.name }}</strong>
        <p>It is saved as a draft. Review the details, then publish to put it on your storefront, attach it to your community and track it in analytics.</p>
      </div>
    </div>

    <div class="pe__head">
      <div class="pe__head-l">
        <UiBadge :tone="product.status === 'published' ? 'success' : 'warn'" dot>{{ product.status }}</UiBadge>
        <UiBadge v-if="product.aiGenerated" tone="ai" icon="sparkles">AI-generated</UiBadge>
        <span class="pe__stats num">{{ product.views }} views · {{ product.sales }} sold · {{ f.percent(conversion(product)) }} conversion</span>
      </div>
      <div class="pe__head-r">
        <template v-if="product.status === 'published'">
          <UiButton variant="secondary" size="sm" icon="link" @click="copyLink">Copy link</UiButton>
          <UiButton variant="secondary" size="sm" icon="eye" :to="storeUrl">View in store</UiButton>
          <UiButton variant="ghost" size="sm" @click="unpublish">Unpublish</UiButton>
        </template>
        <UiButton v-else icon="globe" :disabled="issues.length > 0" @click="publish">Publish</UiButton>
      </div>
    </div>

    <p v-if="product.status !== 'published' && issues.length" class="pe__issues">
      <UiIcon name="alert" :size="16" /> To publish: {{ issues.join(' · ') }}
    </p>

    <div class="pe__grid">
      <UiCard title="Details">
        <form class="pe__form" @submit.prevent>
          <UiField label="Title" for="pe-title">
            <input id="pe-title" :value="product.title" class="input" @input="patch('title', ($event.target as HTMLInputElement).value)">
          </UiField>
          <UiField label="Description" for="pe-desc">
            <textarea id="pe-desc" :value="product.description" rows="6" class="input" @input="patch('description', ($event.target as HTMLTextAreaElement).value)" />
          </UiField>
          <div class="pe__row">
            <UiField label="Price (USD)" for="pe-price">
              <input id="pe-price" :value="product.price" type="number" min="0" step="1" class="input num" @input="patch('price', Number(($event.target as HTMLInputElement).value) || 0)">
            </UiField>
            <UiField label="Type" for="pe-type" :hint="typeMeta(product.type).fulfillment">
              <select id="pe-type" :value="product.type" class="input" @change="patch('type', ($event.target as HTMLSelectElement).value as typeof product.type)">
                <option v-for="t in types" :key="t.id" :value="t.id">{{ t.label }}</option>
              </select>
            </UiField>
          </div>
          <div class="pe__row">
            <UiField label="Category" for="pe-cat">
              <input id="pe-cat" :value="product.category" class="input" @input="patch('category', ($event.target as HTMLInputElement).value)">
            </UiField>
            <UiField label="SKU" for="pe-sku">
              <input id="pe-sku" :value="product.sku" class="input num" @input="patch('sku', ($event.target as HTMLInputElement).value)">
            </UiField>
          </div>
          <UiField label="Tags" for="pe-tags">
            <UiTagInput id="pe-tags" :model-value="product.tags" @update:model-value="v => patch('tags', v)" />
          </UiField>
          <UiField label="SEO title" for="pe-seot">
            <input id="pe-seot" :value="product.seoTitle" class="input" maxlength="60" @input="patch('seoTitle', ($event.target as HTMLInputElement).value)">
          </UiField>
          <UiField label="SEO meta description" for="pe-seod">
            <textarea id="pe-seod" :value="product.seoDescription" rows="2" class="input" maxlength="155" @input="patch('seoDescription', ($event.target as HTMLTextAreaElement).value)" />
          </UiField>
        </form>
        <div class="pe__danger">
          <UiButton v-if="!confirmDelete" variant="ghost" size="sm" icon="trash" @click="confirmDelete = true">Delete product</UiButton>
          <template v-else>
            <span>Delete permanently from this demo?</span>
            <UiButton variant="ghost" size="sm" @click="confirmDelete = false">Cancel</UiButton>
            <UiButton variant="danger" size="sm" icon="trash" @click="destroy">Delete</UiButton>
          </template>
        </div>
      </UiCard>

      <UiCard title="Live preview" subtitle="Exactly what buyers will see" class="pe__preview">
        <ProductPreview
          :title="product.title"
          :description="product.description"
          :price="product.price"
          :currency="product.currency"
          :type="product.type"
          :cover-url="product.coverUrl"
          :category="product.category"
          :tags="product.tags"
          :sku="product.sku"
          :store-name="workspace?.name"
          :seo-title="product.seoTitle"
          :seo-description="product.seoDescription"
          :slug="product.slug"
          show-seo
          @buy="product.status === 'published' ? navigateTo(storeUrl) : push('Publish first to enable checkout', 'info')"
        />
      </UiCard>
    </div>
  </div>
  <UiEmpty v-else icon="box" title="Product not found" text="It may have been deleted.">
    <UiButton to="/products" size="sm">Back to products</UiButton>
  </UiEmpty>
</template>

<style lang="scss" scoped>
.pe {
  display: grid;
  gap: 1.25rem;

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--c-muted);
    font-size: 0.85rem;
    font-weight: 500;
    justify-self: start;

    &:hover { color: var(--c-ink); }
  }

  &__banner {
    display: flex;
    gap: 0.9rem;
    padding: 1rem 1.2rem;
    border: 1px solid var(--c-ai-line);
    border-radius: var(--radius-lg);
    background: var(--c-ai-wash);
    color: var(--c-ai-ink);

    p { margin-top: 0.2rem; color: var(--c-ink-2); font-size: 0.88rem; }
  }

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  &__head-l, &__head-r {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    text-transform: capitalize;
  }

  &__stats { color: var(--c-muted); font-size: 0.8rem; text-transform: none; }

  &__issues {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--c-warn);
    font-size: 0.85rem;
  }

  &__grid {
    display: grid;
    gap: 1.25rem;
    align-items: start;

    @include respond-to('xl') { grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); }
  }

  &__form { display: grid; gap: 1rem; }

  &__row {
    display: grid;
    gap: 1rem;

    @include respond-to('sm') { grid-template-columns: 1fr 1fr; }
  }

  &__danger {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid var(--c-line);
    font-size: 0.85rem;
  }

  &__preview {
    @include respond-to('xl') { position: sticky; top: calc($topbar-height + 1rem); }
  }
}
</style>
