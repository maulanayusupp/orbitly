<script setup lang="ts">
import type { KpiMetric } from '~/types'

const props = defineProps<{ metric: KpiMetric; compact?: boolean }>()
const f = useFormat()

const display = computed(() => {
  const { value, format } = props.metric
  if (format === 'currency') return f.money(value, props.compact)
  if (format === 'percent') return f.percent(value)
  return f.number(value)
})
const trend = computed(() => (props.metric.delta > 0.005 ? 'up' : props.metric.delta < -0.005 ? 'down' : 'flat'))
</script>

<template>
  <div class="stat">
    <p class="stat__label">{{ metric.label }}</p>
    <p class="stat__value num">{{ display }}</p>
    <p class="stat__delta" :class="`stat__delta--${trend}`">
      <UiIcon v-if="trend !== 'flat'" name="arrowUpRight" :size="13" :stroke-width="2.2" class="stat__arrow" />
      {{ f.delta(metric.delta) }} <span>vs prev.</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.stat {
  @include surface;
  display: grid;
  gap: 0.35rem;
  padding: 1rem 1.1rem;
  min-width: 0;

  &__label {
    color: var(--c-muted);
    font-size: 0.8rem;
    font-weight: 500;
  }

  &__value {
    font-family: $font-display;
    font-size: clamp(1.3rem, 2.4vw, 1.65rem);
    font-weight: 600;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__delta {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    font-size: 0.75rem;
    font-weight: 600;

    span { color: var(--c-faint); font-weight: 500; }

    &--up { color: var(--c-success); }
    &--down { color: var(--c-danger); }
    &--flat { color: var(--c-muted); }
    &--down .stat__arrow { transform: rotate(90deg); }
  }
}
</style>
