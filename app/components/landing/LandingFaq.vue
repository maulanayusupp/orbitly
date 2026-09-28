<script setup lang="ts">
import { FAQ } from '~/config/landing.config'
</script>

<template>
  <section id="faq" class="faq" aria-labelledby="faq-title">
    <div class="faq__inner">
      <header class="faq__head">
        <p class="faq__eyebrow">FAQ</p>
        <h2 id="faq-title">Questions, answered</h2>
      </header>
      <div class="faq__list">
        <details v-for="(item, i) in FAQ" :key="item.q" class="faq__item" :open="i === 0">
          <summary>
            <span>{{ item.q }}</span>
            <UiIcon name="plus" :size="18" class="faq__icon" />
          </summary>
          <p>{{ item.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.faq {
  padding-block: 0 clamp(4rem, 8vw, 6rem);

  &__inner { @include container(48rem); }

  &__head {
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    text-align: center;

    h2 { font-size: clamp(1.8rem, 4vw, 2.5rem); }
  }

  &__eyebrow {
    @include eyebrow;
    color: var(--c-primary);
  }

  &__list { display: grid; gap: 0.75rem; }

  &__item {
    @include surface;
    padding: 0 1.25rem;
    transition: box-shadow var(--dur);

    &[open] { box-shadow: var(--shadow-md); }
    &[open] .faq__icon { transform: rotate(45deg); }

    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-block: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      list-style: none;

      &::-webkit-details-marker { display: none; }
    }

    p {
      padding-bottom: 1.2rem;
      color: var(--c-muted);
      font-size: 0.95rem;
    }
  }

  &__icon {
    color: var(--c-primary);
    transition: transform var(--dur) var(--ease-out);
  }
}
</style>
