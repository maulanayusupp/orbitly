<script setup lang="ts">
const props = withDefaults(defineProps<{
  open: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>(), { size: 'md' })
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLElement | null>(null)
let lastFocus: Element | null = null

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(() => props.open, async (open) => {
  if (!import.meta.client) return
  if (open) {
    lastFocus = document.activeElement
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('has-modal')
    await nextTick()
    dialog.value?.focus()
  } else {
    document.removeEventListener('keydown', onKey)
    document.documentElement.classList.remove('has-modal')
    ;(lastFocus as HTMLElement | null)?.focus?.()
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('has-modal')
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal" @click.self="emit('close')">
        <div
          ref="dialog"
          class="modal__panel"
          :class="`modal__panel--${size}`"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
        >
          <header class="modal__head">
            <h2 class="modal__title">{{ title }}</h2>
            <button class="modal__close" type="button" aria-label="Close" @click="emit('close')">
              <UiIcon name="x" />
            </button>
          </header>
          <div class="modal__body"><slot /></div>
          <footer v-if="$slots.footer" class="modal__foot"><slot name="footer" /></footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: z('modal');
  display: grid;
  place-items: end center;
  padding: 0;
  background: rgb(22 19 43 / 0.45);
  backdrop-filter: blur(3px);

  @include respond-to('md') {
    place-items: center;
    padding: 1.5rem;
  }

  &__panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 92vh;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    background: var(--c-surface);
    box-shadow: var(--shadow-lg);
    outline: none;

    @include respond-to('md') { border-radius: var(--radius-xl); }

    &--sm { max-width: 26rem; }
    &--md { max-width: 34rem; }
    &--lg { max-width: 46rem; }
    &--xl { max-width: 64rem; }
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.1rem 1.4rem;
    border-bottom: 1px solid var(--c-line);
  }

  &__title { font-size: 1.1rem; }

  &__close {
    display: grid;
    place-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    color: var(--c-muted);

    &:hover { background: var(--c-surface-2); color: var(--c-ink); }
  }

  &__body {
    padding: 1.4rem;
    overflow-y: auto;
  }

  &__foot {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.6rem;
    padding: 1rem 1.4rem;
    border-top: 1px solid var(--c-line);
    background: var(--c-surface-2);
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur) var(--ease-out);

  .modal__panel { transition: transform var(--dur) var(--ease-out); }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal__panel { transform: translateY(24px) scale(0.98); }
}
</style>
