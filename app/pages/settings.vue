<script setup lang="ts">
import type { CurrencyCode } from '~/types'

definePageMeta({ layout: 'app', title: 'Settings' })
useHead({ title: 'Settings' })

const { workspace, team, updateWorkspace, resetDemo } = useWorkspace()
const { push } = useToast()
const confirmReset = ref(false)

const currencies: CurrencyCode[] = ['USD', 'SGD', 'IDR']
const timezones = ['Asia/Jakarta', 'Asia/Singapore', 'Australia/Melbourne', 'Europe/London', 'America/New_York']
const roleTone = { owner: 'primary', admin: 'info', editor: 'neutral', viewer: 'neutral' } as const

function onField(key: 'name' | 'slug' | 'timezone', e: Event) {
  updateWorkspace({ [key]: (e.target as HTMLInputElement).value })
}

function onCurrency(e: Event) {
  updateWorkspace({ currency: (e.target as HTMLSelectElement).value as CurrencyCode })
  push('Currency updated — amounts are relabelled, not converted, in this demo', 'info')
}

async function reset() {
  await resetDemo()
  confirmReset.value = false
  push('Demo data restored')
}
</script>

<template>
  <div class="st">
    <UiCard title="Workspace" subtitle="Brand profile and regional settings">
      <form v-if="workspace" class="st__form" @submit.prevent>
        <UiField label="Business name" for="st-name">
          <input id="st-name" :value="workspace.name" class="input" @change="onField('name', $event)">
        </UiField>
        <UiField label="Store URL" for="st-slug" :hint="`orbitly.shop/${workspace.slug}`">
          <input id="st-slug" :value="workspace.slug" class="input" @change="onField('slug', $event)">
        </UiField>
        <UiField label="Custom domain" for="st-domain" hint="Connecting a domain needs DNS access — phase 2.">
          <input id="st-domain" class="input" placeholder="shop.yourbrand.com" disabled>
        </UiField>
        <div class="st__row">
          <UiField label="Currency" for="st-cur">
            <select id="st-cur" :value="workspace.currency" class="input" @change="onCurrency">
              <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
            </select>
          </UiField>
          <UiField label="Timezone" for="st-tz">
            <select id="st-tz" :value="workspace.timezone" class="input" @change="onField('timezone', $event)">
              <option v-for="t in timezones" :key="t" :value="t">{{ t }}</option>
            </select>
          </UiField>
        </div>
      </form>
    </UiCard>

    <UiCard title="Team" subtitle="Roles control what each person can change">
      <ul class="st__team">
        <li v-for="u in team" :key="u.id">
          <UiAvatar :name="u.name" />
          <div><strong>{{ u.name }}</strong><span>{{ u.email }}</span></div>
          <UiBadge :tone="roleTone[u.role]">{{ u.role }}</UiBadge>
        </li>
      </ul>
      <p class="st__note">Invitations and fine-grained permissions arrive with the backend (phase 2).</p>
    </UiCard>

    <UiCard title="Demo data" subtitle="Everything in this workspace lives in this browser’s local storage">
      <div class="st__reset">
        <UiButton v-if="!confirmReset" variant="secondary" icon="refresh" @click="confirmReset = true">Reset demo workspace</UiButton>
        <template v-else>
          <span>This removes generated products, test orders and posts.</span>
          <UiButton variant="ghost" size="sm" @click="confirmReset = false">Cancel</UiButton>
          <UiButton variant="danger" size="sm" icon="refresh" @click="reset">Reset now</UiButton>
        </template>
      </div>
    </UiCard>
  </div>
</template>

<style lang="scss" scoped>
.st {
  display: grid;
  gap: 1.25rem;
  max-width: 48rem;

  &__form { display: grid; gap: 1rem; }

  &__row {
    display: grid;
    gap: 1rem;

    @include respond-to('sm') { grid-template-columns: 1fr 1fr; }
  }

  &__team li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-block: 0.6rem;
    border-bottom: 1px solid var(--c-line);
    text-transform: capitalize;

    div { display: grid; flex: 1; min-width: 0; line-height: 1.3; }
    span { color: var(--c-muted); font-size: 0.8rem; text-transform: none; }
  }

  &__note { margin-top: 0.75rem; color: var(--c-muted); font-size: 0.8rem; }

  &__reset {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.88rem;
  }
}
</style>
