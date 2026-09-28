// Landing copy that is reused by both the page and its structured data, so the
// FAQPage schema can never drift from the visible answers.

export const HOME_SEO = {
  title: 'Orbitly — Turn a Product Photo into a Ready-to-Sell Listing',
  // Keep under ~155 characters so search snippets are not truncated.
  description: 'Upload one product photo and get a ready-to-sell listing: title, description, price, SKU, tags and SEO. Then sell and grow it from one workspace.',
  imageAlt: 'Orbitly: one product photo becomes a publish-ready listing',
} as const

export interface FaqItem {
  q: string
  a: string
}

export const FAQ: FaqItem[] = [
  {
    q: 'What does Orbitly do?',
    a: 'Orbitly is an all-in-one workspace for creators and small online brands. Upload one product photo and it drafts the listing for you, then the product joins the same workspace as your storefront, checkout, community, customer records and marketing.',
  },
  {
    q: 'Which listing fields are generated from the photo?',
    a: 'Eight: product title, description, category, suggested price, SKU, tags, SEO title and SEO meta description. Each one is marked as AI-written and stays fully editable.',
  },
  {
    q: 'Do I need an account to try it?',
    a: 'No. The demo on this page runs without sign-up. Pick a sample image or upload your own and the listing is drafted in a few seconds.',
  },
  {
    q: 'Is my photo uploaded to a server?',
    a: 'Not in this demo. The image is decoded on a canvas in your browser to read its colours and size, and it never leaves your device.',
  },
  {
    q: 'How does the demo come up with the listing?',
    a: 'It reads real signals from your image — dominant colour, colour share, brightness and dimensions — and matches the file name against product templates. Every field has a “Why?” note that names the exact signal it used, and confidence drops when the match is weak so you know what to check.',
  },
  {
    q: 'What kinds of products can I sell?',
    a: 'Digital files, courses, cohorts and live events, memberships, 1:1 services and physical products — all from the same catalog and checkout.',
  },
  {
    q: 'Does the AI send emails or publish anything on its own?',
    a: 'No. AI suggestions always show the evidence behind them, and nothing is published or sent until you review it and explicitly approve.',
  },
]
