<script setup lang="ts">
import type { ActivityEvent } from '~/types'
import type { IconName } from '~/utils/iconPaths'

defineProps<{ events: ActivityEvent[] }>()
const { relative } = useFormat()
const icons: Record<ActivityEvent['kind'], IconName> = {
  order: 'cart', signup: 'users', post: 'message', product: 'box', campaign: 'megaphone', insight: 'sparkles',
}
</script>

<template>
  <ul class="feed">
    <li v-for="e in events" :key="e.id" class="feed__item">
      <span class="feed__icon" :class="`feed__icon--${e.kind}`"><UiIcon :name="icons[e.kind]" :size="15" /></span>
      <div class="feed__body">
        <p>{{ e.message }}</p>
        <time :datetime="e.createdAt">{{ relative(e.createdAt) }}</time>
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.feed {
  display: grid;
  gap: 0.9rem;

  &__item { display: flex; gap: 0.75rem; }

  &__icon {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--c-surface-2);
    color: var(--c-muted);

    &--order { background: var(--c-success-soft); color: var(--c-success); }
    &--insight { background: var(--c-ai-wash); color: var(--c-ai-ink); }
    &--campaign { background: var(--c-flare-soft); color: var(--c-flare); }
    &--product { background: var(--c-primary-soft); color: var(--c-primary); }
  }

  &__body {
    min-width: 0;

    p { font-size: 0.86rem; line-height: 1.4; }
    time { color: var(--c-faint); font-size: 0.74rem; }
  }
}
</style>
