<script setup lang="ts">
import type { IconName } from '~/utils/iconPaths'

defineProps<{ icon: IconName; title: string; text?: string }>()
</script>

<template>
  <div class="empty">
    <span class="empty__icon"><UiIcon :name="icon" :size="22" /></span>
    <p class="empty__title">{{ title }}</p>
    <p v-if="text" class="empty__text">{{ text }}</p>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.empty {
  display: grid;
  justify-items: center;
  gap: 0.4rem;
  padding: 2.5rem 1rem;
  text-align: center;

  &__icon {
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    margin-bottom: 0.4rem;
    border-radius: 50%;
    background: var(--c-surface-2);
    color: var(--c-muted);
  }

  &__title { font-weight: 600; }
  &__text { max-width: 28rem; color: var(--c-muted); font-size: 0.88rem; }
}
</style>
