// LOCAL simulation of AI product generation (PRD §15.4). Framework-free.
//
// What is real: the image is decoded on a canvas and its pixels are read —
// dominant colour, colour share, brightness and aspect ratio come from the
// actual file. What is simulated: "classification" matches the file name
// against templates, and copy is assembled from those templates. The evidence
// list says exactly which signal produced each field, so nothing is presented
// as smarter than it is.
//
// The public function signature mirrors the future API contract
// (ProductGenerationRequest → ProductGenerationResult), so swapping in a real
// backend only replaces the body of `generateProduct`.
import type {
  CurrencyCode, GenerationStageId, ProductGenerationEvidence, ProductGenerationRequest,
  ProductGenerationResult, ProductType,
} from '~/types'
import {
  COLOR_NAMES, FALLBACK_TEMPLATE, GENERATION_STAGES, PRODUCT_TEMPLATES, SEO_LIMITS,
  type ProductTemplate,
} from '~/config/generation.config'
import { COVER_MAX_EDGE } from '~/config/app.config'
import { hashString, sleep } from '~/utils/id'

export interface ImageSignals {
  width: number
  height: number
  aspect: number
  dominant: [number, number, number]
  /** Share of sampled foreground pixels close to the dominant colour, 0–1. */
  dominance: number
  brightness: number
  colorName: string
  hex: string
  fingerprint: number
}

export interface PreparedImage {
  /** Downscaled JPEG/PNG data URL — safe to persist and render anywhere. */
  dataUrl: string
  fileName: string
  signals: ImageSignals
}

const SAMPLE_EDGE = 64

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('The image could not be decoded.'))
    img.src = src
  })
}

function toHex([r, g, b]: [number, number, number]) {
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

function nearestColorName(rgb: [number, number, number]): string {
  let best = COLOR_NAMES[0]!
  let bestD = Infinity
  for (const c of COLOR_NAMES) {
    // Weighted RGB distance (approximates perceived difference cheaply).
    const d = 2 * (rgb[0] - c.rgb[0]) ** 2 + 4 * (rgb[1] - c.rgb[1]) ** 2 + 3 * (rgb[2] - c.rgb[2]) ** 2
    if (d < bestD) { bestD = d; best = c }
  }
  return best.name
}

/** Reads real pixel statistics from the image. */
function readSignals(img: HTMLImageElement): ImageSignals {
  const canvas = document.createElement('canvas')
  canvas.width = SAMPLE_EDGE
  canvas.height = SAMPLE_EDGE
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, SAMPLE_EDGE, SAMPLE_EDGE)
  const { data } = ctx.getImageData(0, 0, SAMPLE_EDGE, SAMPLE_EDGE)

  // Quantise to 4 bits/channel. Pass 1 skips transparent pixels, the outer
  // border (usually studio backdrop) and pale/near-black low-saturation
  // pixels, so the product — not the sweep behind it — wins. If that leaves
  // almost nothing (e.g. a white product), pass 2 counts every opaque pixel.
  const border = Math.round(SAMPLE_EDGE * 0.08)
  let lum = 0
  let hash = 0x811c9dc5
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]!, g = data[i + 1]!, b = data[i + 2]!
    hash = Math.imul(hash ^ (r ^ (g << 8) ^ (b << 16)), 0x01000193)
    lum += 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const collect = (strict: boolean) => {
    const map = new Map<number, { n: number; r: number; g: number; b: number }>()
    let count = 0
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]!, g = data[i + 1]!, b = data[i + 2]!, a = data[i + 3]!
      if (a < 128) continue
      if (strict) {
        const px = (i / 4) % SAMPLE_EDGE, py = Math.floor(i / 4 / SAMPLE_EDGE)
        if (px < border || py < border || px >= SAMPLE_EDGE - border || py >= SAMPLE_EDGE - border) continue
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        if (min > 232 || max < 18 || (max - min < 26 && min > 196)) continue
      }
      count++
      const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)
      const bucket = map.get(key) ?? { n: 0, r: 0, g: 0, b: 0 }
      bucket.n++; bucket.r += r; bucket.g += g; bucket.b += b
      map.set(key, bucket)
    }
    return { map, count }
  }
  let { map: buckets, count: fg } = collect(true)
  if (fg < SAMPLE_EDGE * SAMPLE_EDGE * 0.03) ({ map: buckets, count: fg } = collect(false))

  let top = { n: 0, r: 200, g: 200, b: 200 }
  for (const b of buckets.values()) if (b.n > top.n) top = b
  const dominant: [number, number, number] = top.n
    ? [Math.round(top.r / top.n), Math.round(top.g / top.n), Math.round(top.b / top.n)]
    : [200, 200, 200]

  // Share of foreground pixels within a tolerance of the dominant colour.
  let near = 0
  for (const b of buckets.values()) {
    const r = b.r / b.n, g = b.g / b.n, bl = b.b / b.n
    if (Math.abs(r - dominant[0]) + Math.abs(g - dominant[1]) + Math.abs(bl - dominant[2]) < 70) near += b.n
  }

  const width = img.naturalWidth || COVER_MAX_EDGE
  const height = img.naturalHeight || COVER_MAX_EDGE
  return {
    width,
    height,
    aspect: width / height,
    dominant,
    dominance: fg ? near / fg : 0,
    brightness: lum / (data.length / 4) / 255,
    colorName: nearestColorName(dominant),
    hex: toHex(dominant),
    fingerprint: hash >>> 0,
  }
}

