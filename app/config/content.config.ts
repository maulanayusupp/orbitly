// Server-rendered, indexable content pages (features, tool landing, use cases,
// guides). Plain data with NO alias imports, because nuxt.config imports this
// file to list the routes in the sitemap.
//
// Content rules: practical and specific, no invented statistics, testimonials,
// rankings or claims about other products.

export type ContentBlock =
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'tip'; title: string; text: string }
  | { type: 'example'; label: string; before?: string; after: string }
  | { type: 'cta'; text: string; to?: string }

export interface ContentFaq {
  q: string
  a: string
}

export interface ContentPage {
  path: string
  kind: 'page' | 'guide'
  /** <title> — keep ≤ 60 chars. */
  title: string
  /** Meta description — keep ≤ 155 chars. */
  description: string
  eyebrow: string
  h1: string
  lead: string
  published: string
  updated: string
  blocks: ContentBlock[]
  faq?: ContentFaq[]
  related: string[]
}

export const CONTENT_UPDATED = '2026-09-28'

const pages: ContentPage[] = [
  // ---------------------------------------------------------------------------
  {
    path: '/ai-product-description-generator',
    kind: 'page',
    title: 'AI Product Description Generator from a Photo | Orbitly',
    description: 'Generate a product title, description, category, price, SKU, tags and SEO meta from one product photo. Free demo, no sign-up, every field editable.',
    eyebrow: 'Free tool',
    h1: 'AI product description generator — from one photo',
    lead: 'Upload a product photo and get the whole listing drafted: not just the description, but the title, category, suggested price, SKU, tags and search snippet too. You stay in control of every word.',
    published: CONTENT_UPDATED,
    updated: CONTENT_UPDATED,
    blocks: [
      { type: 'cta', text: 'Try it with your own photo' },
      { type: 'h2', id: 'what-you-get', text: 'What you get from one photo' },
      { type: 'p', text: 'Most description generators ask you to type the product details first. Orbitly starts from the image, because that is usually the one thing every seller already has. From a single upload it drafts eight fields that a storefront needs before a product can go live:' },
      { type: 'ul', items: [
        'Product title — clear, specific and searchable, built from what the product is and what it looks like.',
        'Description — a short benefit-led paragraph plus scannable bullet points.',
        'Category — a catalog path such as “Home & Kitchen › Drinkware”.',
        'Suggested price — a starting point inside a typical range for the product type.',
        'SKU — a structured stock-keeping code you can use in inventory.',
        'Tags — discovery keywords for search and filtering.',
        'SEO title — clipped to about 60 characters so search results do not truncate it.',
        'SEO meta description — clipped to about 155 characters for the search snippet.',
      ] },
      { type: 'h2', id: 'how-it-works', text: 'How it works' },
      { type: 'ol', items: [
        'Drop a photo (PNG, JPG, WebP or SVG) or pick one of the sample images.',
        'The image is analysed in visible stages: vision, classification, title, description, category, price, SKU, tags and SEO.',
        'Fields fill in as each stage finishes. Every AI-written field is marked, so you always know what came from the generator.',
        'Edit anything. Changed fields are labelled “Edited” and can be restored to the AI version with one click.',
        'Preview the product page, then add it to your workspace as a draft and publish when you are happy.',
      ] },
      { type: 'h2', id: 'evidence', text: 'Every suggestion shows its evidence' },
      { type: 'p', text: 'Next to each generated field there is a “Why?” link. It names the signal the suggestion came from — for example the dominant colour detected in the photo and how much of the product it covers, or the product template the image matched. When the match is weak, the confidence score drops below the ready threshold and the listing is flagged for review instead of being presented as finished.' },
      { type: 'tip', title: 'About this demo', text: 'The public demo runs entirely in your browser. It reads real pixel data from your image (colour, brightness, size) and matches the file name against product templates to assemble the copy. Your photo is never uploaded.' },
      { type: 'h2', id: 'example', text: 'Example output' },
      { type: 'example', label: 'From the “Ceramic mug” sample', after: 'Title: Sage Stoneware Pour-Over Mug\nCategory: Home & Kitchen › Drinkware\nPrice: $33.00 · SKU: HK-MUG-SAG-8P07\nTags: sage, ceramic mug, coffee lover, handmade, kitchen, gift idea\nSEO title: Sage Stoneware Pour-Over Mug | Drinkware' },
      { type: 'h2', id: 'after', text: 'After the listing: sell it from the same place' },
      { type: 'p', text: 'The generated product lands in an Orbitly workspace next to your storefront and checkout, your community, your customer records and your marketing. The order that comes in from the product page shows up in the customer profile and in revenue analytics without any exporting or copying between tools.' },
    ],
    faq: [
      { q: 'Is the AI product description generator free?', a: 'Yes. The demo on this site is free and does not need an account.' },
      { q: 'Can I edit the generated description?', a: 'Every field is editable. Edited fields are labelled, and you can restore the AI version at any time.' },
      { q: 'Does it work for digital products?', a: 'Yes. The listing can be set to digital file, course, cohort, membership, 1:1 service or physical product before you add it to the workspace.' },
      { q: 'Is my product photo stored?', a: 'Not in the demo. The image is processed on a canvas in your browser and never sent to a server.' },
    ],
    related: ['/guides/how-to-write-product-descriptions', '/guides/product-listing-seo-checklist', '/features'],
  },

  // ---------------------------------------------------------------------------
  {
    path: '/features',
    kind: 'page',
    title: 'Features — Store, Community, CRM & AI Marketing | Orbitly',
    description: 'One workspace for creators: AI product listings, storefront and checkout, community, customer CRM, evidence-backed AI marketing and analytics.',
    eyebrow: 'Features',
    h1: 'Everything a creator business runs on, in one workspace',
    lead: 'Orbitly connects the tools creators usually stitch together — a store, a community, a CRM, email and analytics — so customer data lives in one place and every metric points to a next step.',
    published: CONTENT_UPDATED,
    updated: CONTENT_UPDATED,
    blocks: [
      { type: 'h2', id: 'ai-listings', text: 'AI product listings from a photo' },
      { type: 'p', text: 'Upload one product image and get a publish-ready draft: title, description, category, suggested price, SKU, tags and SEO metadata. Each AI field is marked, explained with a “Why?” note and fully editable, with a confidence score that asks for review when the signal is weak.' },
      { type: 'h2', id: 'products', text: 'Six product types, one catalog' },
      { type: 'ul', items: [
        'Digital files — templates, presets, e-books and packs with instant download.',
        'Courses — self-paced lessons with course access after checkout.',
        'Cohorts and events — live sessions with a start date and replays.',
        'Memberships — recurring access tied to community tiers.',
        '1:1 services — coaching calls, audits and reviews with a booking link.',
        'Physical products — goods you ship, with address and tracking.',
      ] },
      { type: 'p', text: 'Every product follows the same flow: draft, details, pricing, fulfilment and access, then publish. Publishing is blocked until the essentials — a title, a real description and a price — are in place.' },
      { type: 'h2', id: 'storefront', text: 'Storefront and checkout' },
      { type: 'p', text: 'Published products appear in a public store with their own product pages. Checkout creates the order, grants access and adds or updates the customer record in one step. Each checkout carries an idempotency key, so a double click never creates a duplicate order.' },
      { type: 'h2', id: 'community', text: 'Community' },
      { type: 'p', text: 'A member feed with posts, comments, reactions and pinned announcements, a member directory, upcoming events and access tiers that can be unlocked by buying a product. Active members are one click away from their customer profile.' },
      { type: 'h2', id: 'crm', text: 'Customers and CRM' },
      { type: 'p', text: 'One profile per buyer with orders, products owned, membership status, tags and an activity timeline. Segments such as VIP, members, course buyers, leads and churned customers are built from that data and feed straight into campaigns.' },
      { type: 'h2', id: 'marketing', text: 'Marketing Brain — AI with a human in the loop' },
      { type: 'p', text: 'Marketing Brain reads your own orders, products, community activity, customers and past campaigns, and surfaces trends, anomalies, opportunities and risks. Each insight lists the exact signals behind it and a confidence score. When it proposes a campaign, the campaign assistant drafts the message — but nothing is scheduled until you review the audience and copy and explicitly approve.' },
      { type: 'h2', id: 'analytics', text: 'Analytics that lead to actions' },
      { type: 'p', text: 'Revenue, orders, average order value, paying customers, active members, product conversion, campaign open and click rates and community growth — all computed from the same workspace data, with period-over-period changes.' },
      { type: 'cta', text: 'Try the AI listing demo' },
    ],
    related: ['/ai-product-description-generator', '/use-cases', '/guides'],
  },

  // ---------------------------------------------------------------------------
  {
    path: '/use-cases',
    kind: 'page',
    title: 'Use Cases for Creators, Coaches & Small Brands | Orbitly',
    description: 'How solo creators, coaches, course and cohort operators, paid communities and small creator-led brands can run their business from one Orbitly workspace.',
    eyebrow: 'Use cases',
    h1: 'Built for people who sell what they make and teach',
    lead: 'Orbitly is designed for digital-first businesses where the products, the community and the customer relationship all belong together.',
    published: CONTENT_UPDATED,
    updated: CONTENT_UPDATED,
    blocks: [
      { type: 'h2', id: 'solo-creators', text: 'Solo creators selling digital products' },
      { type: 'p', text: 'Templates, presets, e-books and resource packs. Generate the listing from a cover image, publish it to your store and let checkout deliver the download. Buyers become customer profiles you can segment later — for example everyone who bought a template pack but not the matching course.' },
      { type: 'h2', id: 'coaches', text: 'Coaches and consultants' },
      { type: 'p', text: 'Sell 1:1 sessions and audits next to lower-priced digital products. Community questions show you what people struggle with; Marketing Brain can turn a cluster of questions into a proposal for a limited run of coaching slots, which you approve before anything goes out.' },
      { type: 'h2', id: 'course-operators', text: 'Course and cohort operators' },
      { type: 'p', text: 'Run self-paced courses and live cohorts from the same catalog. Graduates are tagged automatically, so inviting them to the next cohort — or giving them early access — is a segment away rather than a spreadsheet export.' },
      { type: 'h2', id: 'communities', text: 'Paid community owners' },
      { type: 'p', text: 'Offer free and paid tiers, or unlock the community by purchase. Track member growth and interactions per post, pin announcements and host events, while memberships and renewals sit in the same customer record as every other purchase.' },
      { type: 'h2', id: 'small-brands', text: 'Small creator-led brands' },
      { type: 'p', text: 'Physical products benefit most from photo-first listings: shoot the product, generate the draft, correct the details only you know — size, materials, care — and publish. The storefront, orders and customers stay connected to your content and community.' },
      { type: 'cta', text: 'See the demo workspace', to: '/dashboard' },
    ],
    related: ['/features', '/ai-product-description-generator', '/guides/how-to-price-digital-products'],
  },

  // ---------------------------------------------------------------------------
  {
    path: '/guides/how-to-write-product-descriptions',
    kind: 'guide',
    title: 'How to Write Product Descriptions That Sell (With Examples)',
    description: 'A practical framework for product descriptions: lead with the outcome, back it with specifics, stay scannable and answer objections. Examples included.',
    eyebrow: 'Guide · Copywriting',
    h1: 'How to write product descriptions that sell',
    lead: 'A good product description answers the three questions every buyer has — what is it, why would I want it, and can I trust it — in the order they ask them. Here is a repeatable way to write one.',
    published: CONTENT_UPDATED,
    updated: CONTENT_UPDATED,
    blocks: [
      { type: 'h2', id: 'start-with-the-buyer', text: '1. Start with who it is for and what changes for them' },
      { type: 'p', text: 'Features describe the product; benefits describe the buyer’s life after owning it. Open with the outcome in the buyer’s words, then use features as proof. “Holds heat through a slow breakfast” is more persuasive than “thick 6 mm walls” — but the 6 mm is what makes the claim believable, so keep both.' },
      { type: 'tip', title: 'Quick test', text: 'Read your first sentence and ask “so what?”. If the answer is not obvious, the sentence is a feature, not a benefit.' },
      { type: 'h2', id: 'be-specific', text: '2. Replace adjectives with specifics' },
      { type: 'p', text: 'Words like “premium”, “high quality” and “amazing” are invisible because every listing uses them. Specific facts do the persuading instead: dimensions, materials, capacity, what is included, how long it lasts, how it is delivered.' },
      { type: 'example', label: 'Before → after', before: 'A premium, high-quality mug perfect for coffee lovers.', after: 'A wheel-thrown stoneware mug that holds 350 ml, keeps coffee warm through a slow breakfast and is safe in the dishwasher and microwave.' },
      { type: 'h2', id: 'structure', text: '3. Use a scannable structure' },
      { type: 'p', text: 'Most shoppers scan before they read. A structure that works for almost any product:' },
      { type: 'ol', items: [
        'One or two sentences with the main benefit and who it is for.',
        'Three to five bullet points with concrete specifics — size, material, what is included, compatibility.',
        'A short line on delivery or access: when and how the buyer gets it.',
        'Care, usage or support details for anyone who is still deciding.',
      ] },
      { type: 'h2', id: 'digital-products', text: '4. For digital products, describe the result and the format' },
      { type: 'p', text: 'Digital buyers cannot hold the product, so remove uncertainty about what they are paying for: the format (PDF, Notion template, video), the size (number of pages, lessons or minutes), the skill level it assumes and what they will be able to do afterwards.' },
      { type: 'example', label: 'Digital example', after: '40 tested cone-6 glaze recipes with photos and test-tile notes. Instant PDF download plus a mixing calculator. Written for potters who already fire their own work and want reliable results without months of testing.' },
      { type: 'h2', id: 'objections', text: '5. Answer objections before they are raised' },
      { type: 'p', text: 'Think about why someone would hesitate — Will it fit? Is it right for beginners? What if I do not like it? — and answer the most common one directly in the description. One honest sentence about who a product is not for often increases trust more than another benefit.' },
      { type: 'h2', id: 'searchable', text: '6. Make it searchable without stuffing keywords' },
      { type: 'p', text: 'Use the words buyers actually search for — usually the plain product name plus one or two qualifiers like material, colour or use. Put the most important phrase in the title and naturally once in the first sentence. Repeating it more often does not help readers or search engines.' },
      { type: 'h2', id: 'checklist', text: 'Checklist before you publish' },
      { type: 'ul', items: [
        'The first sentence states the main benefit and the buyer.',
        'Every adjective has been replaced or backed by a specific fact.',
        'Key details are in bullets that can be scanned in seconds.',
        'Delivery or access is explained.',
        'The most likely objection is answered.',
        'The main search phrase appears in the title and early in the copy.',
      ] },
      { type: 'cta', text: 'Draft a description from a photo' },
    ],
    related: ['/guides/product-listing-seo-checklist', '/ai-product-description-generator', '/guides/how-to-price-digital-products'],
  },

  // ---------------------------------------------------------------------------
  {
    path: '/guides/product-listing-seo-checklist',
    kind: 'guide',
    title: 'Product Page SEO Checklist: 12 Steps for Every Listing',
    description: 'A 12-step product page SEO checklist: titles, meta descriptions, URLs, images, alt text, structured data, internal links and page speed.',
    eyebrow: 'Guide · SEO',
    h1: 'Product page SEO checklist: 12 steps for every listing',
    lead: 'Search engines can only rank a product page they can crawl, understand and trust. This checklist covers what to set on every listing, in the order it matters.',
    published: CONTENT_UPDATED,
    updated: CONTENT_UPDATED,
    blocks: [
      { type: 'h2', id: 'titles', text: 'Titles and snippets' },
      { type: 'ol', items: [
        'Write a unique product title that names the product plainly, plus one or two qualifiers (material, colour, size or use).',
        'Keep the SEO title around 50–60 characters so it is not cut off in results, with the product name first and the brand or category after.',
        'Write a meta description of about 140–155 characters that states the main benefit and one concrete detail. It does not directly change rankings, but it strongly affects whether people click.',
      ] },
      { type: 'h2', id: 'urls', text: 'URLs and structure' },
      { type: 'ol', items: [
        'Use a short, readable URL slug made of lowercase words and hyphens — for example /sage-stoneware-mug rather than /product?id=48213.',
        'Place the product in one clear category and link to it from that category page, so crawlers can reach it within a few clicks from the home page.',
        'Set a canonical URL when the same product is reachable through several paths or filters, so ranking signals are not split.',
      ] },
      { type: 'h2', id: 'content', text: 'Content' },
      { type: 'ol', items: [
        'Write an original description. Copying a manufacturer’s text gives search engines no reason to prefer your page over every other store using it.',
        'Answer the questions buyers ask — size, materials, compatibility, delivery — in the page copy or a short FAQ.',
      ] },
      { type: 'h2', id: 'images', text: 'Images' },
      { type: 'ol', items: [
        'Use descriptive file names (sage-stoneware-mug.jpg, not IMG_4821.jpg) and alt text that describes what is in the image.',
        'Compress images and serve modern formats such as WebP or AVIF; large images are a common cause of slow product pages.',
      ] },
      { type: 'h2', id: 'technical', text: 'Technical signals' },
      { type: 'ol', items: [
        'Add Product structured data (name, image, description, SKU, price, currency and availability) so search engines can show price and stock in results. Only mark up information that is visible on the page.',
        'Check that the page is indexable: no accidental noindex, it is included in your XML sitemap and it returns a 200 status code.',
      ] },
      { type: 'tip', title: 'Social previews count too', text: 'Set Open Graph and Twitter card tags with a raster image (PNG or JPG, ideally 1200×630). Messaging apps and social networks ignore SVG previews, and a good preview increases clicks when the link is shared.' },
      { type: 'h2', id: 'after-publishing', text: 'After publishing' },
      { type: 'p', text: 'Submit your sitemap in Google Search Console and Bing Webmaster Tools, then use the page indexing and performance reports to see which listings are indexed and which search terms bring impressions. Rewrite titles for pages that get impressions but few clicks.' },
      { type: 'cta', text: 'Generate SEO titles and meta descriptions from a photo' },
    ],
    related: ['/guides/how-to-write-product-descriptions', '/ai-product-description-generator', '/features'],
  },

  // ---------------------------------------------------------------------------
  {
    path: '/guides/how-to-price-digital-products',
    kind: 'guide',
    title: 'How to Price Digital Products: A Practical Framework',
    description: 'Price templates, courses, memberships and services with confidence: value-based pricing, reference points, tiers, launch pricing and when to raise prices.',
    eyebrow: 'Guide · Pricing',
    h1: 'How to price digital products',
    lead: 'There is no formula that produces the right price, but there is a reliable process: anchor on the value to the buyer, check it against reference points, then test and adjust.',
    published: CONTENT_UPDATED,
    updated: CONTENT_UPDATED,
    blocks: [
      { type: 'h2', id: 'value', text: 'Start from the value, not the effort' },
      { type: 'p', text: 'Buyers do not pay for the hours you spent making a template or recording a course; they pay for the time it saves them, the mistakes it helps them avoid or the result it helps them reach. Write that outcome down in one sentence and estimate what it is worth to the buyer. Your price should be a small fraction of that value.' },
      { type: 'h2', id: 'reference', text: 'Check reference points' },
      { type: 'ul', items: [
        'What do comparable products in your niche cost, and how does yours differ in depth, format or support?',
        'What is the buyer’s alternative — doing it themselves, hiring someone, or a free resource? Your price sits between free and hiring help.',
        'What have your own customers already paid you for? Your existing prices are the strongest reference your audience has.',
      ] },
      { type: 'h2', id: 'by-type', text: 'Typical approaches by product type' },
      { type: 'h3', text: 'Templates, presets and files' },
      { type: 'p', text: 'Usually the entry point of a catalog. Price low enough to be an easy first purchase, and bundle related files at a discount to lift the average order value.' },
      { type: 'h3', text: 'Courses' },
      { type: 'p', text: 'Priced on the transformation. Be concrete about scope (number of lessons, hours, level) so the price feels proportionate.' },
      { type: 'h3', text: 'Cohorts and live events' },
      { type: 'p', text: 'Live access, accountability and limited seats justify a premium over a self-paced course on the same topic.' },
      { type: 'h3', text: 'Memberships' },
      { type: 'p', text: 'Priced so the monthly amount feels small next to what members get each month. Offer an annual option with a discount to reduce churn.' },
      { type: 'h3', text: '1:1 services' },
      { type: 'p', text: 'The most expensive item per hour because it is limited by your time. Fixed-scope packages are easier to buy than open-ended hourly rates.' },
      { type: 'h2', id: 'tiers', text: 'Use tiers to let buyers choose' },
      { type: 'p', text: 'Two or three tiers — for example the product alone, the product plus a community, and the product plus a live session — let different buyers pay for the level of help they want. The middle tier is often the most chosen, so make it the one you most want to sell.' },
      { type: 'h2', id: 'launch', text: 'Launch, measure, adjust' },
      { type: 'ol', items: [
        'Launch with an honest early price for existing followers or members, with a clear end date.',
        'Watch conversion: page views to purchases. A very high conversion rate is often a sign the price is too low.',
        'Raise prices when you add value (new lessons, updates, support) and tell existing customers first.',
      ] },
      { type: 'tip', title: 'Treat suggested prices as a starting point', text: 'Orbitly suggests a price inside a typical band for the product type. Adjust it with what you know about your audience, costs and positioning before publishing.' },
      { type: 'cta', text: 'Create a listing with a suggested price' },
    ],
    related: ['/guides/how-to-write-product-descriptions', '/use-cases', '/features'],
  },
]

export const CONTENT_PAGES = pages
export const GUIDES = pages.filter(p => p.kind === 'guide')

export function contentByPath(path: string): ContentPage | undefined {
  const clean = path.replace(/\/$/, '') || '/'
  return pages.find(p => p.path === clean)
}

/** Every indexable content URL, including the guides index (for the sitemap). */
export const CONTENT_ROUTES = ['/guides', ...pages.map(p => p.path)]
