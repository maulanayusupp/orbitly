<script setup lang="ts">
const route = useRoute()
const { ready } = useWorkspace()
const menuOpen = ref(false)
const saleOpen = ref(false)
const title = computed(() => (route.meta.title as string | undefined) ?? 'Orbitly')

watch(() => route.fullPath, () => { menuOpen.value = false })
</script>

<template>
  <div class="shell">
    <a href="#main" class="skip-link">Skip to content</a>
    <AppSidebar :open="menuOpen" @close="menuOpen = false" />
    <div class="shell__main">
      <AppTopbar :title="title" @menu="menuOpen = true" @sale="saleOpen = true" />
      <main id="main" class="shell__content">
        <slot v-if="ready" />
        <div v-else class="shell__loading">
          <UiSkeleton :lines="2" />
          <div class="shell__loading-grid">
            <UiCard v-for="n in 4" :key="n"><UiSkeleton :lines="3" /></UiCard>
          </div>
        </div>
      </main>
    </div>
    <AppMobileNav />
    <QuickSaleModal v-if="ready" :open="saleOpen" @close="saleOpen = false" />
  </div>
</template>

<style lang="scss" scoped>
.shell {
  min-height: 100vh;

  &__main {
    @include respond-to('lg') { padding-left: $sidebar-width; }
  }

  &__content {
    width: 100%;
    max-width: 88rem;
    margin-inline: auto;
    padding: clamp(1rem, 3vw, 2rem) $gutter calc(6rem + env(safe-area-inset-bottom));

    @include respond-to('lg') { padding-bottom: 3rem; }
  }

  &__loading {
    display: grid;
    gap: 1.5rem;
    max-width: 40rem;
  }

  &__loading-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 1rem;
  }
}
</style>
