// Builds public/og-image.png (1200×630), the link-preview card for WhatsApp,
// Facebook, LinkedIn and X. It must be raster — those crawlers ignore SVG.
// Text uses system families because librsvg (inside sharp) resolves fonts via
// fontconfig, not the page's web fonts.
//
// Run: pnpm og
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(root, 'public/og-image.png')
const W = 1200
const H = 630
const SANS = 'Helvetica Neue, Helvetica, Arial, sans-serif'
const MONO = 'Menlo, Monaco, Courier New, monospace'

const mug = (await readFile(resolve(root, 'public/samples/stoneware-mug.svg'))).toString('base64')

const field = (y, label, value) => `
  <g transform="translate(0 ${y})">
    <rect width="372" height="62" rx="12" fill="#effaf6" stroke="#9fe0cf"/>
    <text x="16" y="24" font-family="${SANS}" font-size="12" font-weight="700" fill="#06604d" letter-spacing="1.5">${label}</text>
    <text x="16" y="47" font-family="${SANS}" font-size="19" font-weight="700" fill="#16132b">${value}</text>
  </g>`

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="orbit" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0" stop-color="#7b61ff"/><stop offset="0.5" stop-color="#c04df5"/><stop offset="1" stop-color="#ff7a4d"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.08" cy="0" r="0.75"><stop offset="0" stop-color="#5b3df5" stop-opacity="0.55"/><stop offset="1" stop-color="#5b3df5" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowB" cx="1" cy="1" r="0.7"><stop offset="0" stop-color="#0d9e7f" stop-opacity="0.35"/><stop offset="1" stop-color="#0d9e7f" stop-opacity="0"/></radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity="0.35"/></filter>
  </defs>

  <rect width="${W}" height="${H}" fill="#16132b"/>
  <rect width="${W}" height="${H}" fill="url(#glowA)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB)"/>
  <g fill="#ffffff" fill-opacity="0.06">
    ${Array.from({ length: 30 * 16 }, (_, i) => `<circle cx="${(i % 30) * 40 + 20}" cy="${Math.floor(i / 30) * 40 + 20}" r="1.4"/>`).join('')}
  </g>

  <!-- Wordmark -->
  <g transform="translate(72 70)">
    <circle cx="22" cy="22" r="10" fill="url(#orbit)"/>
    <ellipse cx="22" cy="22" rx="24" ry="10.5" fill="none" stroke="url(#orbit)" stroke-width="4.5" transform="rotate(-28 22 22)"/>
    <circle cx="42.5" cy="10.5" r="4" fill="#ff7a4d"/>
    <text x="62" y="33" font-family="${SANS}" font-size="32" font-weight="700" fill="#ffffff" letter-spacing="-1">Orbitly</text>
  </g>

  <!-- Headline -->
  <text x="72" y="238" font-family="${SANS}" font-size="68" font-weight="800" fill="#ffffff" letter-spacing="-2.5">One photo in.</text>
  <text x="72" y="316" font-family="${SANS}" font-size="68" font-weight="800" fill="url(#orbit)" letter-spacing="-2.5">A product ready</text>
  <text x="72" y="394" font-family="${SANS}" font-size="68" font-weight="800" fill="url(#orbit)" letter-spacing="-2.5">to sell.</text>
  <text x="72" y="456" font-family="${SANS}" font-size="24" fill="#c9c6dc">Title, price, SKU, tags &amp; SEO from one photo.</text>

  <g transform="translate(72 506)">
    <rect width="262" height="54" rx="27" fill="#5b3df5"/>
    <text x="131" y="35" font-family="${SANS}" font-size="21" font-weight="700" fill="#ffffff" text-anchor="middle">Try the free demo →</text>
  </g>

  <!-- Photo card -->
  <g transform="translate(700 92) rotate(-6)" filter="url(#shadow)">
    <rect width="230" height="262" rx="24" fill="#ffffff"/>
    <image x="12" y="12" width="206" height="206" xlink:href="data:image/svg+xml;base64,${mug}" preserveAspectRatio="xMidYMid slice"/>
    <text x="18" y="244" font-family="${MONO}" font-size="12" fill="#6e6b86">stoneware-mug.jpg</text>
  </g>

  <!-- Listing card -->
  <g transform="translate(772 214) rotate(3)" filter="url(#shadow)">
    <rect width="404" height="330" rx="24" fill="#ffffff"/>
    <g transform="translate(16 18)">
      <rect width="118" height="28" rx="14" fill="#effaf6" stroke="#9fe0cf"/>
      <text x="59" y="19" font-family="${SANS}" font-size="13" font-weight="700" fill="#06604d" text-anchor="middle">✦ Generated</text>
      <rect x="318" width="54" height="28" rx="14" fill="#0d9e7f"/>
      <text x="345" y="19" font-family="${SANS}" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">94%</text>
      ${field(44, 'TITLE', 'Sage Stoneware Pour-Over Mug')}
      ${field(116, 'CATEGORY', 'Home &amp; Kitchen › Drinkware')}
      ${field(188, 'PRICE', '$33.00')}
      <g transform="translate(0 266)" font-family="${SANS}" font-size="13" font-weight="700" fill="#5b3df5">
        <rect width="58" height="26" rx="13" fill="#eeeaff"/><text x="29" y="18" text-anchor="middle">sage</text>
        <rect x="66" width="108" height="26" rx="13" fill="#eeeaff"/><text x="120" y="18" text-anchor="middle">ceramic mug</text>
        <rect x="182" width="88" height="26" rx="13" fill="#eeeaff"/><text x="226" y="18" text-anchor="middle">handmade</text>
      </g>
    </g>
  </g>
</svg>`

await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(OUT)
const { size } = await sharp(OUT).metadata().then(async () => (await import('node:fs/promises')).stat(OUT))
console.log(`og-image.png written (${W}×${H}, ${(size / 1024).toFixed(0)} KB)`)
