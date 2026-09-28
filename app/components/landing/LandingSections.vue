<script setup lang="ts">
// Static explanatory sections below the hero and live demo.
import type { IconName } from '~/utils/iconPaths'

const steps: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: 'upload', title: 'Drop one photo', text: 'Any product image — a phone shot on your desk is fine.' },
  { icon: 'sparkles', title: 'AI drafts the listing', text: 'Title, copy, category, price, SKU, tags and SEO in seconds.' },
  { icon: 'edit', title: 'You review and edit', text: 'Every AI field is marked, explained and fully editable.' },
  { icon: 'store', title: 'Publish and sell', text: 'It lands in your workspace as a draft, ready for your storefront.' },
]

const trust: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: 'eye', title: 'AI shows its work', text: 'Each generated field has a “Why?” with the signal it came from — colour, file name, template.' },
  { icon: 'shield', title: 'Humans approve actions', text: 'Nothing is published or sent without an explicit click. Insights become campaigns only after you approve.' },
  { icon: 'lock', title: 'Your photo stays local', text: 'In this demo the image is read on a canvas in your browser. It is never uploaded.' },
]

// Mini bar heights for the analytics tile (illustrative shape only).
const bars = [38, 52, 44, 61, 57, 72, 68, 86]
</script>

<template>
  <section id="how" class="ls">
    <div class="ls__inner">
      <header class="ls__head">
        <p class="ls__eyebrow">How it works</p>
        <h2 class="ls__title">From photo to product page in four steps</h2>
      </header>
      <ol class="steps">
        <li v-for="(s, i) in steps" :key="s.title" class="steps__item">
          <span class="steps__icon"><UiIcon :name="s.icon" :size="22" /></span>
          <span class="steps__n num">Step {{ i + 1 }}</span>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>

  <section id="workspace" class="ls ls--dark">
    <div class="ls__inner">
      <header class="ls__head">
        <p class="ls__eyebrow">One workspace</p>
        <h2 class="ls__title">The listing is only the start</h2>
        <p class="ls__lead">
          Every product you generate joins the same workspace as your community, customers and campaigns — one
          source of truth for who bought what, and what to do next.
        </p>
      </header>

      <div class="bento">
        <NuxtLink to="/products" class="bento__tile bento__tile--wide">
          <div class="bento__text">
            <span class="bento__icon"><UiIcon name="box" :size="18" /></span>
            <h3>Products & storefront <UiIcon name="arrowUpRight" :size="16" /></h3>
            <p>Digital files, courses, cohorts, memberships, 1:1 services and physical goods — with a public store and checkout.</p>
          </div>
          <div class="bento__art bento__art--products" aria-hidden="true">
            <span v-for="n in 3" :key="n" class="bento__card"><i /><b /><b /></span>
          </div>
        </NuxtLink>

        <NuxtLink to="/community" class="bento__tile">
          <div class="bento__text">
            <span class="bento__icon"><UiIcon name="users" :size="18" /></span>
            <h3>Community <UiIcon name="arrowUpRight" :size="16" /></h3>
            <p>Posts, comments, reactions, events and paid tiers.</p>
          </div>
          <div class="bento__art bento__art--post" aria-hidden="true">
            <span class="bento__avatar" /><span class="bento__lines"><b /><b /></span>
            <span class="bento__reacts"><UiIcon name="heart" :size="12" /> 42 <UiIcon name="flame" :size="12" /> 11</span>
          </div>
        </NuxtLink>

        <NuxtLink to="/customers" class="bento__tile">
          <div class="bento__text">
            <span class="bento__icon"><UiIcon name="contact" :size="18" /></span>
            <h3>Customers <UiIcon name="arrowUpRight" :size="16" /></h3>
            <p>One profile per buyer: orders, products owned, tags and timeline.</p>
          </div>
          <div class="bento__art bento__art--crm" aria-hidden="true">
            <span v-for="n in 3" :key="n" class="bento__row"><i /><b /><em /></span>
          </div>
        </NuxtLink>

        <NuxtLink to="/marketing" class="bento__tile bento__tile--ai">
          <div class="bento__text">
            <span class="bento__icon"><UiIcon name="sparkles" :size="18" /></span>
            <h3>Marketing Brain <UiIcon name="arrowUpRight" :size="16" /></h3>
            <p>Finds opportunities in your data and drafts campaigns — you approve every send.</p>
          </div>
          <div class="bento__art bento__art--insight" aria-hidden="true">
            <span class="bento__pill">Opportunity · 82%</span>
            <span class="bento__lines"><b /><b /></span>
            <span class="bento__approve"><UiIcon name="shield" :size="12" /> Review & approve</span>
          </div>
        </NuxtLink>

        <NuxtLink to="/analytics" class="bento__tile">
          <div class="bento__text">
            <span class="bento__icon"><UiIcon name="chart" :size="18" /></span>
            <h3>Analytics <UiIcon name="arrowUpRight" :size="16" /></h3>
            <p>Revenue, AOV, conversion, campaigns and community growth.</p>
          </div>
          <svg class="bento__art bento__art--chart" viewBox="0 0 160 60" preserveAspectRatio="none" aria-hidden="true">
            <rect v-for="(h, i) in bars" :key="i" :x="i * 20 + 4" :y="60 - h * 0.6" width="12" :height="h * 0.6" rx="2" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>

  <section id="trust" class="ls">
    <div class="ls__inner">
      <header class="ls__head">
        <p class="ls__eyebrow">Trust by design</p>
        <h2 class="ls__title">AI that earns its place</h2>
      </header>
      <div class="trust">
        <div v-for="t in trust" :key="t.title" class="trust__item">
          <span class="trust__icon"><UiIcon :name="t.icon" :size="22" /></span>
          <h3>{{ t.title }}</h3>
          <p>{{ t.text }}</p>
        </div>
      </div>

      <div class="cta">
        <div class="cta__glow" aria-hidden="true" />
        <div class="cta__copy">
          <h2>See the whole business in one place</h2>
          <p>Open the demo workspace — sample data for a ceramics studio, with products, sales, members and AI insights to click through.</p>
        </div>
        <UiButton to="/dashboard" size="lg" variant="secondary" icon-right="arrowRight">Open the dashboard</UiButton>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.ls {
  padding-block: clamp(4rem, 8vw, 6.5rem);

  &__inner { @include container; }

  &__head {
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    margin-bottom: clamp(2rem, 5vw, 3rem);
    text-align: center;
  }

  &__eyebrow {
    @include eyebrow;
    color: var(--c-primary);
  }

  &__title {
    max-width: 36rem;
    font-size: clamp(1.8rem, 4vw, 2.7rem);
  }

  &__lead {
    max-width: 40rem;
    font-size: 1.05rem;
  }

  &--dark {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(ellipse at 15% 0%, color-mix(in srgb, var(--c-primary) 32%, transparent), transparent 50%),
      radial-gradient(ellipse at 90% 100%, color-mix(in srgb, var(--c-ai) 22%, transparent), transparent 45%),
      var(--c-ink);
    color: var(--c-faint);

    .ls__title { color: var(--c-surface); }
    .ls__eyebrow { color: var(--c-ai-line); }
  }
}

