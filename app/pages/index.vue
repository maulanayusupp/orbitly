<script setup lang="ts">
useHead({ title: 'Photo to product, in seconds', titleTemplate: 'Orbitly — %s' })

const studio = ref<{ openPicker: () => void; runSample: () => void } | null>(null)
const demoAnchor = ref<HTMLElement | null>(null)

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
      <div class="hero__glow" aria-hidden="true" />
      <div class="hero__inner">
        <UiBadge tone="ai" icon="sparkles">AI product studio · runs in your browser</UiBadge>
        <h1 class="hero__title">One photo in.<br><span>A product ready to sell.</span></h1>
        <p class="hero__lead">
          Drop a product image and Orbitly drafts the title, description, category, price, SKU, tags and SEO.
          You review, edit and publish — then sell it, build a community around it and grow it from one workspace.
        </p>
        <div class="hero__ctas">
          <UiButton size="lg" icon="upload" @click="upload">Upload a product</UiButton>
          <UiButton size="lg" variant="secondary" icon="zap" @click="tryDemo">Try the demo</UiButton>
        </div>
        <p class="hero__fine">No account needed · 8 fields generated · every field editable</p>
      </div>

      <div ref="demoAnchor" class="hero__studio">
        <ClientOnly>
          <GeneratorStudio ref="studio" />
          <template #fallback>
            <div class="hero__fallback"><UiSkeleton :lines="6" /></div>
          </template>
        </ClientOnly>
      </div>
    </section>

    <LandingSections />
  </div>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(2rem, 6vw, 4.5rem) clamp(3rem, 6vw, 5rem);

  &__glow {
    position: absolute;
    inset: -20% -10% auto;
    height: 38rem;
    background:
      radial-gradient(closest-side at 30% 40%, color-mix(in srgb, var(--c-primary) 18%, transparent), transparent),
      radial-gradient(closest-side at 75% 30%, color-mix(in srgb, var(--c-flare) 16%, transparent), transparent),
      radial-gradient(closest-side at 55% 70%, color-mix(in srgb, var(--c-ai) 12%, transparent), transparent);
    filter: blur(20px);
    pointer-events: none;
  }

  &__inner {
    @include container(56rem);
    position: relative;
    display: grid;
    justify-items: center;
    gap: 1.1rem;
    text-align: center;
  }

  &__title {
    font-size: clamp(2.3rem, 7vw, 4.6rem);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.02;

    span { @include orbit-text; }
  }

  &__lead {
    max-width: 40rem;
    color: var(--c-ink-2);
    font-size: clamp(1rem, 2vw, 1.15rem);
  }

  &__ctas {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  &__fine {
    color: var(--c-muted);
    font-size: 0.8rem;
  }

  &__studio {
    @include container;
    position: relative;
    margin-top: clamp(2rem, 5vw, 3.5rem);
    scroll-margin-top: 5rem;
  }

  &__fallback {
    @include surface(var(--radius-xl));
    padding: 2rem;
    min-height: 28rem;
  }
}
</style>
