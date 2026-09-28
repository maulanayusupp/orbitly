<script setup lang="ts">
import { GUIDES } from '~/config/content.config'
import { usePageSeo } from '~/composables/usePageSeo'

const title = 'Guides for Creators: Product Copy, SEO & Pricing | Orbitly'
const description = 'Practical, no-fluff guides for creators and small online brands: writing product descriptions, product page SEO and pricing digital products.'
const siteUrl = useRuntimeConfig().public.siteUrl as string

useHead({ title, titleTemplate: '%s' })
usePageSeo(title, description)
useSchemaOrg([
  defineWebPage({ '@type': 'CollectionPage', name: 'Guides' }),
  defineBreadcrumb({ itemListElement: [{ name: 'Home', item: siteUrl }, { name: 'Guides', item: `${siteUrl}/guides` }] }),
])
</script>

<template>
  <div class="gi">
    <header class="gi__hero">
      <div class="gi__inner">
        <p class="gi__eyebrow">Guides</p>
        <h1>Sell better with fewer tools</h1>
        <p>Practical guides on the parts of a creator business that decide whether a product sells: the listing, the search result and the price.</p>
      </div>
    </header>
    <div class="gi__grid">
      <NuxtLink v-for="(g, i) in GUIDES" :key="g.path" :to="g.path" class="gi__card">
        <span class="gi__n num">0{{ i + 1 }}</span>
        <span class="gi__cat">{{ g.eyebrow.replace('Guide · ', '') }}</span>
        <h2>{{ g.h1 }}</h2>
        <p>{{ g.description }}</p>
        <span class="gi__go">Read the guide <UiIcon name="arrowRight" :size="14" /></span>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gi {
  padding-bottom: clamp(3rem, 7vw, 5rem);

  &__hero {
    padding-block: clamp(2.5rem, 6vw, 4.5rem);
    background: radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--c-primary) 14%, transparent), transparent 60%);
  }

  &__inner {
    @include container(46rem);
    display: grid;
    justify-items: center;
    gap: 0.8rem;
    text-align: center;

    h1 { font-size: clamp(2rem, 5vw, 3.2rem); letter-spacing: -0.035em; }
    p { color: var(--c-ink-2); font-size: 1.08rem; }
  }

  &__eyebrow { @include eyebrow; color: var(--c-primary); }

  &__grid {
    @include container(68rem);
    display: grid;
    gap: 1rem;

    @include respond-to('md') { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  &__card {
    @include surface(var(--radius-xl));
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1.5rem;
    transition: transform var(--dur) var(--ease-out), box-shadow var(--dur);

    &:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

    h2 { font-size: 1.2rem; line-height: 1.25; }
    p { color: var(--c-muted); font-size: 0.9rem; }
  }

  &__n {
    color: transparent;
    font-family: $font-display;
    font-size: 2.2rem;
    font-weight: 700;
    line-height: 1;
    @include orbit-text;
  }

  &__cat { @include eyebrow; color: var(--c-faint); font-size: 0.62rem; }

  &__go {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: auto;
    padding-top: 0.5rem;
    color: var(--c-primary);
    font-size: 0.86rem;
    font-weight: 600;
  }
}
</style>
