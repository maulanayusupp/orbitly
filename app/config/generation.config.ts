// Configuration for the LOCAL product-generation simulation (PRD §15.4).
// Nothing here calls a network service: analysis reads pixels on a canvas and
// matches the file name against the templates below.
import type { DraftField, GenerationStageId, ProductType } from '~/types'

export interface GenerationStage {
  id: GenerationStageId
  label: string
  detail: string
  durationMs: number
  /** Draft fields this stage fills when it completes. */
  fills: DraftField[]
}

export const GENERATION_STAGES: GenerationStage[] = [
  { id: 'vision', label: 'Vision analysis', detail: 'Reading colour, shape and composition', durationMs: 900, fills: [] },
  { id: 'classify', label: 'Product classification', detail: 'Matching against product templates', durationMs: 650, fills: [] },
  { id: 'title', label: 'Title generation', detail: 'Writing a clear, searchable name', durationMs: 600, fills: ['title'] },
  { id: 'description', label: 'Description generation', detail: 'Drafting benefit-led copy', durationMs: 900, fills: ['description'] },
  { id: 'category', label: 'Category detection', detail: 'Placing it in your catalog', durationMs: 450, fills: ['category'] },
  { id: 'price', label: 'Pricing suggestion', detail: 'Comparing similar listings', durationMs: 600, fills: ['price'] },
  { id: 'sku', label: 'SKU generation', detail: 'Building a stock-keeping code', durationMs: 350, fills: ['sku'] },
  { id: 'tags', label: 'Tags generation', detail: 'Choosing discovery keywords', durationMs: 450, fills: ['tags'] },
  { id: 'seo', label: 'SEO metadata', detail: 'Title and meta description', durationMs: 600, fills: ['seoTitle', 'seoDescription'] },
]

export const DRAFT_FIELD_LABELS: Record<DraftField, string> = {
  title: 'Product title',
  description: 'Description',
  category: 'Category',
  price: 'Suggested price',
  sku: 'SKU',
  tags: 'Tags',
  seoTitle: 'SEO title',
  seoDescription: 'SEO meta description',
}

export const SEO_LIMITS = { title: 60, description: 155 } as const
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
export const MAX_IMAGE_BYTES = 12 * 1024 * 1024

/** Confidence at or above which the listing is labelled "Ready to publish". */
export const READY_CONFIDENCE = 0.8

export interface SampleImage {
  id: string
  label: string
  src: string
  fileName: string
}

export const SAMPLE_IMAGES: SampleImage[] = [
  { id: 'mug', label: 'Ceramic mug', src: '/samples/stoneware-mug.svg', fileName: 'stoneware-mug.svg' },
  { id: 'tote', label: 'Canvas tote', src: '/samples/canvas-tote-bag.svg', fileName: 'canvas-tote-bag.svg' },
  { id: 'planner', label: 'Planner', src: '/samples/linen-planner-notebook.svg', fileName: 'linen-planner-notebook.svg' },
]

export interface ProductTemplate {
  id: string
  keywords: string[]
  noun: string
  material: string
  category: string
  type: ProductType
  /** USD price band; the suggestion lands inside it. */
  priceBand: [number, number]
  skuPrefix: string
  tags: string[]
  /** `{color}` and `{material}` are interpolated. */
  description: string
  benefits: string[]
}

