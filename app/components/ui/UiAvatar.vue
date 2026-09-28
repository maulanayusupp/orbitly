<script setup lang="ts">
import { initials } from '~/utils/format'
import { hashString } from '~/utils/id'

const props = withDefaults(defineProps<{ name: string; size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })
// Five fixed tints from the token palette, chosen by a stable hash of the name.
const tint = computed(() => `avatar--t${hashString(props.name) % 5}`)
</script>

<template>
  <span class="avatar" :class="[`avatar--${size}`, tint]" :title="name" aria-hidden="true">{{ initials(name) }}</span>
</template>

<style lang="scss" scoped>
.avatar {
  display: inline-grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  font-weight: 600;
  letter-spacing: 0.02em;

  &--sm { width: 1.75rem; height: 1.75rem; font-size: 0.65rem; }
  &--md { width: 2.25rem; height: 2.25rem; font-size: 0.75rem; }
  &--lg { width: 3.5rem; height: 3.5rem; font-size: 1.1rem; }

  &--t0 { background: var(--c-primary-soft); color: var(--c-primary); }
  &--t1 { background: var(--c-flare-soft); color: var(--c-flare); }
  &--t2 { background: var(--c-ai-wash); color: var(--c-ai-ink); }
  &--t3 { background: var(--c-info-soft); color: var(--c-info); }
  &--t4 { background: var(--c-warn-soft); color: var(--c-warn); }
}
</style>
