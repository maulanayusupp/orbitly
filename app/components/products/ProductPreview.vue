<script setup lang="ts">
// Public product page, presentational. Used for the landing preview, the
// product editor preview and the storefront itself.
import type { CurrencyCode, ProductType } from '~/types'
import { PRODUCT_TYPES } from '~/config/products.config'
import { formatMoney } from '~/utils/format'

const props = withDefaults(defineProps<{
  title: string
  description: string
  price: number | null
  currency: CurrencyCode
  type: ProductType
  coverUrl?: string
  category?: string
  tags?: string[]
  sku?: string
  storeName?: string
  seoTitle?: string
  seoDescription?: string
  slug?: string
  showSeo?: boolean
}>(), { tags: () => [], storeName: 'Kiln & Co.', coverUrl: undefined, category: undefined, sku: undefined, seoTitle: undefined, seoDescription: undefined, slug: undefined })
const emit = defineEmits<{ buy: [] }>()

const meta = computed(() => PRODUCT_TYPES.find(t => t.id === props.type))
const paragraphs = computed(() => props.description.split('\n').filter(l => l.trim()))
</script>

<template>
  <div class="pp-wrap">
  <article class="pp">
    <div class="pp__media">
      <img v-if="coverUrl" :src="coverUrl" :alt="title" class="pp__img">
      <div v-else class="pp__ph"><UiIcon :name="meta?.icon ?? 'box'" :size="42" /></div>
    </div>
    <div class="pp__info">
      <p class="pp__crumb">{{ storeName }}<template v-if="category"> · {{ category }}</template></p>
      <h2 class="pp__title">{{ title || 'Untitled product' }}</h2>
      <p class="pp__price num">{{ price === null ? '—' : formatMoney(price, currency) }}</p>
      <div class="pp__desc">
        <p v-for="(line, i) in paragraphs" :key="i" :class="{ 'pp__bullet': line.startsWith('•') }">{{ line }}</p>
      </div>
      <UiButton size="lg" block icon="cart" @click="emit('buy')">Buy now</UiButton>
      <ul class="pp__facts">
        <li><UiIcon name="zap" :size="15" /> {{ meta?.fulfillment }}</li>
        <li><UiIcon name="shield" :size="15" /> Secure checkout</li>
        <li v-if="sku"><UiIcon name="tag" :size="15" /> SKU {{ sku }}</li>
      </ul>
      <div v-if="tags.length" class="pp__tags">
        <span v-for="t in tags" :key="t">#{{ t.replace(/\s+/g, '') }}</span>
      </div>
    </div>
    <div v-if="showSeo && (seoTitle || seoDescription)" class="pp__seo">
      <p class="pp__seo-label">Search result preview</p>
      <p class="pp__seo-url">orbitly.shop › kilnandco › {{ slug || 'product' }}</p>
      <p class="pp__seo-title">{{ seoTitle }}</p>
      <p class="pp__seo-desc">{{ seoDescription }}</p>
    </div>
  </article>
  </div>
</template>

<style lang="scss" scoped>
.pp-wrap { container-type: inline-size; }

.pp {
  display: grid;
  gap: 1.5rem;

  @container (min-width: 34rem) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  &__media {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: var(--c-surface-2);
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__ph {
    display: grid;
    place-items: center;
    height: 100%;
    color: var(--c-faint);
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__crumb {
    color: var(--c-muted);
    font-size: 0.78rem;
  }

  &__title { font-size: clamp(1.4rem, 3vw, 1.9rem); }

  &__price {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 600;
  }

  &__desc {
    display: grid;
    gap: 0.35rem;
    color: var(--c-ink-2);
    font-size: 0.92rem;
  }

  &__bullet { color: var(--c-ink); }

  &__facts {
    display: grid;
    gap: 0.4rem;
    color: var(--c-muted);
    font-size: 0.82rem;

    li { display: flex; align-items: center; gap: 0.45rem; }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    color: var(--c-primary);
    font-size: 0.8rem;
  }

  &__seo {
    display: grid;
    gap: 0.15rem;
    padding: 1rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-md);

    @container (min-width: 34rem) { grid-column: 1 / -1; }
  }

  &__seo-label { @include eyebrow; margin-bottom: 0.4rem; color: var(--c-faint); }
  &__seo-url { color: var(--c-ai-ink); font-size: 0.78rem; }
  &__seo-title { color: var(--c-info); font-size: 1.05rem; }
  &__seo-desc { color: var(--c-muted); font-size: 0.85rem; }
}
</style>