// ---- Steps ---------------------------------------------------------------
.steps {
  position: relative;
  display: grid;
  gap: 1rem;

  @include respond-to('sm') { grid-template-columns: repeat(2, 1fr); }
  @include respond-to('lg') {
    grid-template-columns: repeat(4, 1fr);

    // Connector line behind the icons.
    &::before {
      content: '';
      position: absolute;
      top: 2.9rem;
      right: 12%;
      left: 12%;
      border-top: 2px dashed var(--c-line-strong);
    }
  }

  &__item {
    @include surface;
    position: relative;
    display: grid;
    justify-items: center;
    gap: 0.5rem;
    padding: 1.6rem 1.25rem;
    text-align: center;
    transition: transform var(--dur) var(--ease-out), box-shadow var(--dur);

    &:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

    h3 { font-size: 1.05rem; }
    p { color: var(--c-muted); font-size: 0.9rem; }
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    margin-bottom: 0.25rem;
    border-radius: 50%;
    background: var(--grad-orbit);
    color: var(--c-surface);
    box-shadow: 0 0 0 6px var(--c-surface);
  }

  &__n {
    @include eyebrow;
    color: var(--c-faint);
    font-size: 0.62rem;
  }
}

// ---- Bento ---------------------------------------------------------------
.bento {
  display: grid;
  gap: 1rem;

  @include respond-to('md') { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @include respond-to('lg') { grid-template-columns: repeat(3, minmax(0, 1fr)); }

  &__tile {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.25rem;
    min-height: 15rem;
    padding: 1.4rem;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--c-surface) 12%, transparent);
    border-radius: var(--radius-xl);
    background: color-mix(in srgb, var(--c-surface) 5%, transparent);
    transition: border-color var(--dur), transform var(--dur) var(--ease-out), background var(--dur);

    &:hover {
      border-color: color-mix(in srgb, var(--c-ai-line) 70%, transparent);
      background: color-mix(in srgb, var(--c-surface) 8%, transparent);
      transform: translateY(-3px);
    }

    &--wide {
      @include respond-to('lg') {
        grid-column: span 2;
        flex-direction: row;
        align-items: center;
      }
    }

    &--ai {
      background:
        linear-gradient(160deg, color-mix(in srgb, var(--c-ai) 22%, transparent), color-mix(in srgb, var(--c-primary) 18%, transparent));
    }
  }

  &__text {
    display: grid;
    gap: 0.5rem;

    h3 {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--c-surface);
      font-size: 1.1rem;
    }

    p { font-size: 0.88rem; }
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 2.4rem;
    height: 2.4rem;
    margin-bottom: 0.3rem;
    border-radius: var(--radius-sm);
    background: var(--grad-orbit);
    color: var(--c-surface);
  }

  // Mini illustrations (all shape, no fake numbers except the demo sample's)
  &__art {
    --ghost: color-mix(in srgb, var(--c-surface) 16%, transparent);
    --ghost-2: color-mix(in srgb, var(--c-surface) 9%, transparent);

    b, i, em { display: block; border-radius: 4px; }
  }

  &__art--products {
    display: flex;
    gap: 0.6rem;
    flex-shrink: 0;

    @include respond-to('lg') { width: 55%; }
  }

  &__card {
    display: grid;
    flex: 1;
    gap: 0.35rem;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    background: var(--ghost-2);

    i { aspect-ratio: 1; background: var(--ghost); }
    b { height: 0.4rem; background: var(--ghost); }
    b:last-child { width: 50%; background: color-mix(in srgb, var(--c-primary) 70%, transparent); }

    &:nth-child(2) { transform: translateY(-0.5rem); }
  }

  &__art--post,
  &__art--insight {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.6rem;
    padding: 0.8rem;
    border-radius: var(--radius-md);
    background: var(--ghost-2);
  }

  &__avatar {
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    background: var(--grad-orbit);
  }

  &__lines {
    display: grid;
    gap: 0.35rem;

    b { height: 0.4rem; background: var(--ghost); }
    b:last-child { width: 65%; }
  }

  &__reacts,
  &__approve {
    grid-column: 1 / -1;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--c-surface);
    font-size: 0.72rem;
  }

  &__approve {
    justify-self: start;
    padding: 0.3rem 0.6rem;
    border-radius: var(--radius-pill);
    background: var(--grad-ai);
    font-weight: 600;
  }

  &__pill {
    grid-column: 1 / -1;
    justify-self: start;
    padding: 0.15rem 0.5rem;
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--c-ai) 40%, transparent);
    color: var(--c-ai-line);
    font-size: 0.66rem;
    font-weight: 600;
  }

  &__art--insight .bento__lines { grid-column: 1 / -1; }

  &__art--crm { display: grid; gap: 0.45rem; }

  &__row {
    display: grid;
    grid-template-columns: 1.4rem 1fr 2.5rem;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.5rem;
    border-radius: var(--radius-sm);
    background: var(--ghost-2);

    i { width: 1.4rem; height: 1.4rem; border-radius: 50%; background: var(--ghost); }
    b { height: 0.4rem; background: var(--ghost); }
    em { height: 0.4rem; background: color-mix(in srgb, var(--c-ai) 60%, transparent); }
  }

  &__art--chart {
    width: 100%;
    height: 4.5rem;

    rect { fill: color-mix(in srgb, var(--c-primary) 55%, transparent); }
    rect:last-child { fill: var(--c-flare); }
  }
}

