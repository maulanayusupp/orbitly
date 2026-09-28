# PRD — Orbitly Creator Business OS

## 1. Product summary
Orbitly is an all-in-one operating system for creators, coaches, educators, communities, and small digital-first businesses. It combines storefront, digital products, memberships, community, customer management, marketing automation, and AI-assisted growth insights.

The product category is informed by current Nas.com capabilities: self-serve business creation, digital/physical products, community, payments, and AI marketing workflows. Current Nas.com documentation describes AI Agents around Analyze, Monitor, and Execute, plus products, community, marketing, and payments. Orbitly is an original product concept and visual identity, not a clone.

## 2. Problem
Creators typically stitch together a storefront, payment provider, course/community platform, CRM, analytics, email/WhatsApp tooling, and social/ads tools. This creates fragmented customer data, duplicated work, and weak visibility into what to do next.

## 3. Target users
### Primary
- Solo creators selling digital products
- Coaches and consultants
- Course / cohort operators
- Paid community owners
- Small creator-led brands

### Secondary
- Small teams managing creator businesses
- Agencies operating multiple creator brands

## 4. Product principles
1. One source of truth for customers and revenue.
2. Creation should be faster than configuration.
3. Every important metric should lead to an action.
4. AI should surface evidence and recommended actions, not become an opaque black box.
5. Every feature must be usable independently but become more valuable when connected.

## 5. MVP scope
### A. Workspace
- Create business workspace
- Brand profile, logo, domain, timezone, currency
- Team members and roles

### B. Products
Product types:
- Digital file
- Course
- Cohort / event
- Membership
- 1:1 service
- Physical product

Core flow:
Draft → configure details → pricing → fulfillment/access → publish → public product page.

### C. Storefront
- Public profile/store
- Product catalog
- Product detail page
- Checkout
- Order confirmation
- Customer access page

### D. Community
- Member feed
- Posts, comments, reactions
- Member directory
- Groups / access tiers
- Events
- Product-to-community access rules

### E. Customers / CRM
- Customer profile
- Orders
- Products owned
- Membership status
- Tags
- Activity timeline
- Segmentation

### F. Marketing
- Campaigns
- Email broadcasts
- WhatsApp messaging integration later
- Social content planner
- Basic campaign analytics

### G. AI / Intelligence
MVP demo concepts:
- Marketing Brain: aggregate internal product/community/revenue signals
- Opportunity feed: detect trends and anomalies
- Social Monitor: external connector later
- Reputation Monitor: external connector later
- Campaign assistant: create copy/creative briefs

Important: AI recommendations must show the evidence/signals used and provide a human approval step for external actions.

### H. Analytics
- Revenue
- Orders
- AOV
- Customers
- Memberships
- Product conversion
- Campaign performance
- Community growth

## 6. Non-MVP / Phase 2
- Payment provider abstraction and payouts
- Tax/invoicing
- Affiliate program
- Advanced automations
- Meta Ads / Google Ads execution
- Social listening
- Reputation monitoring
- AI content generation
- Team permissions
- Mobile app
- Marketplace/discovery
- Physical fulfillment integrations

## 7. Key user journeys
### Journey 1 — Sell a digital product
Create workspace → New product → choose digital file → upload asset → set price → preview → publish → share product URL → customer buys → access granted → order appears in CRM.

### Journey 2 — Grow community
Create community → configure free/paid access → publish welcome post → invite members → members post/comment → owner sees engagement → convert active members into product buyers.

### Journey 3 — AI growth loop
Connect data → Marketing Brain aggregates signals → AI identifies opportunity → owner reviews evidence → owner approves campaign → campaign executes → analytics feed results back into intelligence.

## 8. Information architecture
- Overview
- Products
- Storefront
- Community
- Customers
- Marketing
- Analytics
- Intelligence / AI
- Settings

## 9. Core domain model
### Workspace
id, name, slug, logo, currency, timezone, owner_id

### User
id, name, email, avatar, role

### Product
id, workspace_id, type, title, slug, description, price, currency, status, cover_asset_id

### Order
id, workspace_id, customer_id, total, currency, status, payment_reference, created_at

### OrderItem
id, order_id, product_id, quantity, unit_price

### Customer
id, workspace_id, user_id, email, status, lifetime_value, first_seen_at

### Membership
id, workspace_id, customer_id, tier_id, status, started_at, expires_at

### Community
id, workspace_id, name, description, access_mode

### Post
id, community_id, author_id, body, media_asset_id, created_at

### Campaign
id, workspace_id, channel, name, status, budget, started_at, ended_at

### Insight
id, workspace_id, type, title, evidence, recommendation, confidence, status

## 10. Frontend architecture
Recommended Nuxt structure:
```text
components/
  app/
  ui/
  dashboard/
  products/
  community/
  customers/
  marketing/
composables/
  useAuth.ts
  useWorkspace.ts
  useProducts.ts
  useCustomers.ts
  useAnalytics.ts
  useAIInsights.ts
layouts/
pages/
server/              # phase 2
stores/              # Pinia when state complexity requires it
services/            # API clients / domain adapters
utils/
types/
```

Rules:
- Keep page components orchestration-only.
- Reusable UI components must be presentational and prop-driven.
- Domain fetching belongs in composables/services, not templates.
- Use TypeScript types for all API/domain contracts.
- Avoid duplicated constants and magic values.
- Keep backend adapters behind composables so the UI can use mock data now and API data later.

