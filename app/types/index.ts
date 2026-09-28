// Domain contracts (PRD §9) plus demo-specific view types. The UI depends on
// these types only — never on the shape of mock data or a future API payload.

export type CurrencyCode = 'USD' | 'IDR' | 'SGD'
export type ISODate = string

export interface Workspace {
  id: string
  name: string
  slug: string
  logo?: string
  currency: CurrencyCode
  timezone: string
  ownerId: string
}

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
}

export type ProductType =
  | 'digital'
  | 'course'
  | 'cohort'
  | 'membership'
  | 'service'
  | 'physical'

export type ProductStatus = 'draft' | 'published' | 'archived'

export interface Product {
  id: string
  workspaceId: string
  type: ProductType
  title: string
  slug: string
  description: string
  price: number
  currency: CurrencyCode
  status: ProductStatus
  coverUrl?: string
  category?: string
  sku?: string
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  /** Set when the listing came out of the AI generator. */
  aiGenerated?: boolean
  sales: number
  views: number
  createdAt: ISODate
}

export type OrderStatus = 'paid' | 'pending' | 'refunded'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  workspaceId: string
  customerId: string
  total: number
  currency: CurrencyCode
  status: OrderStatus
  paymentReference: string
  items: OrderItem[]
  createdAt: ISODate
}

export type CustomerStatus = 'active' | 'lead' | 'churned'

export interface Customer {
  id: string
  workspaceId: string
  userId?: string
  name: string
  email: string
  status: CustomerStatus
  lifetimeValue: number
  firstSeenAt: ISODate
  tags: string[]
  city?: string
}

export type MembershipStatus = 'active' | 'trialing' | 'cancelled'

export interface Membership {
  id: string
  workspaceId: string
  customerId: string
  tierId: string
  status: MembershipStatus
  startedAt: ISODate
  expiresAt?: ISODate
}

export type AccessMode = 'free' | 'paid' | 'product'

export interface Community {
  id: string
  workspaceId: string
  name: string
  description: string
  accessMode: AccessMode
  memberCount: number
}

export type ReactionKind = 'like' | 'fire' | 'idea'

export interface Comment {
  id: string
  postId: string
  authorId: string
  body: string
  createdAt: ISODate
}

export interface Post {
  id: string
  communityId: string
  authorId: string
  body: string
  mediaUrl?: string
  createdAt: ISODate
  reactions: Record<ReactionKind, number>
  /** Reactions the current viewer has toggled on. */
  myReactions: ReactionKind[]
  comments: Comment[]
  pinned?: boolean
}

export interface Member {
  id: string
  name: string
  role: 'owner' | 'moderator' | 'member'
  tier: string
  joinedAt: ISODate
  posts: number
}

export interface CommunityEvent {
  id: string
  title: string
  startsAt: ISODate
  attendees: number
  format: 'live' | 'workshop' | 'ama'
}

export type CampaignChannel = 'email' | 'social' | 'whatsapp'
export type CampaignStatus = 'draft' | 'awaiting_approval' | 'scheduled' | 'running' | 'completed'

export interface Campaign {
  id: string
  workspaceId: string
  channel: CampaignChannel
  name: string
  status: CampaignStatus
  budget: number
  startedAt?: ISODate
  endedAt?: ISODate
  audience: string
  sent: number
  opened: number
  clicked: number
  revenue: number
  /** Insight that produced this campaign, if any. */
  insightId?: string
}

export type InsightType = 'opportunity' | 'anomaly' | 'trend' | 'risk'
export type InsightStatus = 'new' | 'approved' | 'dismissed'

export interface InsightEvidence {
  signal: string
  value: string
  source: 'orders' | 'community' | 'products' | 'campaigns' | 'customers'
}

export interface Insight {
  id: string
  workspaceId: string
  type: InsightType
  title: string
  evidence: InsightEvidence[]
  recommendation: string
  /** 0–1 */
  confidence: number
  status: InsightStatus
  /** Draft campaign the owner can approve (human-in-the-loop). */
  proposedCampaign?: Pick<Campaign, 'channel' | 'name' | 'audience' | 'budget'>
  /** Customer-facing message the campaign assistant drafts for that campaign. */
  message?: string
}

export interface ActivityEvent {
  id: string
  kind: 'order' | 'signup' | 'post' | 'product' | 'campaign' | 'insight'
  customerId?: string
  message: string
  createdAt: ISODate
}

// ---------- AI product generation (PRD §15.5 — the future API contract) -----

export interface ProductGenerationRequest {
  imageAssetId: string
  workspaceId: string
  locale?: string
  currency?: string
}

export interface ProductGenerationEvidence {
  field: string
  reason: string
}

export interface ProductGenerationResult {
  title: string
  description: string
  category: string
  suggestedPrice?: number
  sku?: string
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  confidence: number
  evidence?: ProductGenerationEvidence[]
}

export type GenerationStageId =
  | 'vision'
  | 'classify'
  | 'title'
  | 'description'
  | 'category'
  | 'price'
  | 'sku'
  | 'tags'
  | 'seo'

export type GenerationPhase = 'idle' | 'uploaded' | 'analyzing' | 'ready' | 'error'

/** Editable form that the generator fills and the human reviews. */
export interface ProductDraft {
  title: string
  description: string
  category: string
  price: number | null
  sku: string
  tags: string[]
  seoTitle: string
  seoDescription: string
  type: ProductType
}

export type DraftField = keyof Omit<ProductDraft, 'type'>

// ---------- Analytics view types ------------------------------------------

export interface KpiMetric {
  id: string
  label: string
  value: number
  format: 'currency' | 'number' | 'percent'
  /** Change vs previous period, as a fraction (0.12 = +12%). */
  delta: number
}

export interface SeriesPoint {
  label: string
  value: number
}

// ---------- Demo snapshot (everything the mock adapter owns) ---------------

export interface DemoSnapshot {
  workspace: Workspace
  team: User[]
  products: Product[]
  orders: Order[]
  customers: Customer[]
  memberships: Membership[]
  community: Community
  posts: Post[]
  members: Member[]
  events: CommunityEvent[]
  campaigns: Campaign[]
  insights: Insight[]
  activity: ActivityEvent[]
}
