<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
useHead({ title: notFound.value ? 'Page not found' : 'Something went wrong' })
useSeoMeta({ robots: 'noindex, follow' })
</script>

<template>
  <div class="err">
    <BrandMark />
    <p class="err__code num">{{ error.statusCode }}</p>
    <h1>{{ notFound ? 'This page drifted out of orbit' : 'Something went wrong' }}</h1>
    <p class="err__text">{{ notFound ? 'The link may be old, or the item was removed from this demo.' : error.message }}</p>
    <div class="err__actions">
      <UiButton @click="clearError({ redirect: '/' })">Back home</UiButton>
      <UiButton variant="secondary" @click="clearError({ redirect: '/dashboard' })">Open dashboard</UiButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.err {
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 0.75rem;
  min-height: 100vh;
  padding: $gutter;
  text-align: center;

  &__code {
    font-family: $font-display;
    font-size: 4rem;
    font-weight: 700;
    @include orbit-text;
  }

  &__text { max-width: 28rem; color: var(--c-muted); }
  &__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; margin-top: 0.5rem; }
}
</style>
