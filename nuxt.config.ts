import { fileURLToPath } from 'node:url'

// Shared SCSS (variables + mixins, no CSS output) injected into every
// component <style lang="scss"> block.
const scssShared = fileURLToPath(
  new URL('./app/assets/scss/_shared.scss', import.meta.url),
)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

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
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#16132b' },
        {
          name: 'description',
          content: 'Orbitly — the creator business OS. Drop one product photo and get a publish-ready listing, then run products, community, customers and marketing from one place.',
        },
      ],
    },
  },

  // The workspace is a client-side demo backed by localStorage, so app routes
  // render in the browser. The landing page stays server-rendered for SEO.
  routeRules: {
    '/dashboard': { ssr: false },
    '/products/**': { ssr: false },
    '/products': { ssr: false },
    '/store/**': { ssr: false },
    '/store': { ssr: false },
    '/community': { ssr: false },
    '/customers/**': { ssr: false },
    '/customers': { ssr: false },
    '/marketing': { ssr: false },
    '/analytics': { ssr: false },
    '/settings': { ssr: false },
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
