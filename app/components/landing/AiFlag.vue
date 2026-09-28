<script setup lang="ts">
// Marks a field's provenance: AI-written, human-edited, or empty.
const props = defineProps<{ generated: boolean; edited: boolean; evidence?: string }>()
const emit = defineEmits<{ restore: [] }>()
const open = ref(false)
</script>

<template>
  <span v-if="props.generated" class="flag">
    <UiBadge v-if="!edited" tone="ai" icon="sparkles">AI</UiBadge>
    <UiBadge v-else tone="primary" icon="edit">Edited</UiBadge>
    <button v-if="edited" type="button" class="flag__btn" @click="emit('restore')">Restore</button>
    <button
      v-if="evidence"
      type="button"
      class="flag__btn flag__why"
      :aria-expanded="open"
      @click="open = !open"
    >
      Why?
    </button>
    <span v-if="open && evidence" class="flag__pop" role="note">{{ evidence }}</span>
  </span>
</template>

<style lang="scss" scoped>
.flag {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  &__btn {
    color: var(--c-muted);
    font-size: 0.72rem;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover { color: var(--c-ink); }
  }

  &__pop {
    position: absolute;
    top: calc(100% + 0.4rem);
    left: 0;
    z-index: z('overlay');
    width: min(18rem, 70vw);
    padding: 0.6rem 0.75rem;
    border-radius: var(--radius-sm);
    background: var(--c-ink);
    color: var(--c-surface);
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.45;
    box-shadow: var(--shadow-lg);
  }
}
</style>