function downscale(img: HTMLImageElement, isVector: boolean): string {
  const w = img.naturalWidth || COVER_MAX_EDGE
  const h = img.naturalHeight || COVER_MAX_EDGE
  const scale = Math.min(1, COVER_MAX_EDGE / Math.max(w, h))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(w * scale)
  canvas.height = Math.round(h * scale)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  // Vectors keep crisp edges as PNG; photos compress well as JPEG.
  return isVector ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.84)
}

/** Decode a File or a same-origin URL and extract its signals. */
export async function prepareImage(source: File | { src: string; fileName: string }): Promise<PreparedImage> {
  const isFile = source instanceof File
  const src = isFile ? URL.createObjectURL(source) : source.src
  const fileName = isFile ? source.name : source.fileName
  const isVector = isFile ? source.type === 'image/svg+xml' : fileName.endsWith('.svg')
  try {
    const img = await loadImage(src)
    return { dataUrl: downscale(img, isVector), fileName, signals: readSignals(img) }
  } finally {
    if (isFile) URL.revokeObjectURL(src)
  }
}

function tokens(fileName: string): string[] {
  return fileName.toLowerCase().replace(/\.[a-z0-9]+$/, '').split(/[^a-z]+/).filter(Boolean)
}

function classify(fileName: string): { template: ProductTemplate; matched: string | null } {
  const words = tokens(fileName)
  for (const template of PRODUCT_TEMPLATES) {
    const hit = template.keywords.find(k => words.some(w => w === k || w.startsWith(k)))
    if (hit) return { template, matched: hit }
  }
  return { template: FALLBACK_TEMPLATE, matched: null }
}

/** Fixes "A ivory…" → "An ivory…" after colour interpolation. */
function withArticle(text: string) {
  return text.replace(/\b(A|a) ([aeiouAEIOU])/g, (_, art: string, v: string) => `${art}n ${v}`)
}

