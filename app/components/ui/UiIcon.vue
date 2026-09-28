<script setup lang="ts">
import { iconPaths, type IconName } from '~/utils/iconPaths'

const props = withDefaults(defineProps<{
  name: IconName
  size?: number
  strokeWidth?: number
  label?: string
}>(), { size: 20, strokeWidth: 1.7, label: undefined })

const d = computed(() => iconPaths[props.name])
</script>

<template>
  <svg
    class="ui-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : 'presentation'"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label"
  >
    <title v-if="label">{{ label }}</title>
    <path :d="d" />
  </svg>
</template>

<style lang="scss" scoped>
.ui-icon {
  flex: 0 0 auto;
  overflow: visible;
}
</style>
