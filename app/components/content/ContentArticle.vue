<script setup lang="ts">
// Renders one server-side content page (features, tool landing, use cases or
// guide) from config/content.config.ts, with its SEO meta and JSON-LD.
import type { ContentBlock, ContentPage } from '~/config/content.config'
import { CONTENT_PAGES } from '~/config/content.config'
import { usePageSeo } from '~/composables/usePageSeo'
import { formatDate } from '~/utils/format'

const props = defineProps<{ page: ContentPage }>()
const siteUrl = useRuntimeConfig().public.siteUrl as string

const toc = computed(() => props.page.blocks.filter((b): b is Extract<ContentBlock, { type: 'h2' }> => b.type === 'h2'))
const words = computed(() => props.page.blocks.reduce((n, b) => {
  const text = 'text' in b ? b.text : 'items' in b ? b.items.join(' ') : 'after' in b ? `${b.before ?? ''} ${b.after}` : ''
  return n + text.split(/\s+/).length
}, props.page.lead.split(/\s+/).length))
const minutes = computed(() => Math.max(2, Math.ceil(words.value / 200)))
const related = computed(() => props.page.related.map(p => CONTENT_PAGES.find(c => c.path === p) ?? (p === '/guides' ? { path: p, h1: 'All guides', eyebrow: 'Guides', description: 'Practical guides on product copy, SEO and pricing.' } : null)).filter(Boolean))

const crumbs = computed(() => {
  const list = [{ name: 'Home', item: '/' }]
  if (props.page.kind === 'guide') list.push({ name: 'Guides', item: '/guides' })
  list.push({ name: props.page.eyebrow.replace(/^Guide · /, ''), item: props.page.path })
  return list
})

useHead({ title: props.page.title, titleTemplate: '%s' })
usePageSeo(props.page.title, props.page.description, { type: props.page.kind === 'guide' ? 'article' : 'website' })

useSchemaOrg([
  defineWebPage({ name: props.page.h1, ...(props.page.faq ? { '@type': ['WebPage', 'FAQPage'] } : {}) }),
  defineBreadcrumb({ itemListElement: crumbs.value.map(c => ({ name: c.name, item: `${siteUrl}${c.item === '/' ? '' : c.item}` })) }),
  ...(props.page.kind === 'guide'
    ? [defineArticle({
        headline: props.page.h1,
        description: props.page.description,
        datePublished: props.page.published,
        dateModified: props.page.updated,
        image: `${siteUrl}/og-image.png`,
      })]
    : []),
  ...(props.page.faq ?? []).map(f => defineQuestion({ name: f.q, acceptedAnswer: f.a })),
])
</script>

<template>
  <article class="ca">
    <header class="ca__hero">
      <div class="ca__hero-inner">
        <nav class="ca__crumbs" aria-label="Breadcrumb">
          <ol>
            <li v-for="(c, i) in crumbs" :key="c.item">
              <NuxtLink v-if="i < crumbs.length - 1" :to="c.item">{{ c.name }}</NuxtLink>
              <span v-else aria-current="page">{{ c.name }}</span>
              <UiIcon v-if="i < crumbs.length - 1" name="chevronRight" :size="12" />
            </li>
          </ol>
        </nav>
        <p class="ca__eyebrow">{{ page.eyebrow }}</p>
        <h1 class="ca__title">{{ page.h1 }}</h1>
        <p class="ca__lead">{{ page.lead }}</p>
        <p class="ca__meta">
          <UiIcon name="clock" :size="14" /> {{ minutes }} min read
          <span aria-hidden="true">·</span>
          Updated <time :datetime="page.updated">{{ formatDate(page.updated, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) }}</time>
        </p>
      </div>
    </header>

    <div class="ca__layout">
      <aside v-if="toc.length > 2" class="ca__toc" aria-label="On this page">
        <p>On this page</p>
        <ol>
          <li v-for="h in toc" :key="h.id"><a :href="`#${h.id}`">{{ h.text }}</a></li>
        </ol>
      </aside>

      <div class="ca__body">
        <template v-for="(b, i) in page.blocks" :key="i">
          <h2 v-if="b.type === 'h2'" :id="b.id">{{ b.text }}</h2>
          <h3 v-else-if="b.type === 'h3'">{{ b.text }}</h3>
          <p v-else-if="b.type === 'p'">{{ b.text }}</p>
          <ul v-else-if="b.type === 'ul'" class="ca__list">
            <li v-for="item in b.items" :key="item"><UiIcon name="check" :size="14" :stroke-width="2.4" /><span>{{ item }}</span></li>
          </ul>
          <ol v-else-if="b.type === 'ol'" class="ca__steps">
            <li v-for="item in b.items" :key="item">{{ item }}</li>
          </ol>
          <aside v-else-if="b.type === 'tip'" class="ca__tip">
            <UiIcon name="bulb" :size="18" />
            <div><strong>{{ b.title }}</strong><p>{{ b.text }}</p></div>
          </aside>
          <figure v-else-if="b.type === 'example'" class="ca__example">
            <figcaption>{{ b.label }}</figcaption>
            <p v-if="b.before" class="ca__before"><span>Before</span>{{ b.before }}</p>
            <p class="ca__after"><span>{{ b.before ? 'After' : 'Output' }}</span>{{ b.after }}</p>
          </figure>
          <div v-else-if="b.type === 'cta'" class="ca__cta">
            <UiButton :to="b.to ?? '/#demo'" icon="wand" icon-right="arrowRight">{{ b.text }}</UiButton>
            <span v-if="!b.to">Free · no sign-up · runs in your browser</span>
          </div>
        </template>

        <section v-if="page.faq?.length" class="ca__faq" aria-labelledby="ca-faq">
          <h2 id="ca-faq">Frequently asked questions</h2>
          <details v-for="f in page.faq" :key="f.q">
            <summary>{{ f.q }}<UiIcon name="plus" :size="16" /></summary>
            <p>{{ f.a }}</p>
          </details>
        </section>
      </div>
    </div>

    <section v-if="related.length" class="ca__related" aria-labelledby="ca-related">
      <div class="ca__related-inner">
        <h2 id="ca-related">Keep reading</h2>
        <div class="ca__cards">
          <NuxtLink v-for="r in related" :key="r!.path" :to="r!.path" class="ca__card">
            <span class="ca__card-eyebrow">{{ r!.eyebrow }}</span>
            <strong>{{ r!.h1 }}</strong>
            <span class="ca__card-text">{{ r!.description }}</span>
            <span class="ca__card-go">Read <UiIcon name="arrowRight" :size="14" /></span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </article>
