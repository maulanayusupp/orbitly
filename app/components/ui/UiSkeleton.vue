<script setup lang="ts">
withDefaults(defineProps<{ lines?: number }>(), { lines: 3 })
</script>

<template>
  <div class="skel" aria-busy="true" aria-label="Loading">
    <span v-for="n in lines" :key="n" class="skel__line" />
  </div>
</template>

<style lang="scss" scoped>
.skel {
  display: grid;
  gap: 0.6rem;

  &__line {
    height: 0.9rem;
    border-radius: var(--radius-xs);
    background: linear-gradient(90deg, var(--c-line) 0%, var(--c-surface-2) 50%, var(--c-line) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.3s linear infinite;

    &:last-child { width: 60%; }
  }
}

@keyframes shimmer {
  to { background-position: -200% 0; }
}
</style>
