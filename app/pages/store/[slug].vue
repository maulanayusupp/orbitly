<script setup lang="ts">
definePageMeta({ layout: 'store' })

const route = useRoute()
const { bySlug, recordView } = useProducts()
const { workspace } = useWorkspace()
const product = computed(() => bySlug(route.params.slug as string))
const checkoutOpen = ref(false)

useHead({
  title: () => product.value?.seoTitle || product.value?.title || 'Product',
  meta: [{ name: 'description', content: () => product.value?.seoDescription ?? '' }],
})

onMounted(() => { if (product.value) recordView(product.value.id) })
</script>

<template>
  <div v-if="product && product.status === 'published'">
    <NuxtLink to="/store" class="back"><UiIcon name="arrowLeft" :size="16" /> Shop</NuxtLink>
    <ProductPreview
      :title="product.title"
      :description="product.description"
      :price="product.price"
      :currency="product.currency"
      :type="product.type"
      :cover-url="product.coverUrl"
      :category="product.category"
      :tags="product.tags"
      :store-name="workspace?.name"
      @buy="checkoutOpen = true"
    />
    <CheckoutModal :open="checkoutOpen" :product="product" @close="checkoutOpen = false" />
  </div>
  <UiEmpty v-else icon="store" title="This product is not available" text="It may be unpublished or removed.">
    <UiButton to="/store" size="sm">Browse the shop</UiButton>
  </UiEmpty>
</template>

<style lang="scss" scoped>
.back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
  color: var(--c-muted);
  font-size: 0.85rem;
}
</style>