## 11. Backend architecture — later
Recommended direction:
- API: Laravel 12 or NestJS
- DB: PostgreSQL
- Cache/queues: Redis
- Object storage: S3-compatible
- Search: Meilisearch/OpenSearch depending on scale
- Jobs: queue workers
- Payments: provider abstraction
- Webhooks: idempotent event processing
- Auth: session/OAuth + RBAC
- Observability: structured logs, traces, error monitoring

The frontend should not depend on the eventual backend choice.

## 12. Security / reliability requirements
- RBAC and workspace isolation
- Signed/private asset URLs
- Idempotent payment webhooks
- Audit log for financial/admin actions
- Rate limiting for authentication and public forms
- CSRF protection where applicable
- Input validation server-side
- Secrets never exposed to browser
- AI actions requiring external side effects must be approval-gated in MVP

## 13. Success metrics
MVP:
- Time to publish first product < 10 minutes
- Product publish completion > 70%
- First checkout completion > 40%
- Weekly active business owners
- Revenue per active workspace
- Community member activation rate
- AI insight → action conversion rate

## 14. Demo acceptance criteria
The frontend-only demo is successful if a stakeholder can:
1. Understand the product in under 60 seconds.
2. Navigate Overview, Products, Community, Marketing, Customers.
3. Simulate a product creation.
4. Simulate a new sale.
5. Interact with community posts.
6. Run a simulated AI analysis.
7. See responsive behavior on tablet/mobile.

## 15. Important product risks
- Trying to ship every Nas-like feature at once creates a platform rather than a focused MVP.
- Payment, tax, messaging, and ad execution have significantly higher operational/security complexity than the demo UI suggests.
- AI insights without reliable evidence can reduce user trust.
- Community products need moderation, abuse handling, notifications, and retention mechanics early in design.

## 15. AI-first landing experience — updated demo requirement
The public home page is not only a marketing page. It is an interactive product demonstration that communicates the core value proposition immediately: **one product image can become a structured, publish-ready product listing with AI assistance.**

### 15.1 Primary landing CTA
Primary CTA: **Upload a product**.
Secondary CTA: **Try the demo** using a preloaded sample image.

The user should not need to create an account to experience the demo.

### 15.2 Demo flow
```text
Landing page
   ↓
Upload / drag-and-drop one product image
   ↓
AI analysis simulation
   ├─ Vision analysis
   ├─ Product classification
   ├─ Title generation
   ├─ Description generation
   ├─ Category detection
   ├─ Pricing suggestion
   ├─ SKU generation
   ├─ Tags generation
   └─ SEO metadata generation
   ↓
Product form is automatically populated
   ↓
User can edit any field
   ↓
AI confidence + Ready to publish
   ↓
Preview product
   ↓
Dashboard / Products workspace
```

### 15.3 Fields generated by AI
Minimum demo fields:
- Product title
- Product description
- Category
- Suggested price
- SKU
- Tags
- SEO title
- SEO meta description

The UI must make it visually obvious which fields were generated by AI, while still allowing human editing.

### 15.4 Simulation behavior
Because the first demo has no backend or external AI provider, generation is simulated locally.

The simulation should:
1. Accept a real local image through file input or drag-and-drop.
2. Show the image immediately.
3. Show an AI processing state with progress.
4. Animate through analysis stages.
5. Populate fields after the simulated analysis completes.
6. Display an AI confidence value.
7. Enable a product preview action.

The sample flow must work without network access after the application assets are available.

### 15.5 Real AI architecture — future
When backend/AI is implemented, the frontend contract should remain approximately:

```ts
interface ProductGenerationRequest {
  imageAssetId: string
  workspaceId: string
  locale?: string
  currency?: string
}

interface ProductGenerationResult {
  title: string
  description: string
  category: string
  suggestedPrice?: number
  sku?: string
  tags: string[]
  seoTitle?: string
  seoDescription?: string
  confidence: number
  evidence?: Array<{
    field: string
    reason: string
  }>
}
```

The eventual AI pipeline should separate:
- image ingestion/storage
- vision analysis
- structured extraction
- copy generation
- validation/normalization
- confidence scoring
- human review
- publish action

No AI-generated content should automatically create an irreversible external side effect without explicit user approval.

## 16. Updated MVP information architecture
Public:
- `/` — AI-first landing + interactive product generation demo

Application:
- `/dashboard` — business overview
- `/products` — product management
- `/community` — community management
- `/customers` — CRM
- `/marketing` — marketing / AI agents

The root `/` route must communicate the product value before asking the user to understand the dashboard.

## 17. Updated demo acceptance criteria
### Landing
- Visitor understands the core value proposition within 5 seconds.
- Primary CTA is upload/product creation, not dashboard navigation.
- A sample image can run through the complete flow without an account.
- Real local image upload works.
- Drag-and-drop works.

### AI generation
- Generation has visible processing states.
- At least 8 product fields are populated automatically.
- Fields remain editable after generation.
- AI confidence is displayed.
- User can reset and run the demo again.

### Product handoff
- Generated product can be previewed.
- User can navigate into the dashboard after generation.
- The demo communicates that the generated product becomes part of the wider Orbitly business workspace.