</template>

<style lang="scss" scoped>
.ca {
  &__hero {
    position: relative;
    padding-block: clamp(2.5rem, 6vw, 4.5rem) clamp(2rem, 4vw, 3rem);
    background:
      radial-gradient(ellipse at 10% 0%, color-mix(in srgb, var(--c-primary) 14%, transparent), transparent 55%),
      radial-gradient(ellipse at 95% 20%, color-mix(in srgb, var(--c-flare) 12%, transparent), transparent 50%);
    border-bottom: 1px solid var(--c-line);
  }

  // Same column grid as the body, so the headline lines up with the prose.
  &__hero-inner {
    @include container(68rem);
    display: grid;
    gap: 0.9rem;

    @include respond-to('lg') {
      grid-template-columns: 13rem minmax(0, 44rem);
      justify-content: center;
      column-gap: 2.5rem;

      > * { grid-column: 2; }
    }
  }

  &__crumbs ol {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    color: var(--c-muted);
    font-size: 0.8rem;

    li { display: inline-flex; align-items: center; gap: 0.35rem; }
    a:hover { color: var(--c-primary); }
    [aria-current] { color: var(--c-ink-2); }
  }

  &__eyebrow { @include eyebrow; color: var(--c-primary); }

  &__title {
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1.05;
    text-wrap: balance;
  }

  &__lead {
    color: var(--c-ink-2);
    font-size: clamp(1.02rem, 1.8vw, 1.18rem);
    line-height: 1.6;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
    color: var(--c-muted);
    font-size: 0.82rem;
  }

  // ---- layout --------------------------------------------------------------
  &__layout {
    @include container(68rem);
    display: grid;
    gap: 2.5rem;
    padding-block: clamp(2rem, 5vw, 3.5rem);

    @include respond-to('lg') { grid-template-columns: 13rem minmax(0, 44rem); justify-content: center; }
  }

  &__toc {
    display: none;
    align-self: start;
    position: sticky;
    top: 5.5rem;

    @include respond-to('lg') { display: block; }

    p { @include eyebrow; margin-bottom: 0.75rem; color: var(--c-faint); }
    ol { display: grid; gap: 0.5rem; border-left: 2px solid var(--c-line); }

    a {
      display: block;
      margin-left: -2px;
      padding-left: 0.85rem;
      border-left: 2px solid transparent;
      color: var(--c-muted);
      font-size: 0.84rem;
      line-height: 1.4;

      &:hover { border-color: var(--c-primary); color: var(--c-ink); }
    }
  }

  // ---- prose -------------------------------------------------------------
  &__body {
    min-width: 0;
    color: var(--c-ink-2);
    font-size: 1.02rem;
    line-height: 1.75;

    > * + * { margin-top: 1.1rem; }

    h2 {
      margin-top: 2.6rem;
      color: var(--c-ink);
      font-size: clamp(1.35rem, 2.6vw, 1.7rem);
      scroll-margin-top: 5.5rem;
    }

    h3 { margin-top: 1.8rem; color: var(--c-ink); font-size: 1.12rem; }
    > h2:first-child { margin-top: 0; }
  }

  &__list {
    display: grid;
    gap: 0.6rem;

    li { display: flex; gap: 0.65rem; }

    .ui-icon {
      flex-shrink: 0;
      margin-top: 0.45rem;
      color: var(--c-ai);
    }
  }

  &__steps {
    display: grid;
    gap: 0.7rem;
    counter-reset: step;

    li {
      position: relative;
      padding-left: 2.4rem;
      counter-increment: step;

      &::before {
        content: counter(step);
        position: absolute;
        top: 0.15rem;
        left: 0;
        display: grid;
        place-items: center;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
        background: var(--c-primary-soft);
        color: var(--c-primary);
        font-size: 0.78rem;
        font-weight: 700;
        line-height: 1;
      }
    }
  }

  &__tip {
    display: flex;
    gap: 0.8rem;
    padding: 1rem 1.2rem;
    border: 1px solid var(--c-ai-line);
    border-radius: var(--radius-md);
    background: var(--c-ai-wash);
    font-size: 0.94rem;

    > .ui-icon { flex-shrink: 0; margin-top: 0.25rem; color: var(--c-ai-ink); }
    strong { color: var(--c-ink); }
    p { margin-top: 0.2rem; }
  }

  &__example {
    overflow: hidden;
    margin-inline: 0;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-md);
    background: var(--c-surface);

    figcaption {
      @include eyebrow;
      padding: 0.6rem 1rem;
      border-bottom: 1px solid var(--c-line);
      background: var(--c-surface-2);
      color: var(--c-muted);
    }

    p { padding: 0.9rem 1rem; white-space: pre-line; font-size: 0.94rem; }

    span {
      display: block;
      margin-bottom: 0.25rem;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
  }

  &__before {
    border-bottom: 1px dashed var(--c-line);
    color: var(--c-muted);
    text-decoration: line-through;
    text-decoration-color: color-mix(in srgb, var(--c-danger) 50%, transparent);

    span { color: var(--c-danger); text-decoration: none; }
  }

  &__after {
    color: var(--c-ink);

    span { color: var(--c-success); }
  }

  &__cta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1rem;
    padding: 1.1rem 1.25rem;
    border-radius: var(--radius-lg);
    background:
      linear-gradient(120deg, var(--c-primary-soft), color-mix(in srgb, var(--c-flare-soft) 70%, var(--c-surface)));

    span { color: var(--c-muted); font-size: 0.84rem; }

    // Long CTA labels must wrap on phones instead of widening the page.
    :deep(.btn) {
      max-width: 100%;
      height: auto;
      min-height: 2.5rem;
      padding-block: 0.6rem;
      white-space: normal;
      line-height: 1.25;
      text-align: left;
    }

    :deep(.btn span) { color: inherit; font-size: inherit; }
  }

  &__faq {
    margin-top: 2.6rem;

    h2 { margin-bottom: 1rem; }

    details {
      border-bottom: 1px solid var(--c-line);

      &[open] summary .ui-icon { transform: rotate(45deg); }
    }

    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-block: 0.9rem;
      color: var(--c-ink);
      font-weight: 600;
      cursor: pointer;
      list-style: none;

      &::-webkit-details-marker { display: none; }
      .ui-icon { flex-shrink: 0; color: var(--c-primary); transition: transform var(--dur); }
    }

    p { padding-bottom: 1rem; }
  }

  // ---- related -----------------------------------------------------------
  &__related {
    padding-block: clamp(2.5rem, 6vw, 4rem);
    border-top: 1px solid var(--c-line);
    background: var(--c-surface-2);
  }

  &__related-inner {
    @include container(68rem);

    h2 { margin-bottom: 1.25rem; font-size: 1.4rem; }
  }

  &__cards {
    display: grid;
    gap: 1rem;

    @include respond-to('md') { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  &__card {
    @include surface;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem;
    transition: transform var(--dur) var(--ease-out), box-shadow var(--dur);

    &:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

    strong { font-family: $font-display; font-size: 1.05rem; line-height: 1.3; }
  }

  &__card-eyebrow { @include eyebrow; color: var(--c-primary); font-size: 0.62rem; }
  &__card-text { @include line-clamp(3); color: var(--c-muted); font-size: 0.86rem; }

  &__card-go {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: auto;
    color: var(--c-primary);
    font-size: 0.84rem;
    font-weight: 600;
  }
}
</style>
