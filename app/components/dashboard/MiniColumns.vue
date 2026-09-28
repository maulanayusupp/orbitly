<script setup lang="ts">
import type { SeriesPoint } from '~/types'

const props = withDefaults(defineProps<{ points: SeriesPoint[]; label: string; tone?: 'primary' | 'ai' | 'flare' }>(), { tone: 'ai' })
const H = 120
const max = computed(() => Math.max(1, ...props.points.map(p => p.value)))
const bw = computed(() => 100 / props.points.length)
</script>

<template>
  <figure class="cols" :class="`cols--${tone}`">
    <svg :viewBox="`0 0 100 ${H}`" preserveAspectRatio="none" class="cols__svg" role="img" :aria-label="label">
      <rect
        v-for="(p, i) in points"
        :key="p.label"
        :x="i * bw + bw * 0.18"
        :width="bw * 0.64"
        :y="H - (p.value / max) * (H - 4)"
        :height="(p.value / max) * (H - 4)"
        rx="1.5"
        class="cols__bar"
        :class="{ 'is-last': i === points.length - 1 }"
      />
    </svg>
    <figcaption class="cols__labels">
      <span v-for="p in points" :key="p.label">{{ p.label }}</span>
    </figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.cols {
  margin: 0;

  &__svg { width: 100%; height: 120px; }

  &__bar { opacity: 0.35; }
  &__bar.is-last { opacity: 1; }
  &--ai .cols__bar { fill: var(--c-series-3); }
  &--primary .cols__bar { fill: var(--c-series-1); }
  &--flare .cols__bar { fill: var(--c-series-2); }

  &__labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.4rem;
    color: var(--c-faint);
    font-size: 0.68rem;

    span { flex: 1; text-align: center; }
  }
}
</style>
