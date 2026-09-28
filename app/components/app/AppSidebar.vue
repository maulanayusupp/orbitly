<script setup lang="ts">
import { APP_NAV } from '~/config/navigation.config'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const { workspace } = useWorkspace()
const { open: openInsights } = useAIInsights()
const { products } = useProducts()
const drafts = computed(() => products.value.filter(p => p.status === 'draft').length)
</script>

<template>
  <aside class="side" :class="{ 'is-open': open }" aria-label="Workspace navigation">
    <div class="side__top">
      <BrandMark to="/dashboard" />
      <button class="side__close" type="button" aria-label="Close menu" @click="emit('close')"><UiIcon name="x" /></button>
    </div>

    <div class="side__ws">
      <span class="side__ws-logo" aria-hidden="true">K</span>
      <div class="side__ws-text">
        <strong>{{ workspace?.name ?? 'Workspace' }}</strong>
        <span>orbitly.shop/{{ workspace?.slug ?? '…' }}</span>
      </div>
    </div>

    <nav class="side__nav">
      <NuxtLink
        v-for="item in APP_NAV"
        :key="item.id"
        :to="item.to"
        class="side__link"
        active-class="is-active"
        @click="emit('close')"
      >
        <UiIcon :name="item.icon" :size="18" />
        <span>{{ item.label }}</span>
        <UiBadge v-if="item.id === 'marketing' && openInsights.length" tone="ai">{{ openInsights.length }}</UiBadge>
        <UiBadge v-if="item.id === 'products' && drafts" tone="warn">{{ drafts }}</UiBadge>
      </NuxtLink>
    </nav>

    <NuxtLink to="/" class="side__cta" @click="emit('close')">
      <UiIcon name="wand" :size="18" />
      <span><strong>Photo → product</strong><small>Generate a listing with AI</small></span>
    </NuxtLink>
  </aside>
  <Transition name="fade">
    <div v-if="open" class="side__scrim" aria-hidden="true" @click="emit('close')" />
  </Transition>
</template>

<style lang="scss" scoped>
.side {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: z('sidebar');
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: min(84vw, $sidebar-width);
  padding: 1.1rem 0.9rem;
  border-right: 1px solid var(--c-line);
  background: var(--c-surface);
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform var(--dur) var(--ease-out);

  &.is-open { transform: none; box-shadow: var(--shadow-lg); }

  @include respond-to('lg') {
    transform: none;
    &.is-open { box-shadow: none; }
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: 0.4rem;
  }

  &__close {
    display: grid;
    place-items: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    color: var(--c-muted);

    @include respond-to('lg') { display: none; }
  }

  &__ws {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.6rem;
    border: 1px solid var(--c-line);
    border-radius: var(--radius-md);
    background: var(--c-surface-2);
  }

  &__ws-logo {
    display: grid;
    place-items: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: var(--radius-sm);
    background: var(--c-ink);
    color: var(--c-surface);
    font-family: $font-display;
    font-weight: 700;
  }

  &__ws-text {
    display: grid;
    min-width: 0;
    line-height: 1.25;

    strong { font-size: 0.88rem; }

    span {
      overflow: hidden;
      color: var(--c-muted);
      font-size: 0.72rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__nav { display: grid; gap: 0.15rem; }

  &__link {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.6rem 0.7rem;
    border-radius: var(--radius-sm);
    color: var(--c-ink-2);
    font-size: 0.9rem;
    font-weight: 500;
    transition: background var(--dur-fast), color var(--dur-fast);

    span:not(.badge) { flex: 1; }

    &:hover { background: var(--c-surface-2); color: var(--c-ink); }

    &.is-active {
      background: var(--c-primary-soft);
      color: var(--c-primary);
      font-weight: 600;
    }
  }

  &__cta {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-top: auto;
    padding: 0.85rem;
    border-radius: var(--radius-md);
    background: var(--c-ink);
    color: var(--c-surface);

    span { display: grid; line-height: 1.3; }
    strong { font-size: 0.85rem; }
    small { color: var(--c-faint); font-size: 0.72rem; }
    .ui-icon { color: var(--c-ai-line); }

    &:hover { background: var(--c-ink-2); }
  }

  &__scrim {
    position: fixed;
    inset: 0;
    z-index: z('sidebar') - 1;
    background: rgb(22 19 43 / 0.35);

    @include respond-to('lg') { display: none; }
  }
}

.fade-enter-active,
.fade-leave-active { transition: opacity var(--dur); }

.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
