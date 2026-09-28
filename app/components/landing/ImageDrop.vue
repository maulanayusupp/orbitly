<script setup lang="ts">
// Upload surface: file input + drag-and-drop + sample images. Emits files; it
// never reads them itself.
import type { SampleImage } from '~/config/generation.config'
import { ACCEPTED_IMAGE_TYPES } from '~/config/generation.config'

defineProps<{ samples: SampleImage[]; disabled?: boolean; compact?: boolean }>()
const emit = defineEmits<{ file: [File]; sample: [SampleImage] }>()

const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
let depth = 0

function open() { input.value?.click() }

function onChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('file', file)
  ;(e.target as HTMLInputElement).value = ''
}

function onEnter(e: DragEvent) {
  if (!e.dataTransfer?.types.includes('Files')) return
  depth++
  dragging.value = true
}

function onLeave() {
  depth = Math.max(0, depth - 1)
  if (!depth) dragging.value = false
}

function onDrop(e: DragEvent) {
  depth = 0
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) emit('file', file)
}

defineExpose({ open })
</script>

<template>
  <div
    class="drop"
    :class="{ 'is-dragging': dragging, 'drop--compact': compact }"
    @dragenter.prevent="onEnter"
    @dragover.prevent
    @dragleave.prevent="onLeave"
    @drop.prevent="onDrop"
  >
    <input
      ref="input"
      type="file"
      class="visually-hidden"
      :accept="ACCEPTED_IMAGE_TYPES.join(',')"
      tabindex="-1"
      aria-hidden="true"
      @change="onChange"
    >
    <div v-if="!compact" class="drop__body">
      <span class="drop__icon"><UiIcon name="upload" :size="26" /></span>
      <p class="drop__title">{{ dragging ? 'Drop it — we’ll take it from here' : 'Drop a product photo' }}</p>
      <p class="drop__hint">PNG, JPG, WebP or SVG · up to 12 MB · stays on your device</p>
      <UiButton icon="image" :disabled="disabled" @click="open">Choose image</UiButton>
    </div>
    <div class="drop__samples">
      <span class="drop__samples-label">{{ compact ? 'Try another:' : 'No photo handy? Try a sample:' }}</span>
      <div class="drop__chips">
        <button
          v-for="s in samples"
          :key="s.id"
          type="button"
          class="drop__chip"
          :disabled="disabled"
          @click="emit('sample', s)"
        >
          <img :src="s.src" alt="" width="28" height="28">
          {{ s.label }}
        </button>
      </div>
    </div>
    <div v-if="dragging" class="drop__overlay" aria-hidden="true"><UiIcon name="upload" :size="32" /></div>
  </div>
</template>

<style lang="scss" scoped>
.drop {
  position: relative;
  display: grid;
  gap: 1.25rem;

  &__body {
    display: grid;
    justify-items: center;
    gap: 0.5rem;
    padding: clamp(1.75rem, 5vw, 3rem) 1rem;
    border: 2px dashed var(--c-line-strong);
    border-radius: var(--radius-lg);
    background:
      radial-gradient(circle at 50% 0%, var(--c-primary-soft), transparent 70%),
      var(--c-surface-2);
    text-align: center;
    transition: border-color var(--dur), background var(--dur);
  }

  &.is-dragging &__body { border-color: var(--c-primary); }

  &__icon {
    display: grid;
    place-items: center;
    width: 3.5rem;
    height: 3.5rem;
    margin-bottom: 0.4rem;
    border-radius: 50%;
    background: var(--c-surface);
    color: var(--c-primary);
    box-shadow: var(--shadow-md);
  }

  &__title {
    font-family: $font-display;
    font-size: 1.2rem;
    font-weight: 600;
  }

  &__hint {
    margin-bottom: 0.6rem;
    color: var(--c-muted);
    font-size: 0.82rem;
  }

  &__samples {
    display: grid;
    gap: 0.5rem;
  }

  &--compact &__samples {
    grid-template-columns: auto 1fr;
    align-items: center;
  }

  &__samples-label {
    color: var(--c-muted);
    font-size: 0.78rem;
    font-weight: 500;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.25rem 0.75rem 0.25rem 0.3rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-pill);
    background: var(--c-surface);
    font-size: 0.8rem;
    font-weight: 500;
    transition: border-color var(--dur-fast), transform var(--dur-fast);

    img { border-radius: 50%; }

    &:hover:not(:disabled) { border-color: var(--c-primary); transform: translateY(-1px); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    border: 2px solid var(--c-primary);
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--c-primary-soft) 80%, transparent);
    color: var(--c-primary);
    pointer-events: none;
  }
}
</style>
