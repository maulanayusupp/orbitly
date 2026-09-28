<script setup lang="ts">
// Ring meter for AI confidence (0–1). The arc length is an SVG attribute, so no
// inline style is needed.
const props = withDefaults(defineProps<{ value: number; threshold?: number; size?: number }>(), { threshold: 0.8, size: 72 })
const R = 30
const C = 2 * Math.PI * R
const dash = computed(() => `${(C * Math.max(0, Math.min(1, props.value))).toFixed(1)} ${C.toFixed(1)}`)
const tone = computed(() => (props.value >= props.threshold ? 'high' : props.value >= 0.6 ? 'mid' : 'low'))
</script>

<template>
  <div class="conf" :class="`conf--${tone}`">
    <svg :width="size" :height="size" viewBox="0 0 72 72" role="img" :aria-label="`AI confidence ${Math.round(value * 100)} percent`">
      <circle cx="36" cy="36" :r="R" class="conf__track" />
      <circle v-if="value > 0" cx="36" cy="36" :r="R" class="conf__arc" :stroke-dasharray="dash" transform="rotate(-90 36 36)" />
    </svg>
    <span class="conf__value num">{{ Math.round(value * 100) }}<small>%</small></span>
  </div>
</template>

<style lang="scss" scoped>
.conf {
  position: relative;
  display: inline-grid;
  place-items: center;

  svg { display: block; }

  &__track {
    fill: none;
    stroke: var(--c-line);
    stroke-width: 6;
  }

  &__arc {
    fill: none;
    stroke-width: 6;
    stroke-linecap: round;
    transition: stroke-dasharray 900ms var(--ease-out);
  }

  &--high .conf__arc { stroke: var(--c-ai); }
  &--mid .conf__arc { stroke: var(--c-warn); }
  &--low .conf__arc { stroke: var(--c-danger); }

  &__value {
    position: absolute;
    font-family: $font-display;
    font-size: 1.1rem;
    font-weight: 700;

    small { font-size: 0.65em; color: var(--c-muted); }
  }
}
</style>
