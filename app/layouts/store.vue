<script setup lang="ts">
const { workspace, ready } = useWorkspace()
</script>

<template>
  <div class="store">
    <div class="store__admin">
      <span><UiIcon name="eye" :size="14" /> Viewing your public storefront</span>
      <NuxtLink to="/dashboard">Back to dashboard <UiIcon name="arrowRight" :size="14" /></NuxtLink>
    </div>
    <header class="store__head">
      <NuxtLink to="/store" class="store__brand">
        <span class="store__logo" aria-hidden="true">K</span>
        <span>{{ workspace?.name ?? 'Store' }}</span>
      </NuxtLink>
      <nav class="store__nav" aria-label="Store">
        <NuxtLink to="/store">Shop</NuxtLink>
        <NuxtLink to="/community">Community</NuxtLink>
      </nav>
    </header>
    <main id="main" class="store__main">
      <slot v-if="ready" />
      <UiSkeleton v-else :lines="5" />
    </main>
    <footer class="store__foot">Powered by <BrandMark to="/" /></footer>
  </div>
</template>

<style lang="scss" scoped>
.store {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--c-surface);

  &__admin {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem $gutter;
    background: var(--c-ink);
    color: var(--c-faint);
    font-size: 0.78rem;

    span, a { display: inline-flex; align-items: center; gap: 0.35rem; }
    a { color: var(--c-surface); font-weight: 600; }
  }

  &__head {
    @include container;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: 4.5rem;
    border-bottom: 1px solid var(--c-line);
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-family: $font-display;
    font-size: 1.15rem;
    font-weight: 700;
  }

  &__logo {
    display: grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: var(--c-ink);
    color: var(--c-surface);
  }

  &__nav {
    display: flex;
    gap: 1.25rem;
    font-size: 0.9rem;
    font-weight: 500;
  }

  &__main {
    @include container;
    flex: 1;
    padding-block: 2rem 4rem;
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.5rem;
    border-top: 1px solid var(--c-line);
    color: var(--c-muted);
    font-size: 0.8rem;

    :deep(.brand__word) { font-size: 0.95rem; }
    :deep(.brand__mark) { width: 1.3rem; height: 1.3rem; }
  }
}
</style>