// ---- Trust ---------------------------------------------------------------
.trust {
  display: grid;
  gap: 1rem;

  @include respond-to('md') { grid-template-columns: repeat(3, 1fr); }

  &__item {
    @include surface(var(--radius-xl));
    display: grid;
    align-content: start;
    gap: 0.6rem;
    padding: 1.6rem;

    h3 { font-size: 1.1rem; }
    p { color: var(--c-muted); font-size: 0.92rem; }
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 2.8rem;
    height: 2.8rem;
    margin-bottom: 0.3rem;
    border-radius: var(--radius-md);
    background: var(--c-ai-wash);
    color: var(--c-ai-ink);
    box-shadow: inset 0 0 0 1px var(--c-ai-line);
  }
}

// ---- CTA -----------------------------------------------------------------
.cta {
  position: relative;
  display: grid;
  gap: 1.5rem;
  align-items: center;
  margin-top: clamp(3rem, 7vw, 5rem);
  padding: clamp(1.75rem, 5vw, 3.25rem);
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: var(--grad-orbit);
  color: var(--c-surface);

  @include respond-to('md') { grid-template-columns: 1fr auto; }

  &__glow {
    position: absolute;
    top: -40%;
    right: -10%;
    width: 24rem;
    height: 24rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--c-surface) 18%, transparent);
    filter: blur(50px);
    pointer-events: none;
  }

  &__copy {
    position: relative;
    display: grid;
    gap: 0.6rem;

    h2 { color: var(--c-surface); font-size: clamp(1.5rem, 3.2vw, 2.2rem); }
    p { max-width: 36rem; color: color-mix(in srgb, var(--c-surface) 85%, transparent); }
  }

  :deep(.btn) { position: relative; justify-self: start; }
}
</style>
