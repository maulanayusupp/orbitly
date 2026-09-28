<script setup lang="ts">
// Decorative hero illustration: a photo turning into a listing. The values are
// the real output of the "Ceramic mug" sample, so the picture never promises
// more than the demo delivers. Clicking it runs that sample.
const emit = defineEmits<{ play: [] }>()

const fields = [
  { label: 'Title', value: 'Sage Stoneware Pour-Over Mug' },
  { label: 'Category', value: 'Home & Kitchen › Drinkware' },
  { label: 'Price', value: '$33.00' },
]
const tags = ['sage', 'ceramic mug', 'handmade', 'gift idea']
</script>

<template>
  <button type="button" class="show" aria-label="Run the ceramic mug sample" @click="emit('play')">
    <svg class="show__orbits" viewBox="0 0 600 520" aria-hidden="true">
      <ellipse cx="300" cy="260" rx="280" ry="120" transform="rotate(-18 300 260)" />
      <ellipse cx="300" cy="260" rx="220" ry="200" transform="rotate(24 300 260)" />
      <circle class="show__moon" r="6">
        <animateMotion dur="14s" repeatCount="indefinite" path="M 34 347 A 280 120 -18 1 1 566 173 A 280 120 -18 1 1 34 347" />
      </circle>
    </svg>

    <!-- Photo card -->
    <div class="show__photo">
      <div class="show__photo-stage">
        <img src="/samples/stoneware-mug.svg" alt="" width="220" height="220">
        <span class="show__scan" aria-hidden="true" />
      </div>
      <p class="show__file"><UiIcon name="image" :size="13" /> stoneware-mug.jpg</p>
    </div>

    <!-- Listing card -->
    <div class="show__listing">
      <div class="show__listing-head">
        <UiBadge tone="ai" icon="sparkles">Generated</UiBadge>
        <span class="show__conf num">94%</span>
      </div>
      <dl class="show__fields">
        <div v-for="(f, i) in fields" :key="f.label" class="show__field" :class="`show__field--${i}`">
          <dt>{{ f.label }}</dt>
          <dd>{{ f.value }}</dd>
        </div>
      </dl>
      <div class="show__tags">
        <span v-for="t in tags" :key="t">{{ t }}</span>
      </div>
    </div>

    <!-- Floating chips -->
    <span class="show__chip show__chip--sku"><UiIcon name="tag" :size="13" /> HK-MUG-SAG-8P07</span>
    <span class="show__chip show__chip--seo"><UiIcon name="search" :size="13" /> SEO ready</span>
    <span class="show__chip show__chip--color"><span class="show__dot" /> Sage · #8ba585</span>

    <span class="show__play"><UiIcon name="zap" :size="14" /> Click to run this sample</span>
  </button>
</template>

<style lang="scss" scoped>
.show {
  position: relative;
  display: block;
  width: 100%;
  max-width: 36rem;
  aspect-ratio: 600 / 520;
  margin-inline: auto;
  text-align: left;
  cursor: pointer;

  @include respond-below('sm') {
    aspect-ratio: 600 / 640;

    .show__listing { top: 22%; width: 62%; }
    .show__photo { width: 46%; }
    .show__chip--seo { display: none; }
    .show__chip--color { bottom: 8%; }
  }

  &:hover .show__play { opacity: 1; transform: translate(-50%, 0); }
  &:hover .show__listing { transform: rotate(2deg) translateY(-4px); }
  &:hover .show__photo { transform: rotate(-4deg) translateY(-4px); }

  &__orbits {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;

    ellipse {
      fill: none;
      stroke: var(--c-line-strong);
      stroke-dasharray: 3 7;
    }
  }

  &__moon { fill: var(--c-flare); }

  // Cards
  &__photo,
  &__listing {
    position: absolute;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-xl);
    background: var(--c-surface);
    box-shadow: var(--shadow-lg);
    transition: transform 500ms var(--ease-out);
  }

  &__photo {
    top: 12%;
    left: 2%;
    width: 44%;
    padding: 0.6rem;
    transform: rotate(-6deg);
  }

  &__photo-stage {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: var(--c-surface-2);

    img { width: 100%; height: 100%; object-fit: cover; }
  }

  &__scan {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--c-ai) 34%, transparent) 50%, transparent 60%);
    background-size: 100% 250%;

    @include motion-safe { animation: scan 2.8s ease-in-out infinite; }
  }

  &__file {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.5rem 0.25rem 0.1rem;
    color: var(--c-muted);
    overflow: hidden;
    font-family: $font-mono;
    font-size: 0.66rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__listing {
    top: 26%;
    right: 0;
    width: 56%;
    padding: 1rem;
    transform: rotate(3deg);
  }

  &__listing-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  &__conf {
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-pill);
    background: var(--c-ai);
    color: var(--c-primary-ink);
    font-size: 0.72rem;
    font-weight: 700;
  }

  &__fields { display: grid; gap: 0.5rem; min-width: 0; margin: 0; }

  &__field {
    min-width: 0;
    padding: 0.45rem 0.6rem;
    border: 1px solid var(--c-ai-line);
    border-radius: var(--radius-sm);
    background: var(--c-ai-wash);

    dt { color: var(--c-ai-ink); font-size: 0.6rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
    dd { margin: 0; overflow: hidden; font-size: clamp(0.7rem, 1.6vw, 0.82rem); font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }

    @include motion-safe {
      animation: fill 7s var(--ease-out) infinite both;
      &--1 { animation-delay: 0.35s; }
      &--2 { animation-delay: 0.7s; }
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.6rem;

    span {
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-pill);
      background: var(--c-primary-soft);
      color: var(--c-primary);
      font-size: 0.64rem;
      font-weight: 600;
    }
  }

  // Chips
  &__chip {
    position: absolute;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.7rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-pill);
    background: var(--c-surface);
    box-shadow: var(--shadow-md);
    font-size: clamp(0.62rem, 1.4vw, 0.74rem);
    font-weight: 600;
    white-space: nowrap;

    .ui-icon { color: var(--c-primary); }

    @include motion-safe { animation: float 6s ease-in-out infinite; }

    &--sku { top: 4%; right: 8%; font-family: $font-mono; animation-delay: -1s; }
    &--seo { bottom: 10%; right: 12%; animation-delay: -3s; .ui-icon { color: var(--c-ai); } }
    &--color { bottom: 18%; left: 4%; animation-delay: -4.5s; }
  }

  &__dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: var(--c-sample-sage);
  }

  &__play {
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.8rem;
    border-radius: var(--radius-pill);
    background: var(--c-ink);
    color: var(--c-surface);
    font-size: 0.74rem;
    font-weight: 600;
    opacity: 0;
    transform: translate(-50%, 6px);
    transition: all var(--dur) var(--ease-out);
  }

  &:focus-visible .show__play { opacity: 1; transform: translate(-50%, 0); }
}

@keyframes scan {
  from { background-position: 0 100%; }
  to { background-position: 0 -150%; }
}

@keyframes float {
  50% { transform: translateY(-8px); }
}

@keyframes fill {
  0%, 8% { opacity: 0; transform: translateY(6px); }
  16%, 88% { opacity: 1; transform: none; }
  100% { opacity: 0; }
}
</style>
