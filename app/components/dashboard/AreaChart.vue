<script setup lang="ts">
// Dependency-free SVG area chart. Geometry is computed here; colours come from
// tokens via SCSS classes.
import type { SeriesPoint } from '~/types'

const props = withDefaults(defineProps<{
  points: SeriesPoint[]
  formatValue?: (v: number) => string
  height?: number
  label: string
}>(), { height: 220, formatValue: (v: number) => String(Math.round(v)) })

const W = 640
const PAD = { t: 16, r: 8, b: 26, l: 8 }
const hover = ref<number | null>(null)
const gid = `area-${useId()}`

const max = computed(() => Math.max(1, ...props.points.map(p => p.value)) * 1.12)
const step = computed(() => (W - PAD.l - PAD.r) / Math.max(1, props.points.length - 1))
const x = (i: number) => PAD.l + i * step.value
const y = (v: number) => PAD.t + (props.height - PAD.t - PAD.b) * (1 - v / max.value)

const line = computed(() => props.points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(' '))
const area = computed(() => `${line.value} L${x(props.points.length - 1).toFixed(1)} ${props.height - PAD.b} L${x(0).toFixed(1)} ${props.height - PAD.b} Z`)
const grid = computed(() => [0.25, 0.5, 0.75, 1].map(f => PAD.t + (props.height - PAD.t - PAD.b) * (1 - f)))
const ticks = computed(() => {
  const n = props.points.length
  const every = Math.max(1, Math.ceil(n / 6))
  return props.points.map((p, i) => ({ i, label: p.label })).filter(t => t.i % every === 0 || t.i === n - 1)
})

function onMove(e: PointerEvent) {
  const svg = e.currentTarget as SVGSVGElement
  const rect = svg.getBoundingClientRect()
  const px = ((e.clientX - rect.left) / rect.width) * W
  hover.value = Math.max(0, Math.min(props.points.length - 1, Math.round((px - PAD.l) / step.value)))
}

const hovered = computed(() => (hover.value === null ? null : props.points[hover.value]))
</script>

<template>
  <figure class="area">
    <svg
      :viewBox="`0 0 ${W} ${height}`"
      preserveAspectRatio="none"
      class="area__svg"
      role="img"
      :aria-label="label"
      @pointermove="onMove"
      @pointerleave="hover = null"
    >
      <defs>
        <linearGradient :id="gid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" class="area__stop-a" />
          <stop offset="1" class="area__stop-b" />
        </linearGradient>
      </defs>
      <line v-for="g in grid" :key="g" :x1="PAD.l" :x2="W - PAD.r" :y1="g" :y2="g" class="area__grid" />
      <path :d="area" :fill="`url(#${gid})`" />
      <path :d="line" class="area__line" vector-effect="non-scaling-stroke" />
      <template v-if="hover !== null && hovered">
        <line :x1="x(hover)" :x2="x(hover)" :y1="PAD.t" :y2="height - PAD.b" class="area__cursor" vector-effect="non-scaling-stroke" />
      </template>
      <text
        v-for="t in ticks"
        :key="t.i"
        :x="x(t.i)"
        :y="height - 6"
        class="area__tick"
        :text-anchor="t.i === 0 ? 'start' : t.i === points.length - 1 ? 'end' : 'middle'"
      >{{ t.label }}</text>
    </svg>
    <figcaption v-if="hovered" class="area__tip">
      <span>{{ hovered.label }}</span>
      <strong class="num">{{ formatValue(hovered.value) }}</strong>
    </figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.area {
  position: relative;
  margin: 0;

  &__svg {
    width: 100%;
    height: 220px;
    overflow: visible;
    touch-action: pan-y;
  }

  &__stop-a { stop-color: var(--c-series-1); stop-opacity: 0.22; }
  &__stop-b { stop-color: var(--c-series-1); stop-opacity: 0; }

  &__grid {
    stroke: var(--c-line);
    stroke-dasharray: 3 5;
    vector-effect: non-scaling-stroke;
  }

  &__line {
    fill: none;
    stroke: var(--c-series-1);
    stroke-width: 2.25;
    stroke-linejoin: round;
  }

  &__cursor { stroke: var(--c-ink-2); stroke-width: 1; stroke-dasharray: 2 3; }

  &__tick {
    fill: var(--c-faint);
    font-size: 11px;
  }

  &__tip {
    position: absolute;
    top: 0;
    right: 0;
    display: grid;
    gap: 0.1rem;
    padding: 0.4rem 0.65rem;
    border-radius: var(--radius-sm);
    background: var(--c-ink);
    color: var(--c-surface);
    font-size: 0.75rem;
    text-align: right;
    pointer-events: none;

    span { color: var(--c-faint); }
  }
}
</style>
