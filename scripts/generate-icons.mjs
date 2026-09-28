// Rasterises public/favicon.svg into the PNG icons browsers, iOS and Android
// ask for, and writes the web app manifest.
//
// Run: pnpm icons
import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pub = p => resolve(root, 'public', p)
const svg = await readFile(pub('favicon.svg'))

const sizes = { 'favicon-16x16.png': 16, 'favicon-32x32.png': 32, 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512 }
for (const [file, size] of Object.entries(sizes)) {
  await sharp(svg, { density: Math.max(72, size * 3) }).resize(size, size).png().toFile(pub(file))
}

const manifest = {
  name: 'Orbitly — Creator Business OS',
  short_name: 'Orbitly',
  description: 'Turn one product photo into a ready-to-sell listing, then run your creator business from one workspace.',
  start_url: '/',
  display: 'standalone',
  background_color: '#f6f4ef',
  theme_color: '#16132b',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}
await writeFile(pub('site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Icons written: ${Object.keys(sizes).join(', ')} + site.webmanifest`)