export const PRODUCT_TEMPLATES: ProductTemplate[] = [
  {
    id: 'mug', keywords: ['mug', 'cup', 'coffee', 'tea', 'ceramic', 'stoneware'],
    noun: 'Pour-Over Mug', material: 'Stoneware', category: 'Home & Kitchen › Drinkware', type: 'physical',
    priceBand: [24, 38], skuPrefix: 'HK-MUG', tags: ['ceramic mug', 'coffee lover', 'handmade', 'kitchen', 'gift idea'],
    description: 'A {color} {material} mug thrown for slow mornings. The wide, thick-walled body holds heat, the glaze is food-safe and the handle is sized for a full grip.',
    benefits: ['Holds 350 ml', 'Dishwasher and microwave safe', 'Each glaze pull is unique'],
  },
  {
    id: 'tote', keywords: ['tote', 'bag', 'canvas', 'shopper', 'pouch'],
    noun: 'Everyday Tote Bag', material: 'Heavy Canvas', category: 'Accessories › Bags', type: 'physical',
    priceBand: [22, 34], skuPrefix: 'AC-TOT', tags: ['tote bag', 'canvas bag', 'everyday carry', 'sustainable', 'market bag'],
    description: 'A {color} {material} tote built for laptops, groceries and everything between. Reinforced straps, an inner pocket and a flat base that stands on its own.',
    benefits: ['Fits a 15" laptop', '12 oz organic cotton canvas', 'Inner zip pocket'],
  },
  {
    id: 'planner', keywords: ['planner', 'notebook', 'journal', 'diary', 'agenda', 'linen'],
    noun: 'Weekly Planner', material: 'Linen-Bound', category: 'Stationery › Planners', type: 'physical',
    priceBand: [18, 29], skuPrefix: 'ST-PLN', tags: ['planner', 'notebook', 'productivity', 'stationery', 'journal'],
    description: 'A {color} {material} planner with undated weekly spreads, so it starts whenever you do. Lay-flat binding, 100 gsm paper and a ribbon marker.',
    benefits: ['Undated, 52 weeks', 'Lay-flat binding', 'Fountain-pen friendly paper'],
  },
  {
    id: 'apparel', keywords: ['shirt', 'tee', 't-shirt', 'hoodie', 'sweater', 'jacket', 'dress', 'cap', 'hat'],
    noun: 'Relaxed Tee', material: 'Organic Cotton', category: 'Apparel › Tops', type: 'physical',
    priceBand: [26, 44], skuPrefix: 'AP-TEE', tags: ['t-shirt', 'organic cotton', 'streetwear', 'unisex', 'merch'],
    description: 'A {color} {material} tee with a relaxed drop shoulder and a heavyweight hand-feel that softens with every wash.',
    benefits: ['220 gsm organic cotton', 'Pre-shrunk', 'Unisex sizing XS–XXL'],
  },
  {
    id: 'footwear', keywords: ['shoe', 'sneaker', 'boot', 'sandal', 'trainer'],
    noun: 'Low-Top Sneaker', material: 'Suede', category: 'Apparel › Footwear', type: 'physical',
    priceBand: [68, 120], skuPrefix: 'AP-SNK', tags: ['sneakers', 'footwear', 'everyday shoes', 'suede', 'streetwear'],
    description: 'A {color} {material} low-top with a cushioned footbed and a grippy vulcanised sole, made to be worn every day.',
    benefits: ['Cushioned insole', 'Vulcanised rubber sole', 'Half sizes available'],
  },
  {
    id: 'candle', keywords: ['candle', 'soy', 'wax', 'scent', 'aroma', 'diffuser'],
    noun: 'Scented Candle', material: 'Soy Wax', category: 'Home & Kitchen › Fragrance', type: 'physical',
    priceBand: [19, 32], skuPrefix: 'HK-CND', tags: ['soy candle', 'home fragrance', 'gift idea', 'self care', 'handmade'],
    description: 'A {color} {material} candle hand-poured in small batches, with a cotton wick for a clean, even burn.',
    benefits: ['Around 45 hours burn time', 'Cotton wick', 'Reusable glass vessel'],
  },
  {
    id: 'plant', keywords: ['plant', 'pot', 'planter', 'succulent', 'vase', 'flower'],
    noun: 'Table Planter', material: 'Terracotta', category: 'Home & Garden › Planters', type: 'physical',
    priceBand: [21, 36], skuPrefix: 'HG-PLT', tags: ['planter', 'plant pot', 'home decor', 'indoor plants', 'terracotta'],
    description: 'A {color} {material} planter with a drainage hole and saucer, sized for desk succulents and small houseplants.',
    benefits: ['Drainage hole + saucer', '12 cm diameter', 'Breathable clay body'],
  },
  {
    id: 'audio', keywords: ['headphone', 'earbud', 'speaker', 'audio', 'headset'],
    noun: 'Wireless Headphones', material: 'Matte', category: 'Electronics › Audio', type: 'physical',
    priceBand: [79, 149], skuPrefix: 'EL-AUD', tags: ['headphones', 'wireless audio', 'bluetooth', 'music', 'work from home'],
    description: '{color} {material} wireless headphones with soft memory-foam cushions and all-day battery for focus sessions and commutes.',
    benefits: ['Up to 30 hours battery', 'Bluetooth 5.3', 'Fold-flat design'],
  },
  {
    id: 'book', keywords: ['book', 'ebook', 'guide', 'cover', 'template', 'preset', 'course'],
    noun: 'Creator Guide', material: 'Digital', category: 'Digital › Guides & Templates', type: 'digital',
    priceBand: [12, 39], skuPrefix: 'DG-GDE', tags: ['digital guide', 'ebook', 'creator tools', 'instant download', 'template'],
    description: 'A {color}-themed {material} guide your buyers can download the moment they check out — practical chapters, worksheets and checklists.',
    benefits: ['Instant download', 'PDF + editable worksheets', 'Free lifetime updates'],
  },
]

/** Used when nothing in the file name matches. Confidence is capped lower so
 *  the UI asks the human to check the category. */
export const FALLBACK_TEMPLATE: ProductTemplate = {
  id: 'generic', keywords: [],
  noun: 'Studio Piece', material: 'Handcrafted', category: 'General › Uncategorised', type: 'physical',
  priceBand: [20, 45], skuPrefix: 'GN-PRD', tags: ['handmade', 'small batch', 'gift idea', 'new arrival'],
  description: 'A {color} {material} piece from our studio, made in small batches. Add the details only you know — size, materials and care — before publishing.',
  benefits: ['Small-batch production', 'Ships in 2–3 days'],
}

/** Named colours for turning a dominant pixel colour into words. */
export const COLOR_NAMES: Array<{ name: string; rgb: [number, number, number] }> = [
  { name: 'Charcoal', rgb: [54, 56, 62] },
  { name: 'Ivory', rgb: [238, 232, 216] },
  { name: 'Sand', rgb: [214, 190, 150] },
  { name: 'Terracotta', rgb: [196, 104, 72] },
  { name: 'Rust', rgb: [168, 74, 40] },
  { name: 'Mustard', rgb: [218, 168, 52] },
  { name: 'Sage', rgb: [150, 172, 140] },
  { name: 'Forest', rgb: [46, 94, 66] },
  { name: 'Teal', rgb: [36, 128, 128] },
  { name: 'Sky', rgb: [132, 180, 222] },
  { name: 'Navy', rgb: [34, 48, 92] },
  { name: 'Cobalt', rgb: [48, 86, 196] },
  { name: 'Lilac', rgb: [182, 160, 214] },
  { name: 'Plum', rgb: [104, 50, 92] },
  { name: 'Blush', rgb: [232, 176, 172] },
  { name: 'Cherry', rgb: [190, 36, 52] },
  { name: 'Coral', rgb: [242, 120, 96] },
  { name: 'Mocha', rgb: [120, 84, 64] },
  { name: 'Stone', rgb: [150, 146, 138] },
  { name: 'Midnight', rgb: [22, 22, 30] },
]
