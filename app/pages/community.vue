<script setup lang="ts">
definePageMeta({ layout: 'app', title: 'Community' })
useHead({ title: 'Community' })

const { community, posts, members, events, publish, react, comment, togglePin } = useCommunity()
const { nameOf } = useCustomers()
const { communityGrowth } = useAnalytics()
const { user } = useAuth()
const { push } = useToast()
const f = useFormat()

const body = ref('')
const tab = ref<'feed' | 'members'>('feed')
const accessLabel = { free: 'Free', paid: 'Paid', product: 'Unlocked by product' } as const

function submit() {
  if (!body.value.trim()) return
  publish(body.value)
  body.value = ''
  push('Posted to the community')
}

const engagement = computed(() => {
  const total = posts.value.reduce((s, p) => s + p.reactions.like + p.reactions.fire + p.reactions.idea + p.comments.length, 0)
  return posts.value.length ? total / posts.value.length : 0
})
</script>

<template>
  <div class="com">
    <PageIntro :lead="community?.description">
      <UiBadge tone="primary" icon="lock">{{ community ? accessLabel[community.accessMode] : '' }}</UiBadge>
      <UiButton variant="secondary" size="sm" icon="store" to="/store">Membership page</UiButton>
    </PageIntro>

    <div class="com__grid">
      <div class="com__main">
        <UiSegmented v-model="tab" label="View" :options="[{ value: 'feed', label: 'Feed' }, { value: 'members', label: `Members (${members.length})` }]" />

        <template v-if="tab === 'feed'">
          <form class="com__composer" @submit.prevent="submit">
            <UiAvatar v-if="user" :name="user.name" />
            <label for="composer" class="visually-hidden">Write a post</label>
            <textarea id="composer" v-model="body" rows="2" placeholder="Share an update, ask a question, welcome new members…" />
            <UiButton type="submit" size="sm" icon="send" :disabled="!body.trim()">Post</UiButton>
          </form>
          <TransitionGroup name="list" tag="div" class="com__feed">
            <PostCard
              v-for="p in posts"
              :key="p.id"
              :post="p"
              :author-name="nameOf"
              :owner-id="user?.id"
              @react="k => react(p.id, k)"
              @comment="t => comment(p.id, t)"
              @pin="togglePin(p.id)"
            />
          </TransitionGroup>
        </template>

        <UiCard v-else :padded="false">
          <ul class="com__members">
            <li v-for="m in members" :key="m.id">
              <UiAvatar :name="m.name" />
              <div>
                <strong>{{ m.name }}</strong>
                <span>Joined {{ f.date(m.joinedAt, { month: 'short', year: 'numeric' }) }} · {{ m.posts }} posts</span>
              </div>
              <UiBadge :tone="m.role === 'owner' ? 'primary' : m.role === 'moderator' ? 'info' : m.tier === 'Patron' ? 'flare' : 'neutral'">
                {{ m.role === 'member' ? m.tier : m.role }}
              </UiBadge>
            </li>
          </ul>
        </UiCard>
      </div>

      <aside class="com__side">
        <UiCard title="Growth" :subtitle="`${f.number(community?.memberCount ?? 0)} members`">
          <MiniColumns :points="communityGrowth" label="Weekly member count, last 8 weeks" />
          <p class="com__metric"><strong class="num">{{ engagement.toFixed(1) }}</strong> interactions per post</p>
        </UiCard>
        <UiCard title="Access tiers">
          <ul class="com__tiers">
            <li><span>Circle</span><span>$12 / mo · Studio Circle Membership</span></li>
            <li><span>Patron</span><span>Circle + monthly live critique</span></li>
            <li><span>Course grads</span><span>Unlocked by Wheel Throwing Foundations</span></li>
          </ul>
        </UiCard>
        <UiCard title="Upcoming events">
          <ul class="com__events">
            <li v-for="e in events" :key="e.id">
              <span class="com__date">
                <strong class="num">{{ f.date(e.startsAt, { day: 'numeric' }) }}</strong>
                <small>{{ f.date(e.startsAt, { month: 'short' }) }}</small>
              </span>
              <div>
                <strong>{{ e.title }}</strong>
                <span>{{ e.attendees }} going · {{ e.format }}</span>
              </div>
            </li>
          </ul>
        </UiCard>
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.com {
  &__grid {
    display: grid;
    gap: 1.25rem;
    align-items: start;

    @include respond-to('lg') { grid-template-columns: minmax(0, 1fr) 20rem; }
  }

  &__main { display: grid; gap: 1rem; justify-items: start; > * { width: 100%; } > .seg { width: auto; } }

  &__composer {
    @include surface;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;

    textarea {
      flex: 1;
      min-width: 0;
      border: none;
      resize: vertical;
      outline: none;
      background: transparent;
      font-size: 0.95rem;
    }
  }

  &__feed { display: grid; gap: 1rem; }

  &__members {
    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.8rem 1.1rem;
      border-bottom: 1px solid var(--c-line);
      text-transform: capitalize;

      &:last-child { border-bottom: none; }
    }

    div { display: grid; flex: 1; min-width: 0; line-height: 1.35; }
    strong { font-size: 0.9rem; }
    span { color: var(--c-muted); font-size: 0.78rem; text-transform: none; }
  }

  &__side { display: grid; gap: 1.25rem; }

  &__metric { margin-top: 0.75rem; color: var(--c-muted); font-size: 0.82rem; strong { color: var(--c-ink); } }

  &__tiers li, &__events li {
    display: flex;
    gap: 0.75rem;
    padding-block: 0.55rem;
    border-bottom: 1px solid var(--c-line);
    font-size: 0.85rem;

    &:last-child { border-bottom: none; }
  }

  &__tiers li { justify-content: space-between; span:first-child { font-weight: 600; } span:last-child { color: var(--c-muted); text-align: right; } }

  &__events {
    div { display: grid; line-height: 1.35; }
    span { color: var(--c-muted); font-size: 0.78rem; text-transform: capitalize; }
  }

  &__date {
    display: grid;
    place-items: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: var(--radius-sm);
    background: var(--c-flare-soft);
    color: var(--c-flare);
    line-height: 1;
    flex-shrink: 0;

    small { font-size: 0.65rem; text-transform: uppercase; }
  }
}

.list-enter-active { transition: all var(--dur) var(--ease-out); }
.list-enter-from { opacity: 0; transform: translateY(-8px); }
</style>
