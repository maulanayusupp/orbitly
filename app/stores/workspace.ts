// Single store for the demo workspace. It owns the snapshot and applies the
// records returned by the pure services; persistence goes through the adapter.
import { defineStore } from 'pinia'
import type {
  Campaign, Comment, DemoSnapshot, Insight, Post, Product, ProductStatus, ReactionKind,
} from '~/types'
import { dataAdapter } from '~/services/adapter'
import { checkout, type CheckoutInput, type CheckoutResult } from '~/services/commerce.service'
import { createId } from '~/utils/id'

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    snapshot: null as DemoSnapshot | null,
    loading: false,
    /** Idempotency keys already processed by checkout. */
    processedKeys: [] as string[],
  }),

  getters: {
    ready: s => s.snapshot !== null,
    data: (s): DemoSnapshot => {
      if (!s.snapshot) throw new Error('Workspace not loaded — call ensureLoaded() first.')
      return s.snapshot
    },
  },

  actions: {
    async ensureLoaded() {
      if (this.snapshot || this.loading) return
      this.loading = true
      try {
        this.snapshot = await dataAdapter.load()
      } finally {
        this.loading = false
      }
    },

    persist() {
      if (this.snapshot) dataAdapter.save(this.snapshot)
    },

    async resetDemo() {
      this.snapshot = await dataAdapter.reset()
      this.processedKeys = []
    },

    // ---- products -------------------------------------------------------
    addProduct(product: Product) {
      this.data.products.unshift(product)
      this.data.activity.unshift({
        id: createId('a'), kind: 'product',
        message: `${product.aiGenerated ? 'AI draft' : 'Draft'} created: ${product.title}`,
        createdAt: new Date().toISOString(),
      })
      this.persist()
    },

    updateProduct(id: string, patch: Partial<Product>) {
      const p = this.data.products.find(x => x.id === id)
      if (!p) return
      Object.assign(p, patch)
      this.persist()
    },

    setProductStatus(id: string, status: ProductStatus) {
      this.updateProduct(id, { status })
      if (status === 'published') {
        const p = this.data.products.find(x => x.id === id)!
        this.data.activity.unshift({ id: createId('a'), kind: 'product', message: `Published: ${p.title}`, createdAt: new Date().toISOString() })
        this.persist()
      }
    },

    removeProduct(id: string) {
      this.data.products = this.data.products.filter(p => p.id !== id)
      this.persist()
    },

    recordView(id: string) {
      const p = this.data.products.find(x => x.id === id)
      if (p) { p.views++; this.persist() }
    },

    // ---- commerce -------------------------------------------------------
    /** Returns null when the idempotency key was already used. */
    placeOrder(input: Omit<CheckoutInput, 'existing'>): CheckoutResult | null {
      if (this.processedKeys.includes(input.idempotencyKey)) return null
      const existing = this.data.customers.find(c => c.email.toLowerCase() === input.buyer.email.toLowerCase())
      const result = checkout({ ...input, existing }, this.data.workspace)
      this.processedKeys.push(input.idempotencyKey)

      this.data.orders.unshift(result.order)
      if (result.customerIsNew) this.data.customers.unshift(result.customer)
      else Object.assign(existing!, result.customer)
      const product = this.data.products.find(p => p.id === input.product.id)
      if (product) product.sales += input.quantity
      if (input.product.type === 'membership') {
        this.data.memberships.unshift({
          id: createId('m'), workspaceId: this.data.workspace.id, customerId: result.customer.id,
          tierId: 'tier_circle', status: 'active', startedAt: result.order.createdAt,
        })
        this.data.community.memberCount++
      }
      this.data.activity.unshift(result.activity)
      this.persist()
      return result
    },

    // ---- customers ------------------------------------------------------
    setCustomerTags(id: string, tags: string[]) {
      const c = this.data.customers.find(x => x.id === id)
      if (c) { c.tags = tags; this.persist() }
    },

    // ---- community ------------------------------------------------------
    addPost(body: string, authorId: string): Post {
      const post: Post = {
        id: createId('post'), communityId: this.data.community.id, authorId, body,
        createdAt: new Date().toISOString(), reactions: { like: 0, fire: 0, idea: 0 }, myReactions: [], comments: [],
      }
      this.data.posts.unshift(post)
      this.data.activity.unshift({ id: createId('a'), kind: 'post', message: 'New post in Studio Circle', createdAt: post.createdAt })
      this.persist()
      return post
    },

    toggleReaction(postId: string, kind: ReactionKind) {
      const post = this.data.posts.find(p => p.id === postId)
      if (!post) return
      const on = post.myReactions.includes(kind)
      post.myReactions = on ? post.myReactions.filter(k => k !== kind) : [...post.myReactions, kind]
      post.reactions[kind] += on ? -1 : 1
      this.persist()
    },

    addComment(postId: string, body: string, authorId: string) {
      const post = this.data.posts.find(p => p.id === postId)
      if (!post) return
      const comment: Comment = { id: createId('cm'), postId, authorId, body, createdAt: new Date().toISOString() }
      post.comments.push(comment)
      this.persist()
    },

    togglePin(postId: string) {
      const post = this.data.posts.find(p => p.id === postId)
      if (post) { post.pinned = !post.pinned; this.persist() }
    },

    // ---- marketing / intelligence --------------------------------------
    replaceNewInsights(fresh: Insight[]) {
      const kept = this.data.insights.filter(i => i.status !== 'new')
      this.data.insights = [...fresh, ...kept]
      this.data.activity.unshift({ id: createId('a'), kind: 'insight', message: `Marketing Brain found ${fresh.length} insights`, createdAt: new Date().toISOString() })
      this.persist()
    },

    /** Human approval step: the only way an insight becomes a campaign. */
    approveInsight(id: string, copy: { subject: string; body: string }): Campaign | null {
      const insight = this.data.insights.find(i => i.id === id)
      if (!insight) return null
      insight.status = 'approved'
      let campaign: Campaign | null = null
      if (insight.proposedCampaign) {
        campaign = {
          id: createId('cmp'), workspaceId: this.data.workspace.id, ...insight.proposedCampaign,
          name: copy.subject || insight.proposedCampaign.name,
          status: 'scheduled', startedAt: new Date(Date.now() + 86_400_000).toISOString(),
          sent: 0, opened: 0, clicked: 0, revenue: 0, insightId: insight.id,
        }
        this.data.campaigns.unshift(campaign)
        this.data.activity.unshift({ id: createId('a'), kind: 'campaign', message: `Campaign scheduled after approval: ${campaign.name}`, createdAt: new Date().toISOString() })
      }
      this.persist()
      return campaign
    },

    dismissInsight(id: string) {
      const insight = this.data.insights.find(i => i.id === id)
      if (insight) { insight.status = 'dismissed'; this.persist() }
    },

    addCampaign(campaign: Campaign) {
      this.data.campaigns.unshift(campaign)
      this.persist()
    },

    setCampaignStatus(id: string, status: Campaign['status']) {
      const c = this.data.campaigns.find(x => x.id === id)
      if (c) { c.status = status; this.persist() }
    },

    // ---- settings -------------------------------------------------------
    updateWorkspace(patch: Partial<DemoSnapshot['workspace']>) {
      Object.assign(this.data.workspace, patch)
      this.persist()
    },
  },
})
