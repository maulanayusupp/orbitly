<script setup lang="ts">
// Horizontal bar list; the bar length is an SVG width attribute.
withDefaults(defineProps<{
  items: Array<{ id: string; label: string; value: number; display: string; meta?: string }>
  tone?: 'primary' | 'flare' | 'ai'
}>(), { tone: 'primary' })
</script>

<template>
  <ul class="bars" :class="`bars--${tone}`">
    <li v-for="item in items" :key="item.id" class="bars__row">
      <div class="bars__text">
        <span class="bars__label">{{ item.label }}</span>
        <span class="bars__value num">{{ item.display }}</span>
      </div>
      <svg class="bars__track" viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
        <rect width="100" height="6" rx="3" class="bars__bg" />
        <rect :width="Math.max(2, (item.value / Math.max(1, ...items.map(i => i.value))) * 100)" height="6" rx="3" class="bars__fill" />
      </svg>
      <span v-if="item.meta" class="bars__meta">{{ item.meta }}</span>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.bars {
  display: grid;
  gap: 0.9rem;

  &__row { display: grid; gap: 0.35rem; }

  &__text {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.85rem;
  }

  &__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__value { font-weight: 600; }

  &__track { width: 100%; height: 6px; }
  &__bg { fill: var(--c-surface-2); }
  &--primary .bars__fill { fill: var(--c-series-1); }
  &--flare .bars__fill { fill: var(--c-series-2); }
  &--ai .bars__fill { fill: var(--c-series-3); }

  &__meta { color: var(--c-faint); font-size: 0.72rem; }
}
</style>
