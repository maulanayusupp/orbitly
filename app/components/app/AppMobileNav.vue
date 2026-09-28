<script setup lang="ts">
import { APP_NAV, MOBILE_NAV_IDS } from '~/config/navigation.config'

const items = APP_NAV.filter(i => MOBILE_NAV_IDS.includes(i.id))
const short: Record<string, string> = { 'Marketing & AI': 'AI' }
</script>

<template>
  <nav class="mnav" aria-label="Primary">
    <NuxtLink v-for="item in items" :key="item.id" :to="item.to" class="mnav__link" active-class="is-active">
      <UiIcon :name="item.icon" :size="20" />
      <span>{{ short[item.label] ?? item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style lang="scss" scoped>
.mnav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: z('header');
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 0.35rem 0.4rem calc(0.35rem + env(safe-area-inset-bottom));
  border-top: 1px solid var(--c-line);
  @include glass;

  @include respond-to('lg') { display: none; }

  &__link {
    display: grid;
    justify-items: center;
    gap: 0.15rem;
    padding: 0.35rem 0;
    border-radius: var(--radius-sm);
    color: var(--c-muted);
    font-size: 0.68rem;
    font-weight: 600;

    &.is-active { color: var(--c-primary); }
  }
}
</style>
