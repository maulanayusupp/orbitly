<script setup lang="ts">
// Label + control + hint wrapper. The control itself is passed in the slot so
// inputs, textareas and selects share one layout.
defineProps<{
  label: string
  for: string
  hint?: string
  error?: string
  counter?: string
}>()
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <div class="field__top">
      <label class="field__label" :for="$props.for">{{ label }}</label>
      <slot name="badge" />
      <span v-if="counter" class="field__counter num">{{ counter }}</span>
    </div>
    <slot />
    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style lang="scss" scoped>
.field {
  display: grid;
  gap: 0.4rem;
  min-width: 0;

  &__top {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 1.4rem;
  }

  &__label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--c-ink-2);
  }

  &__counter {
    margin-left: auto;
    font-size: 0.72rem;
    color: var(--c-faint);
  }

  &__hint,
  &__error {
    font-size: 0.75rem;
    color: var(--c-muted);
  }

  &__error { color: var(--c-danger); }

  :slotted(.input) {
    width: 100%;
    min-height: 2.6rem;
    padding: 0.6rem 0.8rem;
    border: 1px solid var(--c-line-strong);
    border-radius: var(--radius-sm);
    background: var(--c-surface);
    font-size: 0.92rem;
    transition: border-color var(--dur-fast), box-shadow var(--dur-fast), background var(--dur);

    &:focus {
      outline: none;
      border-color: var(--c-primary);
      box-shadow: 0 0 0 3px var(--c-primary-soft);
    }

    &::placeholder { color: var(--c-faint); }
  }

  :slotted(input.input),
  :slotted(select.input) {
    height: 2.6rem;
  }

  :slotted(textarea.input) {
    resize: vertical;
    line-height: 1.5;
  }
}
</style>
