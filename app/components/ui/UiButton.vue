<script setup lang="ts">
import type { IconName } from '~/utils/iconPaths'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'ai' | 'danger' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  icon?: IconName
  iconRight?: IconName
  loading?: boolean
  disabled?: boolean
  block?: boolean
  type?: 'button' | 'submit'
}>(), { variant: 'primary', size: 'md', type: 'button', to: undefined, icon: undefined, iconRight: undefined })

const iconSize = computed(() => (props.size === 'lg' ? 20 : props.size === 'sm' ? 15 : 17))
</script>

<template>
  <NuxtLink
    v-if="to && !disabled"
    :to="to"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
  >
    <UiIcon v-if="icon" :name="icon" :size="iconSize" />
    <span><slot /></span>
    <UiIcon v-if="iconRight" :name="iconRight" :size="iconSize" />
  </NuxtLink>
  <button
    v-else
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block, 'is-loading': loading }]"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <UiIcon v-else-if="icon" :name="icon" :size="iconSize" />
    <span><slot /></span>
    <UiIcon v-if="iconRight && !loading" :name="iconRight" :size="iconSize" />
  </button>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  transition:
    background var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out),
    box-shadow var(--dur-fast) var(--ease-out);

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--sm { height: 2rem; padding-inline: 0.8rem; font-size: 0.8rem; }
  &--md { height: 2.5rem; padding-inline: 1.1rem; font-size: 0.9rem; }
  &--lg { height: 3.25rem; padding-inline: 1.6rem; font-size: 1rem; }
  &--block { width: 100%; }

  &--primary {
    background: var(--c-primary);
    color: var(--c-primary-ink);
    box-shadow: 0 6px 18px -8px var(--c-primary);

    &:hover:not(:disabled) { background: color-mix(in srgb, var(--c-primary) 88%, black); }
  }

  &--dark {
    background: var(--c-ink);
    color: var(--c-surface);

    &:hover:not(:disabled) { background: var(--c-ink-2); }
  }

  &--secondary {
    background: var(--c-surface);
    border-color: var(--c-line-strong);
    color: var(--c-ink);

    &:hover:not(:disabled) { border-color: var(--c-ink-2); }
  }

  &--ghost {
    color: var(--c-ink-2);

    &:hover:not(:disabled) { background: color-mix(in srgb, var(--c-ink) 6%, transparent); }
  }

  &--ai {
    background: var(--grad-ai);
    color: var(--c-primary-ink);
    box-shadow: 0 8px 22px -10px var(--c-ai);

    &:hover:not(:disabled) { filter: brightness(1.05); }
  }

  &--danger {
    background: var(--c-danger-soft);
    color: var(--c-danger);

    &:hover:not(:disabled) { background: color-mix(in srgb, var(--c-danger) 16%, var(--c-surface)); }
  }

  &__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
