<script setup lang="ts">
// Static explanatory sections below the hero demo.
import type { IconName } from '~/utils/iconPaths'

const steps: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: 'upload', title: 'Drop one photo', text: 'Any product image — a phone shot on your desk is fine.' },
  { icon: 'sparkles', title: 'AI drafts the listing', text: 'Title, copy, category, price, SKU, tags and SEO in seconds.' },
  { icon: 'edit', title: 'You review and edit', text: 'Every AI field is marked, explained and fully editable.' },
  { icon: 'store', title: 'Publish and sell', text: 'It lands in your workspace as a draft, ready for your storefront.' },
]

const modules: Array<{ icon: IconName; title: string; text: string; to: string }> = [
  { icon: 'box', title: 'Products', text: 'Digital files, courses, cohorts, memberships, 1:1 services and physical goods.', to: '/products' },
  { icon: 'store', title: 'Storefront', text: 'A public store, product pages and checkout that grants access automatically.', to: '/store' },
  { icon: 'users', title: 'Community', text: 'A member feed with posts, comments, reactions, events and paid tiers.', to: '/community' },
  { icon: 'contact', title: 'Customers', text: 'One profile per buyer: orders, products owned, membership, tags, timeline.', to: '/customers' },
  { icon: 'sparkles', title: 'Marketing & AI', text: 'Marketing Brain finds opportunities in your data and drafts campaigns for approval.', to: '/marketing' },
  { icon: 'chart', title: 'Analytics', text: 'Revenue, orders, AOV, conversion, campaign and community growth — in one place.', to: '/analytics' },
]

const trust: Array<{ icon: IconName; title: string; text: string }> = [
  { icon: 'eye', title: 'AI shows its work', text: 'Each generated field has a “Why?” with the signal it came from — colour, file name, template.' },
  { icon: 'shield', title: 'Humans approve actions', text: 'Nothing is published or sent without an explicit click. Insights become campaigns only after you approve.' },
  { icon: 'lock', title: 'Your photo stays local', text: 'In this demo the image is read on a canvas in your browser. It is never uploaded.' },
]
</script>

<template>
  <section id="how" class="ls ls--how">
    <div class="ls__inner">
      <p class="ls__eyebrow">How it works</p>
      <h2 class="ls__title">From photo to product page in four steps</h2>
      <ol class="ls__steps">
        <li v-for="(s, i) in steps" :key="s.title" class="ls__step">
          <span class="ls__step-n num">0{{ i + 1 }}</span>
          <UiIcon :name="s.icon" :size="22" />
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>

  <section id="workspace" class="ls ls--dark">
    <div class="ls__inner">
      <p class="ls__eyebrow">One workspace</p>
      <h2 class="ls__title">The listing is only the start</h2>
      <p class="ls__lead">
        Every product you generate joins the same workspace as your community, customers and campaigns — one source
        of truth for who bought what, and what to do next.
      </p>
      <div class="ls__modules">
        <NuxtLink v-for="m in modules" :key="m.title" :to="m.to" class="ls__module">
          <span class="ls__module-icon"><UiIcon :name="m.icon" :size="20" /></span>
          <h3>{{ m.title }} <UiIcon name="arrowUpRight" :size="16" /></h3>
          <p>{{ m.text }}</p>
        </NuxtLink>
      </div>
    </div>
  </section>

  <section id="trust" class="ls">
    <div class="ls__inner">
      <p class="ls__eyebrow">Trust by design</p>
      <h2 class="ls__title">AI that earns its place</h2>
      <div class="ls__trust">
        <div v-for="t in trust" :key="t.title" class="ls__trust-item">
          <UiIcon :name="t.icon" :size="22" />
          <h3>{{ t.title }}</h3>
          <p>{{ t.text }}</p>
        </div>
      </div>
      <div class="ls__cta">
        <h2>Open the demo workspace</h2>
        <p>Sample data for a ceramics studio — products, sales, members and AI insights you can click through.</p>
        <UiButton to="/dashboard" size="lg" variant="dark" icon-right="arrowRight">Go to dashboard</UiButton>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.ls {
  @include respond-to('md') { padding-block: 6rem; }
  padding-block: 4rem;

  &__inner { @include container; }

  &__eyebrow {
    @include eyebrow;
    color: var(--c-primary);
    margin-bottom: 0.75rem;
  }

  &__title {
    max-width: 36rem;
    font-size: clamp(1.7rem, 4vw, 2.6rem);
  }

  &__lead {
    max-width: 40rem;
    margin-top: 1rem;
    font-size: 1.05rem;
  }

  &__steps {
    display: grid;
    gap: 1rem;
    margin-top: 2.5rem;
    counter-reset: step;

    @include respond-to('sm') { grid-template-columns: 1fr 1fr; }
    @include respond-to('lg') { grid-template-columns: repeat(4, 1fr); }
  }

  &__step {
    @include surface;
    position: relative;
    display: grid;
    gap: 0.5rem;
    padding: 1.4rem;

    .ui-icon { color: var(--c-primary); }
    h3 { font-size: 1.05rem; }
    p { color: var(--c-muted); font-size: 0.9rem; }
  }

  &__step-n {
    position: absolute;
    top: 1.2rem;
    right: 1.3rem;
    color: var(--c-faint);
    font-family: $font-mono;
    font-size: 0.75rem;
  }

  &--dark {
    background: var(--c-ink);
    color: var(--c-faint);

    .ls__title { color: var(--c-surface); }
    .ls__eyebrow { color: var(--c-ai-line); }
  }

  &__modules {
    display: grid;
    gap: 1rem;
    margin-top: 2.5rem;

    @include respond-to('md') { grid-template-columns: repeat(2, 1fr); }
    @include respond-to('lg') { grid-template-columns: repeat(3, 1fr); }
  }

  &__module {
    display: grid;
    gap: 0.5rem;
    padding: 1.4rem;
    border: 1px solid color-mix(in srgb, var(--c-surface) 12%, transparent);
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--c-surface) 4%, transparent);
    transition: border-color var(--dur), transform var(--dur);

    h3 {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--c-surface);
      font-size: 1.05rem;
    }

    p { font-size: 0.9rem; }

    &:hover { border-color: var(--c-ai-line); transform: translateY(-2px); }
  }

  &__module-icon {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-sm);
    background: var(--grad-orbit);
    color: var(--c-surface);
  }

  &__trust {
    display: grid;
    gap: 2rem;
    margin-top: 2.5rem;

    @include respond-to('md') { grid-template-columns: repeat(3, 1fr); }
  }

  &__trust-item {
    display: grid;
    gap: 0.5rem;

    .ui-icon { color: var(--c-ai); }
    h3 { font-size: 1.1rem; }
    p { color: var(--c-muted); }
  }

  &__cta {
    display: grid;
    justify-items: start;
    gap: 0.75rem;
    margin-top: 4rem;
    padding: clamp(1.5rem, 5vw, 3rem);
    border-radius: var(--radius-xl);
    background:
      radial-gradient(circle at 100% 0%, var(--c-primary-soft), transparent 60%),
      radial-gradient(circle at 0% 100%, var(--c-flare-soft), transparent 55%),
      var(--c-surface);
    border: 1px solid var(--c-line);

    h2 { font-size: clamp(1.4rem, 3vw, 2rem); }
    p { max-width: 34rem; color: var(--c-muted); }
  }
}
</style>
