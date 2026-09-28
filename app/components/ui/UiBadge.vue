<script setup lang="ts">
import type { IconName } from '~/utils/iconPaths'

withDefaults(defineProps<{
  tone?: 'neutral' | 'primary' | 'success' | 'warn' | 'danger' | 'info' | 'ai' | 'flare'
  icon?: IconName
  dot?: boolean
}>(), { tone: 'neutral', icon: undefined })
</script>

<template>
  <span class="badge" :class="`badge--${tone}`">
    <span v-if="dot" class="badge__dot" aria-hidden="true" />
    <UiIcon v-if="icon" :name="icon" :size="12" :stroke-width="2" />
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-pill);
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;

  &__dot {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: currentColor;
  }

  &--neutral { background: color-mix(in srgb, var(--c-ink) 7%, transparent); color: var(--c-ink-2); }
  &--primary { background: var(--c-primary-soft); color: var(--c-primary); }
  &--success { background: var(--c-success-soft); color: var(--c-success); }
  &--warn { background: var(--c-warn-soft); color: var(--c-warn); }
  &--danger { background: var(--c-danger-soft); color: var(--c-danger); }
  &--info { background: var(--c-info-soft); color: var(--c-info); }
  &--ai { background: var(--c-ai-wash); color: var(--c-ai-ink); box-shadow: inset 0 0 0 1px var(--c-ai-line); }
  &--flare { background: var(--c-flare-soft); color: var(--c-flare); }
}
</style>
