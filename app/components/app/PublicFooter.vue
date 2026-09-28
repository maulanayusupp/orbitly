<template>
  <footer class="pfoot">
    <div class="pfoot__inner">
      <BrandMark inverse />
      <p class="pfoot__note">
        Frontend demo. Product generation runs locally in your browser — no image leaves your device and no AI
        service is called. Workspace data is sample data stored in this browser only.
      </p>
      <p class="pfoot__copy">© {{ new Date().getFullYear() }} Orbitly concept</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.pfoot {
  background: var(--c-ink);
  color: var(--c-faint);

  &__inner {
    @include container;
    display: grid;
    gap: 1rem;
    padding-block: 2.5rem;

    @include respond-to('md') {
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 2rem;
    }
  }

  &__note {
    max-width: 40rem;
    font-size: 0.82rem;
  }

  &__copy { font-size: 0.78rem; }
}
</style>
