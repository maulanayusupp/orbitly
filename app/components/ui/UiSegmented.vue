<script setup lang="ts" generic="T extends string | number">
defineProps<{ options: Array<{ value: T; label: string }>; label: string }>()
const model = defineModel<T>({ required: true })
</script>

<template>
  <div class="seg" role="radiogroup" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="radio"
      class="seg__opt"
      :class="{ 'is-active': model === o.value }"
      :aria-checked="model === o.value"
      @click="model = o.value"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.seg {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  padding: 0.2rem;
  border: 1px solid var(--c-line);
  border-radius: var(--radius-pill);
  background: var(--c-surface-2);

  &__opt {
    padding: 0.35rem 0.8rem;
    border-radius: var(--radius-pill);
    color: var(--c-muted);
    font-size: 0.8rem;
    font-weight: 600;
    transition: background var(--dur-fast), color var(--dur-fast);

    &:hover { color: var(--c-ink); }

    &.is-active {
      background: var(--c-surface);
      color: var(--c-ink);
      box-shadow: var(--shadow-sm);
    }
  }
}
</style>
