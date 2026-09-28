<script setup lang="ts">
withDefaults(defineProps<{ to?: string; inverse?: boolean }>(), { to: '/' })
const gid = `brand-${useId()}`
</script>

<template>
  <NuxtLink :to="to" class="brand" :class="{ 'brand--inverse': inverse }" aria-label="Orbitly home">
    <svg class="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient :id="gid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" class="brand__s1" /><stop offset=".55" class="brand__s2" /><stop offset="1" class="brand__s3" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="10" :fill="`url(#${gid})`" />
      <ellipse cx="32" cy="32" rx="25" ry="11" fill="none" :stroke="`url(#${gid})`" stroke-width="4.5" transform="rotate(-28 32 32)" />
      <circle cx="53.5" cy="20.5" r="4" class="brand__moon" />
    </svg>
    <span class="brand__word">Orbitly</span>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--c-ink);

  &--inverse { color: var(--c-surface); }

  &__mark { width: 1.9rem; height: 1.9rem; }
  &__s1 { stop-color: var(--c-primary); }
  &__s2 { stop-color: var(--c-orbit-mid); }
  &__s3 { stop-color: var(--c-flare); }
  &__moon { fill: var(--c-flare); }

  &__word {
    font-family: $font-display;
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
  }
}
</style>
