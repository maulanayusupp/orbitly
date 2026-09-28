// Deterministic demo data for the "Kiln & Co." workspace. A seeded PRNG keeps
// the generated orders identical between runs; dates are relative to `now` so
// the demo always looks current.
import type {
  ActivityEvent, Campaign, Customer, DemoSnapshot, Insight, Member, Membership,
  Order, Post, Product, User,
} from '~/types'
import { DEFAULT_WORKSPACE_ID } from '~/config/app.config'

const WS = DEFAULT_WORKSPACE_ID
const DAY = 86_400_000

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FIRST = ['Ayu', 'Ben', 'Clara', 'Dimas', 'Elena', 'Farah', 'Gilang', 'Hana', 'Ivan', 'Jess', 'Kenji', 'Laras', 'Maya', 'Nico', 'Olivia', 'Putri', 'Raka', 'Sofia', 'Tomas', 'Uma', 'Vera', 'Wira', 'Yuki', 'Zara']
const LAST = ['Santoso', 'Miller', 'Wijaya', 'Chen', 'Rossi', 'Rahman', 'Pratama', 'Kim', 'Novak', 'Lee', 'Tanaka', 'Putri', 'Sari', 'Alvarez', 'Brown', 'Halim', 'Nugroho', 'Costa', 'Weber', 'Das', 'Moreau', 'Kusuma', 'Sato', 'Ali']
const CITIES = ['Jakarta', 'Bandung', 'Singapore', 'Yogyakarta', 'Kuala Lumpur', 'Surabaya', 'Melbourne', 'Bali']