function clampText(text: string, max: number) {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

const USD_RATE: Record<CurrencyCode, number> = { USD: 1, SGD: 1.34, IDR: 16_200 }

function roundPrice(value: number, currency: CurrencyCode) {
  if (currency === 'IDR') return Math.round(value / 1000) * 1000
  // Whole numbers read cleaner on a listing card.
  return Math.max(1, Math.round(value))
}

export interface GenerationCallbacks {
  onStage?: (id: GenerationStageId, index: number) => void
  /** Called after each stage with the fields that stage produced. */
  onPartial?: (partial: Partial<ProductGenerationResult>, stage: GenerationStageId) => void
  signal?: AbortSignal
}

export interface GenerationOutput extends ProductGenerationResult {
  productType: ProductType
}

export async function generateProduct(
  request: ProductGenerationRequest,
  image: PreparedImage,
  cb: GenerationCallbacks = {},
): Promise<GenerationOutput> {
  const currency = (request.currency ?? 'USD') as CurrencyCode
  const s = image.signals
  const { template, matched } = classify(image.fileName)
  const color = s.colorName
  const evidence: ProductGenerationEvidence[] = []

  const title = `${color} ${template.material} ${template.noun}`
  const description = [
    withArticle(template.description.replace('{color}', color.toLowerCase()).replace('{material}', template.material.toLowerCase())),
    '',
    ...template.benefits.map(b => `• ${b}`),
  ].join('\n')

  // Price: position inside the template band by the image fingerprint, so the
  // same photo always gets the same suggestion.
  const [lo, hi] = template.priceBand
  const position = (s.fingerprint % 1000) / 1000
  const suggestedPrice = roundPrice((lo + (hi - lo) * (0.35 + position * 0.4)) * USD_RATE[currency], currency)

  const sku = `${template.skuPrefix}-${color.slice(0, 3).toUpperCase()}-${(hashString(image.fileName) ^ s.fingerprint).toString(36).slice(-4).toUpperCase()}`
  const tags = Array.from(new Set([color.toLowerCase(), ...template.tags])).slice(0, 7)
  const seoTitle = clampText(`${title} | ${template.category.split(' › ').pop()}`, SEO_LIMITS.title)
  const seoDescription = clampText(
    `Shop the ${title.toLowerCase()}. ${template.benefits.slice(0, 2).join('. ')}. Ships from our studio.`,
    SEO_LIMITS.description,
  )

  // Confidence = how much real signal backs the output.
  const classSignal = matched ? 0.9 : 0.55
  const colorSignal = Math.min(1, 0.45 + s.dominance)
  const confidence = Math.min(0.97, Math.max(0.4, classSignal * 0.65 + colorSignal * 0.35))

  evidence.push(
    { field: 'category', reason: matched ? `File name contains “${matched}”, matching the ${template.id} template.` : 'No known product word in the file name — using the general template. Please check the category.' },
    { field: 'title', reason: `Dominant colour ${s.hex} is closest to “${color}” (${Math.round(s.dominance * 100)}% of product pixels).` },
    { field: 'description', reason: `Written from the ${template.id} template and the detected colour; add details only you know.` },
    { field: 'price', reason: `Placed inside the $${lo}–$${hi} (USD) band set for this template, converted to ${currency}.` },
    { field: 'sku', reason: `Template prefix + colour code + a 4-char hash of the image.` },
    { field: 'tags', reason: `Template keywords plus the detected colour.` },
    { field: 'seo', reason: `Clamped to ${SEO_LIMITS.title} / ${SEO_LIMITS.description} characters for search snippets.` },
    { field: 'vision', reason: `${s.width}×${s.height}px, aspect ${s.aspect.toFixed(2)}, brightness ${Math.round(s.brightness * 100)}%.` },
  )

  const byStage: Partial<Record<GenerationStageId, Partial<ProductGenerationResult>>> = {
    title: { title },
    description: { description },
    category: { category: template.category },
    price: { suggestedPrice },
    sku: { sku },
    tags: { tags },
    seo: { seoTitle, seoDescription },
  }

  for (const [index, stage] of GENERATION_STAGES.entries()) {
    if (cb.signal?.aborted) throw new DOMException('Generation cancelled', 'AbortError')
    cb.onStage?.(stage.id, index)
    await sleep(stage.durationMs)
    const partial = byStage[stage.id]
    if (partial) cb.onPartial?.(partial, stage.id)
  }

  return {
    title, description, category: template.category, suggestedPrice, sku, tags, seoTitle, seoDescription,
    confidence, evidence, productType: template.type,
  }
}

export function totalGenerationMs(): number {
  return GENERATION_STAGES.reduce((s, st) => s + st.durationMs, 0)
}
