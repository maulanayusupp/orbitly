<script setup lang="ts">
// Public product page, presentational. Used for the landing preview, the
// product editor preview (both `framed` in a browser mock) and the storefront.
// Layout responds to its own width via container queries, so it works in a
// half-width card as well as a full page.
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
  framed?: boolean
  /** Workspace slug for the mock URL; derived from the store name if absent. */
  storeSlug?: string
}>(), { tags: () => [], storeName: 'Kiln & Co.', coverUrl: undefined, category: undefined, sku: undefined, seoTitle: undefined, seoDescription: undefined, slug: undefined, storeSlug: undefined })
const emit = defineEmits<{ buy: [] }>()

const meta = computed(() => PRODUCT_TYPES.find(t => t.id === props.type))
const lines = computed(() => props.description.split('\n').map(l => l.trim()).filter(Boolean))
const intro = computed(() => lines.value.filter(l => !l.startsWith('•')))
const benefits = computed(() => lines.value.filter(l => l.startsWith('•')).map(l => l.replace(/^•\s*/, '')))
const crumbs = computed(() => (props.category ?? '').split('›').map(c => c.trim()).filter(Boolean))
const storeSlug = computed(() => props.storeSlug ?? props.storeName.toLowerCase().replace(/[^a-z0-9]+/g, ''))
const path = computed(() => `orbitly.shop/${storeSlug.value}/${props.slug || 'product'}`)
</script>

<template>
  <div class="pp-wrap" :class="{ 'pp-wrap--framed': framed }">
    <div v-if="framed" class="pp-bar" aria-hidden="true">
      <span class="pp-bar__dots"><i /><i /><i /></span>
      <span class="pp-bar__url"><UiIcon name="lock" :size="12" :stroke-width="2" /> {{ path }}</span>
    </div>

    <div class="pp-page">
      <header v-if="framed" class="pp-store" aria-hidden="true">
        <span class="pp-store__logo">{{ storeName.charAt(0) }}</span>
        <strong>{{ storeName }}</strong>
        <span class="pp-store__nav">Shop · Community</span>
        <UiIcon name="cart" :size="16" />
      </header>

      <article class="pp">
        <div class="pp__media">
          <div class="pp__stage">
            <img v-if="coverUrl" :src="coverUrl" :alt="title" class="pp__img">
            <div v-else class="pp__ph"><UiIcon :name="meta?.icon ?? 'box'" :size="46" /></div>
          </div>
          <span class="pp__type"><UiIcon :name="meta?.icon ?? 'box'" :size="13" :stroke-width="2" /> {{ meta?.label }}</span>
        </div>

        <div class="pp__info">
          <nav v-if="crumbs.length" class="pp__crumbs" aria-label="Category">
            <span v-for="(c, i) in crumbs" :key="c">{{ c }}<UiIcon v-if="i < crumbs.length - 1" name="chevronRight" :size="12" /></span>
          </nav>

          <h2 class="pp__title">{{ title || 'Untitled product' }}</h2>

          <div class="pp__price-row">
            <p class="pp__price num">{{ price === null ? '—' : formatMoney(price, currency) }}</p>
          </div>

          <p v-for="(p, i) in intro" :key="i" class="pp__desc">{{ p }}</p>

          <ul v-if="benefits.length" class="pp__benefits">
            <li v-for="b in benefits" :key="b"><span class="pp__tick"><UiIcon name="check" :size="12" :stroke-width="2.6" /></span>{{ b }}</li>
          </ul>

          <div class="pp__buy">
            <UiButton size="lg" block icon="cart" @click="emit('buy')">Buy now</UiButton>
          </div>

          <ul class="pp__facts">
            <li><UiIcon name="zap" :size="16" /><span><strong>Delivery</strong><em>{{ meta?.fulfillment }}</em></span></li>
            <li><UiIcon name="shield" :size="16" /><span><strong>Checkout</strong><em>Secure payment</em></span></li>
            <li v-if="sku"><UiIcon name="tag" :size="16" /><span><strong>SKU</strong><em><code>{{ sku }}</code></em></span></li>
          </ul>

          <div v-if="tags.length" class="pp__tags">
            <span v-for="t in tags" :key="t">#{{ t.replace(/\s+/g, '') }}</span>
          </div>
        </div>
      </article>
    </div>

    <section v-if="showSeo && (seoTitle || seoDescription)" class="pp-seo" aria-label="Search result preview">
      <p class="pp-seo__label"><UiIcon name="search" :size="13" /> Search result preview</p>
      <div class="pp-seo__card">
        <div class="pp-seo__site">
          <span class="pp-seo__fav">{{ storeName.charAt(0) }}</span>
          <span><strong>{{ storeName }}</strong><small>https://{{ path.replace(/\//g, ' › ') }}</small></span>
        </div>
        <p class="pp-seo__title">{{ seoTitle }}</p>
        <p class="pp-seo__desc">{{ seoDescription }}</p>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.pp-wrap {
  container-type: inline-size;
  display: grid;
  gap: 1.25rem;

  &--framed .pp-page {
    border: 1px solid var(--c-line);
    border-top: none;
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    background: var(--c-surface);
    box-shadow: var(--shadow-md);
  }

  &--framed .pp { padding: clamp(1rem, 4cqi, 1.75rem); }
}

