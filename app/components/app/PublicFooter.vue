<script setup lang="ts">
import { GUIDES } from '~/config/content.config'

const product = [
  { to: '/features', label: 'Features' },
  { to: '/ai-product-description-generator', label: 'AI product description generator' },
  { to: '/use-cases', label: 'Use cases' },
  { to: '/#demo', label: 'Live demo' },
  { to: '/dashboard', label: 'Demo dashboard' },
]
</script>

<template>
  <footer class="pfoot">
    <div class="pfoot__inner">
      <div class="pfoot__brand">
        <BrandMark inverse />
        <p>One photo in. A product ready to sell — then run the whole creator business from one workspace.</p>
      </div>
      <nav class="pfoot__col" aria-label="Product">
        <p>Product</p>
        <NuxtLink v-for="l in product" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
      </nav>
      <nav class="pfoot__col" aria-label="Guides">
        <p>Guides</p>
        <NuxtLink to="/guides">All guides</NuxtLink>
        <NuxtLink v-for="g in GUIDES" :key="g.path" :to="g.path">{{ g.h1 }}</NuxtLink>
      </nav>
    </div>
    <div class="pfoot__bottom">
      <p>
        Frontend demo. Product generation runs locally in your browser — no image leaves your device and no AI
        service is called. Workspace data is sample data stored in this browser only.
      </p>
      <p>© {{ new Date().getFullYear() }} Orbitly concept</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.pfoot {
  background: var(--c-ink);
  color: var(--c-faint);

  &__inner {
    @include container;
    display: grid;
    gap: 2rem;
    padding-block: 3rem 2rem;

    @include respond-to('md') { grid-template-columns: 1.3fr 1fr 1fr; }
  }

  &__brand {
    display: grid;
    align-content: start;
    gap: 0.9rem;

    p { max-width: 22rem; font-size: 0.88rem; }
  }

  &__col {
    display: grid;
    align-content: start;
    gap: 0.55rem;
    font-size: 0.88rem;

    p { @include eyebrow; margin-bottom: 0.3rem; color: var(--c-surface); }
    a:hover { color: var(--c-surface); }
  }

  &__bottom {
    @include container;
    display: grid;
    gap: 0.5rem;
    padding-block: 1.25rem 2rem;
    border-top: 1px solid color-mix(in srgb, var(--c-surface) 10%, transparent);
    font-size: 0.78rem;

    @include respond-to('md') { grid-template-columns: 1fr auto; gap: 2rem; }
  }
}
</style>
