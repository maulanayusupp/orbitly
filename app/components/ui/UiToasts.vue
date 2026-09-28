<script setup lang="ts">
const { toasts, dismiss } = useToast()
const icons = { success: 'checkCircle', info: 'info', ai: 'sparkles', danger: 'alert' } as const
</script>

<template>
  <div class="toasts" aria-live="polite" aria-atomic="false">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="`toast--${t.tone}`" role="status">
        <UiIcon :name="icons[t.tone]" :size="18" />
        <span>{{ t.message }}</span>
        <button type="button" class="toast__x" aria-label="Dismiss" @click="dismiss(t.id)"><UiIcon name="x" :size="14" /></button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.toasts {
  position: fixed;
  right: 1rem;
  bottom: 5.5rem;
  left: 1rem;
  z-index: z('toast');
  display: grid;
  justify-items: end;
  gap: 0.5rem;
  pointer-events: none;

  @include respond-to('lg') { bottom: 1.5rem; left: auto; }
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  max-width: 26rem;
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius-md);
  background: var(--c-ink);
  color: var(--c-surface);
  box-shadow: var(--shadow-lg);
  font-size: 0.88rem;
  pointer-events: auto;

  &--success :deep(.ui-icon:first-child) { color: var(--c-ai-line); }
  &--ai :deep(.ui-icon:first-child) { color: var(--c-ai-line); }
  &--danger :deep(.ui-icon:first-child) { color: var(--c-flare); }

  &__x {
    margin-left: 0.25rem;
    color: var(--c-faint);

    &:hover { color: var(--c-surface); }
  }
}

.toast-enter-active,
.toast-leave-active { transition: all var(--dur) var(--ease-out); }

.toast-enter-from,
.toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>