// ---- browser chrome ------------------------------------------------------
.pp-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: -1.25rem; // sit flush on the page below (cancels grid gap)
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--c-surface-2);

  &__dots {
    display: flex;
    gap: 0.3rem;

    i {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      background: var(--c-line-strong);
    }
  }

  &__url {
    display: inline-flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    min-width: 0;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-pill);
    background: var(--c-surface);
    color: var(--c-muted);
    font-family: $font-mono;
    font-size: 0.7rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .ui-icon { color: var(--c-success); flex-shrink: 0; }
  }
}

.pp-store {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem clamp(1rem, 4cqi, 1.75rem);
  border-bottom: 1px solid var(--c-line);
  font-size: 0.85rem;

  &__logo {
    display: grid;
    place-items: center;
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 50%;
    background: var(--c-ink);
    color: var(--c-surface);
    font-family: $font-display;
    font-size: 0.75rem;
    font-weight: 700;
  }

  &__nav {
    margin-left: auto;
    color: var(--c-muted);
    font-size: 0.78rem;

    @container (max-width: 26rem) { display: none; }
  }

  .ui-icon { color: var(--c-ink-2); }
}

// ---- product -------------------------------------------------------------
.pp {
  display: grid;
  gap: clamp(1.25rem, 4cqi, 2.25rem);

  @container (min-width: 36rem) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }

  &__media {
    position: relative;

    @container (min-width: 36rem) { position: sticky; top: 1rem; }
  }

  &__stage {
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: var(--radius-lg);
    background:
      radial-gradient(circle at 50% 38%, var(--c-surface) 0%, transparent 62%),
      linear-gradient(160deg, var(--c-surface-2), color-mix(in srgb, var(--c-line) 70%, var(--c-surface-2)));
    box-shadow: inset 0 0 0 1px var(--c-line);
  }

  &__img {
    width: 86%;
    height: 86%;
    object-fit: contain;
    filter: drop-shadow(var(--shadow-drop));
  }

  &__ph { color: var(--c-faint); }

  &__type {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.3rem 0.6rem;
    border-radius: var(--radius-pill);
    @include glass;
    color: var(--c-ink-2);
    font-size: 0.72rem;
    font-weight: 600;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    min-width: 0;
  }

  &__crumbs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    color: var(--c-muted);
    font-size: 0.75rem;
    font-weight: 500;

    span { display: inline-flex; align-items: center; gap: 0.3rem; }
  }

  &__title {
    font-size: clamp(1.35rem, 5cqi, 2.05rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.1;
  }

  &__price-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid var(--c-line);
  }

  &__price {
    font-family: $font-display;
    font-size: clamp(1.4rem, 4.5cqi, 1.75rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  &__desc {
    color: var(--c-ink-2);
    font-size: 0.92rem;
    line-height: 1.65;
  }

  &__benefits {
    display: grid;
    gap: 0.5rem;
    padding: 0.9rem 1rem;
    border-radius: var(--radius-md);
    background: var(--c-surface-2);
    font-size: 0.86rem;

    li { display: flex; align-items: center; gap: 0.6rem; }
  }

  &__tick {
    display: grid;
    place-items: center;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    background: var(--c-success-soft);
    color: var(--c-success);
    flex-shrink: 0;
  }

  &__buy { margin-top: 0.25rem; }

  &__facts {
    display: grid;
    gap: 0.5rem;

    gap: 0;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-md);

    li {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 0.85rem;
      color: var(--c-muted);
      font-size: 0.8rem;

      & + li { border-top: 1px solid var(--c-line); }
    }

    .ui-icon { color: var(--c-primary); flex-shrink: 0; }
    span { display: flex; flex: 1; justify-content: space-between; gap: 1rem; min-width: 0; }
    strong { color: var(--c-ink); font-weight: 600; flex-shrink: 0; }
    em { font-style: normal; text-align: right; }
    code { overflow-wrap: anywhere; }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;

    span {
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-pill);
      background: var(--c-primary-soft);
      color: var(--c-primary);
      font-size: 0.74rem;
      font-weight: 500;
    }
  }
}

// ---- SEO snippet ---------------------------------------------------------
.pp-seo {
  display: grid;
  gap: 0.5rem;

  &__label {
    @include eyebrow;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--c-faint);
  }

  &__card {
    display: grid;
    gap: 0.3rem;
    padding: 1rem 1.1rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-md);
    background: var(--c-surface);
  }

  &__site {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.2rem;

    span:last-child { display: grid; min-width: 0; line-height: 1.3; }
    strong { font-size: 0.8rem; }
    small { overflow: hidden; color: var(--c-muted); font-size: 0.72rem; text-overflow: ellipsis; white-space: nowrap; }
  }

  &__fav {
    display: grid;
    place-items: center;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: var(--c-ink);
    color: var(--c-surface);
    font-size: 0.7rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  &__title { color: var(--c-info); font-size: 1.05rem; line-height: 1.3; }
  &__desc { color: var(--c-muted); font-size: 0.85rem; }
}
</style>
