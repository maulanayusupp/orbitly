import { fileURLToPath } from 'node:url'

// Shared SCSS (variables + mixins, no CSS output) injected into every
// component <style lang="scss"> block.
const scssShared = fileURLToPath(
  new URL('./app/assets/scss/_shared.scss', import.meta.url),
)

// Canonical origin for sitemap, canonical links and absolute og:image URLs.
// Set NUXT_PUBLIC_SITE_URL to the production domain before deploying.
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://orbitly.vercel.app').replace(/\/$/, '')

const siteDescription = 'Upload one product photo and Orbitly drafts a publish-ready listing — title, description, category, price, SKU, tags and SEO — then run your store, community, customers and marketing from one workspace.'

// Workspace + storefront are client-rendered demo data kept in the visitor's
// browser: crawlers would index an empty shell, so they are kept out of search.
const noindexRoutes = ['/dashboard', '/products', '/products/**', '/store', '/store/**', '/community', '/customers', '/customers/**', '/marketing', '/analytics', '/settings']

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/seo'],

  // Components are auto-imported by filename only: <UiButton>, <ProductForm>.
  components: [{ path: '~/components', pathPrefix: false }],

  css: ['~/assets/scss/main.scss'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Orbitly',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      meta: [
        { name: 'theme-color', content: '#16132b' },
        { name: 'format-detection', content: 'telephone=no' },
        ...(process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION
          ? [{ name: 'google-site-verification', content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION }]
          : []),
        ...(process.env.NUXT_PUBLIC_BING_SITE_VERIFICATION
          ? [{ name: 'msvalidate.01', content: process.env.NUXT_PUBLIC_BING_SITE_VERIFICATION }]
          : []),
      ],
    },
  },

  // The workspace is a client-side demo backed by localStorage, so app routes
  // render in the browser and carry `noindex`. The landing page is SSR.
  routeRules: Object.fromEntries(noindexRoutes.map(r => [r, { ssr: false, robots: false }])),

  // ---- SEO (@nuxtjs/seo: site config, sitemap, robots, schema.org, meta) ----
  site: {
    url: siteUrl,
    name: 'Orbitly',
    description: siteDescription,
    defaultLocale: 'en',
    indexable: true,
  },

  sitemap: {
    // Only the public marketing surface. App routes stay crawlable (so crawlers
    // can read their noindex header/meta) but are never listed here.
    exclude: noindexRoutes,
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Orbitly',
      url: siteUrl,
      logo: `${siteUrl}/icon-512.png`,
    },
  },

  // Dynamic OG rendering needs a native renderer we do not ship; a static
  // raster card (pnpm og) is used instead.
  ogImage: { enabled: false },

  seo: {
    meta: {
      themeColor: '#16132b',
      colorScheme: 'light',
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${scssShared}" as *;`,
        },
      },
    },
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },
})
