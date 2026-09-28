<script setup lang="ts">
definePageMeta({ layout: 'store' })
useHead({ title: 'Shop' })

const { workspace } = useWorkspace()
const { published } = useProducts()
const { community } = useCommunity()
</script>

<template>
  <div class="shop">
    <section class="shop__hero">
      <h1>{{ workspace?.name }}</h1>
      <p>Pottery lessons, glaze recipes and handmade pieces from a small cone-6 studio. Join {{ community?.memberCount }} potters in {{ community?.name }}.</p>
    </section>
    <div class="shop__grid">
      <ProductCard v-for="p in published" :key="p.id" :product="p" :to="`/store/${p.slug}`" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shop {
  &__hero {
    display: grid;
    gap: 0.6rem;
    margin-bottom: 2rem;

    h1 { font-size: clamp(1.8rem, 5vw, 3rem); }
    p { max-width: 38rem; color: var(--c-muted); }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
    gap: 1rem;

    :deep(.pc__badges) { display: none; }
  }
}
</style>
