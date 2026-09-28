<script setup lang="ts">
import type { GenerationStage } from '~/config/generation.config'
import type { GenerationStageId } from '~/types'

defineProps<{
  stages: GenerationStage[]
  stateOf: (id: GenerationStageId) => 'pending' | 'active' | 'done'
  progress: number
}>()
</script>

<template>
  <div class="stages">
    <div class="stages__bar" role="progressbar" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100" aria-label="Analysis progress">
      <svg viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
        <rect width="100" height="4" rx="2" class="stages__track" />
        <rect :width="progress * 100" height="4" rx="2" class="stages__fill" />
      </svg>
      <span class="num">{{ Math.round(progress * 100) }}%</span>
    </div>
    <ol class="stages__list">
      <li v-for="s in stages" :key="s.id" class="stages__item" :class="`is-${stateOf(s.id)}`">
        <span class="stages__dot" aria-hidden="true">
          <UiIcon v-if="stateOf(s.id) === 'done'" name="check" :size="12" :stroke-width="2.6" />
        </span>
        <span class="stages__label">{{ s.label }}</span>
        <span v-if="stateOf(s.id) === 'active'" class="stages__detail">{{ s.detail }}…</span>
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.stages {
  display: grid;
  gap: 0.9rem;

  &__bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--c-ai-ink);

    svg { flex: 1; height: 4px; }
  }

  &__track { fill: var(--c-line); }
  &__fill { fill: var(--c-ai); transition: width 400ms var(--ease-out); }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
    gap: 0.35rem 1rem;
  }

  &__item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    min-height: 1.6rem;
    color: var(--c-faint);
    font-size: 0.8rem;
    transition: color var(--dur);

    &.is-active { color: var(--c-ink); font-weight: 600; }
    &.is-done { color: var(--c-ink-2); }
  }

  &__dot {
    display: grid;
    place-items: center;
    width: 1.1rem;
    height: 1.1rem;
    border: 1.5px solid var(--c-line-strong);
    border-radius: 50%;
    flex-shrink: 0;

    .is-active & {
      border-color: var(--c-ai);
      box-shadow: 0 0 0 4px var(--c-ai-wash);
      @include motion-safe { animation: pulse 1s ease-in-out infinite; }
    }

    .is-done & {
      border-color: var(--c-ai);
      background: var(--c-ai);
      color: var(--c-primary-ink);
    }
  }

  &__detail {
    flex-basis: 100%;
    padding-left: 1.6rem;
    color: var(--c-ai-ink);
    font-size: 0.72rem;
    font-weight: 500;
  }
}

@keyframes pulse {
  50% { box-shadow: 0 0 0 7px var(--c-ai-wash); }
}
</style>
