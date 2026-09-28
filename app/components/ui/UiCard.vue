<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  padded?: boolean
  as?: string
}>(), { padded: true, as: 'section', title: undefined, subtitle: undefined })
</script>

<template>
  <component :is="as" class="card" :class="{ 'card--padded': padded }">
    <header v-if="title || $slots.actions" class="card__head">
      <div>
        <h3 v-if="title" class="card__title">{{ title }}</h3>
        <p v-if="subtitle" class="card__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="card__actions"><slot name="actions" /></div>
    </header>
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.card {
  @include surface;
  min-width: 0;

  &--padded { padding: clamp(1rem, 2.4vw, 1.4rem); }

  // Unpadded cards hold edge-to-edge content (tables): the header keeps its
  // own inset and the content is clipped to the rounded corners.
  &:not(&--padded) {
    overflow: hidden;

    .card__head {
      margin-bottom: 0;
      padding: clamp(1rem, 2.4vw, 1.4rem);
    }
  }

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 1rem;
    letter-spacing: -0.01em;
  }

  &__subtitle {
    margin-top: 0.2rem;
    color: var(--c-muted);
    font-size: 0.82rem;
  }

  &__actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }
}
</style>
