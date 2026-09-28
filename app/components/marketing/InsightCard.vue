<script setup lang="ts">
import type { Insight } from '~/types'
import type { IconName } from '~/utils/iconPaths'

defineProps<{ insight: Insight }>()
const emit = defineEmits<{ review: []; dismiss: [] }>()

const typeIcon: Record<Insight['type'], IconName> = { opportunity: 'target', anomaly: 'zap', trend: 'chart', risk: 'alert' }
const typeTone = { opportunity: 'ai', anomaly: 'flare', trend: 'info', risk: 'warn' } as const
const sourceIcon: Record<string, IconName> = { orders: 'cart', community: 'users', products: 'box', campaigns: 'megaphone', customers: 'contact' }
</script>

<template>
  <article class="ins" :class="`ins--${insight.status}`">
    <header class="ins__head">
      <UiBadge :tone="typeTone[insight.type]" :icon="typeIcon[insight.type]">{{ insight.type }}</UiBadge>
      <span class="ins__conf num" :title="'Confidence reflects how many independent signals agree'">{{ Math.round(insight.confidence * 100) }}% confidence</span>
      <UiBadge v-if="insight.status === 'approved'" tone="success" icon="check">Approved</UiBadge>
    </header>
    <h3 class="ins__title">{{ insight.title }}</h3>

    <div class="ins__evidence">
      <p class="ins__label">Evidence used</p>
      <ul>
        <li v-for="(e, i) in insight.evidence" :key="i">
          <UiIcon :name="sourceIcon[e.source] ?? 'info'" :size="14" />
          <span>{{ e.signal }}</span>
          <strong class="num">{{ e.value }}</strong>
        </li>
      </ul>
    </div>

    <p class="ins__rec"><UiIcon name="bulb" :size="16" /> {{ insight.recommendation }}</p>

    <footer v-if="insight.status === 'new'" class="ins__foot">
      <UiButton v-if="insight.proposedCampaign" size="sm" variant="ai" icon="shield" @click="emit('review')">Review &amp; approve</UiButton>
      <UiButton v-else size="sm" variant="secondary" icon="arrowRight" to="/products">Open products</UiButton>
      <UiButton size="sm" variant="ghost" @click="emit('dismiss')">Dismiss</UiButton>
    </footer>
  </article>
</template>

<style lang="scss" scoped>
.ins {
  @include surface;
  display: grid;
  gap: 0.8rem;
  padding: 1.1rem 1.2rem;

  &--approved { opacity: 0.85; }

  &__head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    text-transform: capitalize;
  }

  &__conf { margin-left: auto; color: var(--c-muted); font-size: 0.75rem; font-weight: 600; text-transform: none; }

  &__title { font-size: 1.02rem; line-height: 1.3; }

  &__evidence {
    padding: 0.7rem 0.85rem;
    border-radius: var(--radius-sm);
    @include ai-mark;
    border: 1px solid var(--c-ai-line);

    ul { display: grid; gap: 0.35rem; }

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;

      .ui-icon { color: var(--c-ai-ink); }
      span { flex: 1; color: var(--c-ink-2); }
    }
  }

  &__label { @include eyebrow; margin-bottom: 0.45rem; color: var(--c-ai-ink); font-size: 0.6rem; }

  &__rec {
    display: flex;
    gap: 0.5rem;
    font-size: 0.88rem;

    .ui-icon { margin-top: 0.15rem; color: var(--c-warn); }
  }

  &__foot { display: flex; flex-wrap: wrap; gap: 0.5rem; }
}
</style>
