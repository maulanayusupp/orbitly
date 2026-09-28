<script setup lang="ts">
import type { Product } from '~/types'
import { PRODUCT_STATUS_TONE } from '~/config/products.config'

const props = defineProps<{ product: Product; to: string }>()
const { typeMeta, conversion } = useProducts()
const f = useFormat()
const meta = computed(() => typeMeta(props.product.type))
</script>

<template>
  <NuxtLink :to="to" class="pc">
    <div class="pc__media">
      <img v-if="product.coverUrl" :src="product.coverUrl" :alt="product.title">
      <div v-else class="pc__ph" :class="`pc__ph--${product.type}`"><UiIcon :name="meta.icon" :size="34" /></div>
      <div class="pc__badges">
        <UiBadge :tone="PRODUCT_STATUS_TONE[product.status]" dot>{{ product.status }}</UiBadge>
        <UiBadge v-if="product.aiGenerated" tone="ai" icon="sparkles">AI</UiBadge>
      </div>
    </div>
    <div class="pc__body">
      <p class="pc__type">{{ meta.label }}</p>
      <h3 class="pc__title">{{ product.title }}</h3>
      <div class="pc__foot">
        <span class="pc__price num">{{ f.money(product.price) }}</span>
        <span class="pc__stats num">{{ product.sales }} sold · {{ f.percent(conversion(product)) }} conv.</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.pc {
  @include surface;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform var(--dur), box-shadow var(--dur);

  &:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

  &__media {
    position: relative;
    aspect-ratio: 4 / 3;
    background: var(--c-surface-2);

    img { width: 100%; height: 100%; object-fit: cover; }
  }

  &__ph {
    display: grid;
    place-items: center;
    height: 100%;
    color: var(--c-primary);
    background: radial-gradient(circle at 30% 20%, var(--c-primary-soft), var(--c-surface-2));

    &--membership, &--cohort { color: var(--c-flare); background: radial-gradient(circle at 30% 20%, var(--c-flare-soft), var(--c-surface-2)); }
    &--digital, &--service { color: var(--c-ai); background: radial-gradient(circle at 30% 20%, var(--c-ai-wash), var(--c-surface-2)); }
  }

  &__badges {
    position: absolute;
    top: 0.6rem;
    left: 0.6rem;
    display: flex;
    gap: 0.35rem;
    text-transform: capitalize;
  }

  &__body {
    display: grid;
    gap: 0.3rem;
    padding: 0.9rem 1rem 1rem;
  }

  &__type { @include eyebrow; color: var(--c-faint); font-size: 0.62rem; }
  &__title { @include line-clamp(2); font-size: 0.98rem; }

  &__foot {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.4rem;
    margin-top: 0.3rem;
  }

  &__price { font-weight: 700; }
  &__stats { color: var(--c-muted); font-size: 0.75rem; }
}
</style>
