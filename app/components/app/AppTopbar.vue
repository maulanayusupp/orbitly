<script setup lang="ts">
defineProps<{ title: string }>()
const emit = defineEmits<{ menu: []; sale: [] }>()
const { user } = useAuth()
</script>

<template>
  <header class="top">
    <button class="top__menu" type="button" aria-label="Open menu" @click="emit('menu')"><UiIcon name="menu" /></button>
    <h1 class="top__title">{{ title }}</h1>
    <div class="top__actions">
      <UiBadge tone="flare" dot class="top__demo">Demo data</UiBadge>
      <UiButton variant="secondary" size="sm" icon="cart" @click="emit('sale')">
        <span class="top__long">Simulate sale</span><span class="top__short">Sale</span>
      </UiButton>
      <UiAvatar v-if="user" :name="user.name" size="sm" />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.top {
  position: sticky;
  top: 0;
  z-index: z('header');
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: $topbar-height;
  padding-inline: $gutter;
  border-bottom: 1px solid var(--c-line);
  @include glass(color-mix(in srgb, var(--c-bg) 82%, transparent));

  &__menu {
    display: grid;
    place-items: center;
    width: 2.3rem;
    height: 2.3rem;
    margin-left: -0.4rem;
    border-radius: 50%;

    &:hover { background: var(--c-surface); }

    @include respond-to('lg') { display: none; }
  }

  &__title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-size: 1.15rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  &__demo {
    @include respond-below('md') { display: none; }
  }

  &__long { @include respond-below('sm') { display: none; } }
  &__short { @include respond-to('sm') { display: none; } }
}
</style>
