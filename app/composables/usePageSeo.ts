// Per-page SEO: title, description, canonical, Open Graph and Twitter card.
// Site-wide identity (name, url, sitemap, robots, schema.org) lives in
// nuxt.config → `site` / `schemaOrg`.

interface PageSeoOptions {
  /** Path under public/ or absolute URL. Defaults to the brand card. */
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

export const OG_IMAGE = { path: '/og-image.png', width: 1200, height: 630 } as const

export function usePageSeo(title: string, description: string, options: PageSeoOptions = {}) {
  const { image = OG_IMAGE.path, imageAlt = title, type = 'website', noindex = false } = options
  const siteUrl = useRuntimeConfig().public.siteUrl as string
  const route = useRoute()
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
  const url = `${siteUrl}${route.path === '/' ? '' : route.path}`

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: type,
    ogUrl: url,
    ogSiteName: 'Orbitly',
    ogLocale: 'en_US',
    ogImage: imageUrl,
    ogImageSecureUrl: imageUrl,
    ogImageType: 'image/png',
    ogImageWidth: OG_IMAGE.width,
    ogImageHeight: OG_IMAGE.height,
    ogImageAlt: imageAlt,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: imageUrl,
    twitterImageAlt: imageAlt,
    robots: noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1',
  })

  useHead({ link: [{ rel: 'canonical', href: url }] })
}
