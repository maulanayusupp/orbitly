<script setup lang="ts">
const scrolled = ref(false)
function onScroll() { scrolled.value = window.scrollY > 8 }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="phead" :class="{ 'is-scrolled': scrolled }">
    <div class="phead__inner">
      <BrandMark />
      <nav class="phead__nav" aria-label="Site">
        <a href="#how">How it works</a>
        <a href="#workspace">Workspace</a>
        <a href="#trust">Trust</a>
        <a href="#faq">FAQ</a>
      </nav>
      <UiButton to="/dashboard" variant="dark" size="sm" icon-right="arrowRight">Open dashboard</UiButton>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.phead {
  position: sticky;
  top: 0;
  z-index: z('header');
  border-bottom: 1px solid transparent;
  transition: background var(--dur), border-color var(--dur);

  &.is-scrolled {
    border-color: var(--c-line);
    @include glass(color-mix(in srgb, var(--c-bg) 84%, transparent));
  }

  &__inner {
    @include container;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    height: 4.25rem;
  }

  &__nav {
    display: none;
    gap: 1.75rem;
    color: var(--c-ink-2);
    font-size: 0.9rem;
    font-weight: 500;

    a:hover { color: var(--c-ink); }

    @include respond-to('md') { display: flex; }
  }
}
</style>
