<script setup lang="ts">
defineProps<{ lead?: string }>()
</script>

<template>
  <div class="intro">
    <p v-if="lead" class="intro__lead">{{ lead }}</p>
    <div v-if="$slots.default" class="intro__actions"><slot /></div>
  </div>
</template>

<style lang="scss" scoped>
.intro {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  &__lead {
    max-width: 44rem;
    color: var(--c-muted);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }
}
</style>