export function buildSeed(nowMs = Date.now()): DemoSnapshot {
  const rand = mulberry32(20260928)
  const now = Math.floor(nowMs / 3_600_000) * 3_600_000
  const ago = (days: number, hours = 0) => new Date(now - days * DAY - hours * 3_600_000).toISOString()
  const ahead = (days: number) => new Date(now + days * DAY).toISOString()

  const team: User[] = [
    { id: 'u_rina', name: 'Rina Hartono', email: 'rina@kilnandco.example', role: 'owner' },
    { id: 'u_dafa', name: 'Dafa Ramadhan', email: 'dafa@kilnandco.example', role: 'editor' },
    { id: 'u_mei', name: 'Mei Lestari', email: 'mei@kilnandco.example', role: 'admin' },
  ]

  const products: Product[] = [
    { id: 'p_course', workspaceId: WS, type: 'course', title: 'Wheel Throwing Foundations', slug: 'wheel-throwing-foundations', description: 'Twelve video lessons that take you from centring your first lump of clay to trimming a set of four matching cups.', price: 89, currency: 'USD', status: 'published', category: 'Courses › Ceramics', tags: ['pottery', 'course', 'beginner'], sales: 0, views: 4210, createdAt: ago(120) },
    { id: 'p_member', workspaceId: WS, type: 'membership', title: 'Studio Circle Membership', slug: 'studio-circle', description: 'Monthly glaze drops, live critiques and the members-only community.', price: 12, currency: 'USD', status: 'published', category: 'Memberships', tags: ['community', 'monthly'], sales: 0, views: 3120, createdAt: ago(200) },
    { id: 'p_glaze', workspaceId: WS, type: 'digital', title: 'Glaze Recipe Pack Vol. 2', slug: 'glaze-recipe-pack-2', description: '40 tested cone-6 glaze recipes with photos, test-tile notes and a mixing calculator.', price: 24, currency: 'USD', status: 'published', category: 'Digital › Recipes', tags: ['glaze', 'recipes', 'pdf'], sales: 0, views: 2890, createdAt: ago(75) },
    { id: 'p_cohort', workspaceId: WS, type: 'cohort', title: 'Glaze Lab — Live Cohort', slug: 'glaze-lab-cohort', description: 'Four live Saturday sessions testing glazes together, with replays.', price: 149, currency: 'USD', status: 'published', category: 'Cohorts', tags: ['live', 'cohort', 'glaze'], sales: 0, views: 1480, createdAt: ago(40) },
    { id: 'p_critique', workspaceId: WS, type: 'service', title: '1:1 Portfolio Critique', slug: 'portfolio-critique', description: 'A 45-minute video call reviewing your work, with a written follow-up.', price: 65, currency: 'USD', status: 'published', category: 'Services', tags: ['coaching', '1:1'], sales: 0, views: 690, createdAt: ago(90) },
    { id: 'p_mugset', workspaceId: WS, type: 'physical', title: 'Speckled Mug Set of Two', slug: 'speckled-mug-set', description: 'Two hand-thrown speckled stoneware mugs from the studio shelf.', price: 58, currency: 'USD', status: 'published', category: 'Home & Kitchen › Drinkware', tags: ['mug', 'handmade', 'gift'], sales: 0, views: 1960, createdAt: ago(30) },
    { id: 'p_kiln', workspaceId: WS, type: 'digital', title: 'Kiln Firing Schedules Cheatsheet', slug: 'kiln-firing-cheatsheet', description: 'Printable firing schedules for bisque, glaze and crystalline firings.', price: 9, currency: 'USD', status: 'draft', category: 'Digital › Guides', tags: ['kiln', 'cheatsheet'], sales: 0, views: 0, createdAt: ago(3) },
  ]
  const productById = new Map(products.map(p => [p.id, p]))

  const customers: Customer[] = FIRST.map((first, i) => {
    const name = `${first} ${LAST[i]}`
    return {
      id: `c_${i + 1}`,
      workspaceId: WS,
      name,
      email: `${first.toLowerCase()}.${LAST[i]!.toLowerCase()}@mail.example`,
      status: i % 9 === 8 ? 'churned' : i % 7 === 6 ? 'lead' : 'active',
      lifetimeValue: 0,
      firstSeenAt: ago(Math.floor(rand() * 170) + 10),
      tags: [],
      city: CITIES[i % CITIES.length],
    }
  })

  // Weighted product mix for generated orders.
  const mix: Array<[string, number]> = [['p_course', 0.24], ['p_member', 0.26], ['p_glaze', 0.22], ['p_cohort', 0.08], ['p_critique', 0.06], ['p_mugset', 0.14]]
  const pickProduct = () => {
    let r = rand()
    for (const [id, w] of mix) { if ((r -= w) <= 0) return productById.get(id)! }
    return productById.get('p_glaze')!
  }

  const orders: Order[] = []
  const buyers = customers.filter(c => c.status !== 'lead')
  for (let day = 59; day >= 0; day--) {
    // Gentle growth trend + weekend bump; last week slightly stronger.
    const weekend = new Date(now - day * DAY).getUTCDay() % 6 === 0 ? 1.4 : 1
    const expected = (1.2 + (59 - day) / 30) * weekend
    const count = Math.max(0, Math.round(expected + (rand() - 0.5) * 2))
    for (let n = 0; n < count; n++) {
      const product = pickProduct()
      const customer = buyers[Math.floor(rand() * buyers.length)]!
      const id = `o_${1000 + orders.length}`
      const qty = product.type === 'physical' && rand() > 0.7 ? 2 : 1
      orders.push({
        id,
        workspaceId: WS,
        customerId: customer.id,
        total: product.price * qty,
        currency: 'USD',
        status: rand() > 0.97 ? 'refunded' : 'paid',
        paymentReference: `pay_${(0x9a3f00 + orders.length * 7919).toString(16)}`,
        items: [{ id: `${id}_1`, orderId: id, productId: product.id, quantity: qty, unitPrice: product.price }],
        createdAt: ago(day, Math.floor(rand() * 20)),
      })
    }
  }
  orders.reverse() // newest first

  for (const order of orders) {
    if (order.status !== 'paid') continue
    const c = customers.find(x => x.id === order.customerId)!
    c.lifetimeValue += order.total
    for (const item of order.items) {
      productById.get(item.productId)!.sales += item.quantity
      const tag = productById.get(item.productId)!.type
      if (!c.tags.includes(tag)) c.tags.push(tag)
    }
  }
  customers.forEach((c) => {
    if (c.lifetimeValue > 300) c.tags.unshift('vip')
    if (c.status === 'lead') c.tags.push('newsletter')
  })

  const memberships: Membership[] = customers
    .filter(c => c.tags.includes('membership'))
    .map((c, i) => ({
      id: `m_${i + 1}`,
      workspaceId: WS,
      customerId: c.id,
      tierId: i % 4 === 0 ? 'tier_patron' : 'tier_circle',
      status: c.status === 'churned' ? 'cancelled' : i % 6 === 5 ? 'trialing' : 'active',
      startedAt: c.firstSeenAt,
    }))

  const members: Member[] = [
    { id: 'u_rina', name: 'Rina Hartono', role: 'owner', tier: 'Owner', joinedAt: ago(200), posts: 64 },
    { id: 'u_mei', name: 'Mei Lestari', role: 'moderator', tier: 'Team', joinedAt: ago(180), posts: 31 },
    ...customers.slice(0, 14).map((c, i): Member => ({
      id: c.id, name: c.name, role: 'member', tier: i % 4 === 0 ? 'Patron' : 'Circle', joinedAt: c.firstSeenAt, posts: Math.floor(rand() * 24),
    })),
  ]

  const posts: Post[] = [
    { id: 'post_1', communityId: 'com_1', authorId: 'u_rina', body: 'Welcome to Studio Circle! Introduce yourself below — what are you making this month, and what cone do you fire to?', createdAt: ago(6), reactions: { like: 42, fire: 11, idea: 3 }, myReactions: [], pinned: true, comments: [
      { id: 'cm_1', postId: 'post_1', authorId: 'c_3', body: 'Hi all! Clara from Singapore, cone 6 electric. Working on a set of ramen bowls.', createdAt: ago(5) },
      { id: 'cm_2', postId: 'post_1', authorId: 'c_11', body: 'Kenji here — first time trimming this week, wish me luck.', createdAt: ago(4) },
    ] },
    { id: 'post_2', communityId: 'com_1', authorId: 'c_5', body: 'Tried the Celadon #14 recipe from the pack on a porcelain body — the pooling in the recesses is unreal. Swipe for the test tiles.', createdAt: ago(1, 3), reactions: { like: 28, fire: 19, idea: 2 }, myReactions: [], comments: [
      { id: 'cm_3', postId: 'post_2', authorId: 'u_rina', body: 'That is textbook celadon. Try a slightly thicker application on the rim next time.', createdAt: ago(1, 1) },
    ] },
    { id: 'post_3', communityId: 'com_1', authorId: 'c_12', body: 'Question: my handles keep cracking at the join after bisque. Slip + score, same moisture… what am I missing?', createdAt: ago(0, 9), reactions: { like: 9, fire: 0, idea: 14 }, myReactions: [], comments: [
      { id: 'cm_4', postId: 'post_3', authorId: 'u_mei', body: 'Dry them slower — wrap the handle joins in plastic for a day so the thin part does not dry ahead of the body.', createdAt: ago(0, 7) },
      { id: 'cm_5', postId: 'post_3', authorId: 'c_2', body: 'Same issue last month, slower drying fixed it for me.', createdAt: ago(0, 6) },
    ] },
    { id: 'post_4', communityId: 'com_1', authorId: 'u_rina', body: 'Glaze Lab cohort #3 opens next week. Members get early access 48 hours before everyone else — watch this space.', createdAt: ago(0, 2), reactions: { like: 36, fire: 22, idea: 1 }, myReactions: [], comments: [] },
  ]

  const campaigns: Campaign[] = [
    { id: 'cmp_1', workspaceId: WS, channel: 'email', name: 'Glaze Pack Vol. 2 launch', status: 'completed', budget: 0, startedAt: ago(74), endedAt: ago(67), audience: 'All subscribers', sent: 2840, opened: 1392, clicked: 318, revenue: 1824 },
    { id: 'cmp_2', workspaceId: WS, channel: 'social', name: 'Throwing reels — June series', status: 'completed', budget: 120, startedAt: ago(45), endedAt: ago(20), audience: 'Instagram followers', sent: 18400, opened: 7100, clicked: 612, revenue: 1335 },
    { id: 'cmp_3', workspaceId: WS, channel: 'email', name: 'Studio Circle — monthly glaze drop', status: 'running', budget: 0, startedAt: ago(4), audience: 'Members', sent: 164, opened: 121, clicked: 47, revenue: 216 },
    { id: 'cmp_4', workspaceId: WS, channel: 'email', name: 'Critique slots — autumn', status: 'draft', budget: 0, audience: 'Course graduates', sent: 0, opened: 0, clicked: 0, revenue: 0 },
  ]

  const insights: Insight[] = [
    {
      id: 'ins_seed_1', workspaceId: WS, type: 'opportunity', status: 'new', confidence: 0.82,
      title: 'Course graduates are ready for the Glaze Lab cohort',
      evidence: [
        { signal: 'Course buyers who also bought the glaze pack', value: '38%', source: 'orders' },
        { signal: 'Glaze questions in the community (7 days)', value: '14 posts', source: 'community' },
        { signal: 'Glaze Lab page views (7 days)', value: '+64%', source: 'products' },
      ],
      recommendation: 'Send course graduates a 48-hour early-access invite to Glaze Lab cohort #3.',
      message: 'You have finished Wheel Throwing Foundations — the natural next step is glaze. Glaze Lab cohort #3 opens next week, and course graduates get 48 hours of early access before anyone else.',
      proposedCampaign: { channel: 'email', name: 'Glaze Lab early access — course grads', audience: 'Course graduates', budget: 0 },
    },
  ]

  const activity: ActivityEvent[] = ([
    ...orders.slice(0, 6).map((o): ActivityEvent => ({
      id: `a_${o.id}`, kind: 'order', customerId: o.customerId,
      message: `${customers.find(c => c.id === o.customerId)!.name} bought ${productById.get(o.items[0]!.productId)!.title}`,
      createdAt: o.createdAt,
    })),
    { id: 'a_post3', kind: 'post', customerId: 'c_12', message: 'New community question about cracking handles', createdAt: ago(0, 9) },
    { id: 'a_draft', kind: 'product', message: 'Draft created: Kiln Firing Schedules Cheatsheet', createdAt: ago(3) },
  ] as ActivityEvent[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return {
    workspace: { id: WS, name: 'Kiln & Co.', slug: 'kilnandco', currency: 'USD', timezone: 'Asia/Jakarta', ownerId: 'u_rina' },
    team,
    products,
    orders,
    customers,
    memberships,
    community: { id: 'com_1', workspaceId: WS, name: 'Studio Circle', description: 'A community for potters who fire at cone 6 and want honest feedback.', accessMode: 'product', memberCount: 486 },
    posts,
    members,
    events: [
      { id: 'ev_1', title: 'Live critique: bowls & forms', startsAt: ahead(2), attendees: 58, format: 'live' },
      { id: 'ev_2', title: 'Glaze Lab info session', startsAt: ahead(6), attendees: 112, format: 'ama' },
      { id: 'ev_3', title: 'Trimming workshop', startsAt: ahead(13), attendees: 34, format: 'workshop' },
    ],
    campaigns,
    insights,
    activity,
  }
}
