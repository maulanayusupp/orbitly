<script setup lang="ts">
import { FAQ, HOME_SEO } from '~/config/landing.config'
import { usePageSeo } from '~/composables/usePageSeo'

useHead({ title: HOME_SEO.title, titleTemplate: '%s' })
usePageSeo(HOME_SEO.title, HOME_SEO.description, { imageAlt: HOME_SEO.imageAlt })

const siteUrl = useRuntimeConfig().public.siteUrl as string
useSchemaOrg([
  defineWebSite({ name: 'Orbitly', description: HOME_SEO.description }),
  defineWebPage({ '@type': ['WebPage', 'FAQPage'], name: HOME_SEO.title }),
  defineSoftwareApp({
    name: 'Orbitly',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: HOME_SEO.description,
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    offers: { price: 0, priceCurrency: 'USD' },
  }),
  ...FAQ.map(item => defineQuestion({ name: item.q, acceptedAnswer: item.a })),
])

const studio = ref<{ openPicker: () => void; runSample: () => void } | null>(null)
const demoAnchor = ref<HTMLElement | null>(null)

const generated = ['Title', 'Description', 'Category', 'Price', 'SKU', 'Tags', 'SEO title', 'Meta description']

function focusDemo() {
  demoAnchor.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function upload() {
  focusDemo()
  studio.value?.openPicker()
}

function tryDemo() {
  focusDemo()
  studio.value?.runSample()
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero__bg" aria-hidden="true">
        <span class="hero__blob hero__blob--a" />
        <span class="hero__blob hero__blob--b" />
        <span class="hero__blob hero__blob--c" />
        <span class="hero__grid" />
      </div>

      <div class="hero__inner">
        <div class="hero__copy">
          <UiBadge tone="ai" icon="sparkles">AI product studio · runs in your browser</UiBadge>
          <h1 class="hero__title">One photo in.<br><span>A product <span class="hero__nw">ready to sell.</span></span></h1>
          <p class="hero__lead">
            Drop a product image and Orbitly drafts the whole listing. You review, edit and publish — then sell it,
            build a community around it and grow it from one workspace.
          </p>
          <div class="hero__ctas">
            <UiButton size="lg" icon="upload" @click="upload">Upload a product</UiButton>
            <UiButton size="lg" variant="secondary" icon="zap" @click="tryDemo">Try the demo</UiButton>
          </div>
          <ul class="hero__proof">
            <li><UiIcon name="check" :size="14" :stroke-width="2.4" /> No account needed</li>
            <li><UiIcon name="check" :size="14" :stroke-width="2.4" /> Every field editable</li>
            <li><UiIcon name="check" :size="14" :stroke-width="2.4" /> Photo never leaves your device</li>
          </ul>
        </div>

        <div class="hero__visual">
          <HeroShowcase @play="tryDemo" />
        </div>
      </div>

      <div class="hero__ribbon" aria-label="Fields generated from one photo">
        <span class="hero__ribbon-label">Generated from one photo</span>
        <ul>
          <li v-for="g in generated" :key="g"><UiIcon name="sparkles" :size="12" /> {{ g }}</li>
        </ul>
      </div>
    </section>

    <section id="demo" ref="demoAnchor" class="try">
      <div class="try__head">
        <p class="try__eyebrow">Live demo</p>
        <h2>Try it with your own product</h2>
        <p>Upload a photo — or pick a sample — and watch the listing write itself. Takes about six seconds.</p>
      </div>
      <div class="try__studio">
        <ClientOnly>
          <GeneratorStudio ref="studio" />
          <template #fallback>
            <div class="try__fallback"><UiSkeleton :lines="6" /></div>
          </template>
        </ClientOnly>
      </div>
    </section>

    <LandingSections />
    <LandingFaq />
  </div>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(2rem, 6vw, 4.5rem) 0;

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.55;

    @include motion-safe { animation: drift 18s ease-in-out infinite alternate; }

    &--a { top: -8rem; left: -6rem; width: 30rem; height: 30rem; background: color-mix(in srgb, var(--c-primary) 30%, transparent); }
    &--b { top: 4rem; right: -8rem; width: 26rem; height: 26rem; background: color-mix(in srgb, var(--c-flare) 26%, transparent); animation-delay: -6s; }
    &--c { bottom: -6rem; left: 40%; width: 24rem; height: 24rem; background: color-mix(in srgb, var(--c-ai) 22%, transparent); animation-delay: -12s; }
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(color-mix(in srgb, var(--c-ink) 12%, transparent) 1px, transparent 1px);
    background-size: 22px 22px;
    mask-image: radial-gradient(ellipse at 50% 40%, black 20%, transparent 72%);
  }

  &__inner {
    @include container;
    position: relative;
    display: grid;
    gap: clamp(2.5rem, 5vw, 3rem);
    align-items: center;

    @include respond-to('lg') { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); }
  }

  &__copy {
    display: grid;
    justify-items: center;
    gap: 1.25rem;
    text-align: center;

    @include respond-to('lg') { justify-items: start; text-align: left; }
  }

  &__title {
    font-size: clamp(2.4rem, 4.6vw, 3.8rem);
    text-wrap: balance;
    font-weight: 700;
    letter-spacing: -0.045em;
    line-height: 0.98;

    > span { @include orbit-text; }
  }

  &__nw { white-space: nowrap; }

  &__lead {
    max-width: 34rem;
    color: var(--c-ink-2);
    font-size: clamp(1rem, 1.8vw, 1.18rem);
  }

  &__ctas {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;

    @include respond-to('lg') { justify-content: flex-start; }
  }

  &__proof {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.4rem 1.1rem;
    color: var(--c-muted);
    font-size: 0.82rem;

    @include respond-to('lg') { justify-content: flex-start; }

    li { display: inline-flex; align-items: center; gap: 0.35rem; }
    .ui-icon { color: var(--c-ai); }
  }

  &__visual { padding-inline: 0.5rem; }

  &__ribbon {
    @include container;
    position: relative;
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    margin-top: clamp(2.5rem, 5vw, 3.5rem);
    padding-block: 1.5rem;
    border-top: 1px solid var(--c-line);

    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }

    li {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.8rem;
      border: 1px solid var(--c-line);
      border-radius: var(--radius-pill);
      background: color-mix(in srgb, var(--c-surface) 75%, transparent);
      font-size: 0.8rem;
      font-weight: 500;

      .ui-icon { color: var(--c-ai); }
    }
  }

  &__ribbon-label {
    @include eyebrow;
    color: var(--c-faint);
  }
}

.try {
  position: relative;
  padding-block: clamp(3rem, 7vw, 5.5rem);
  background:
    linear-gradient(180deg, transparent, color-mix(in srgb, var(--c-primary-soft) 55%, transparent) 50%, transparent);
  scroll-margin-top: 4rem;

  &__head {
    @include container(44rem);
    display: grid;
    justify-items: center;
    gap: 0.6rem;
    margin-bottom: clamp(1.75rem, 4vw, 2.5rem);
    text-align: center;

    h2 { font-size: clamp(1.7rem, 4vw, 2.5rem); }
    p:last-child { color: var(--c-muted); }
  }

  &__eyebrow {
    @include eyebrow;
    color: var(--c-primary);
  }

  &__studio { @include container; }

  &__fallback {
    @include surface(var(--radius-xl));
    max-width: 46rem;
    min-height: 26rem;
    margin-inline: auto;
    padding: 2rem;
  }
}

@keyframes drift {
  to { transform: translate(3rem, 2rem) scale(1.08); }
}
</style>
