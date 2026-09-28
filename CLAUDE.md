# CLAUDE.md — Project guide for AI assistants & contributors

Keep this file in sync with reality. Any change to rules, features, pages or AI behaviour
updates this file (and README when user-facing).

## What this is

**Orbitly** — a frontend-only demo of a creator business OS (PRD in `docs/PRD.md`). The root
route is an AI-first product-generation demo; `/dashboard` and siblings are the workspace.
Sample workspace: **Kiln & Co.** (ceramics studio). English only. Light theme only.

## Stack (verified versions)

| Concern | Choice |
| --- | --- |
| Framework | Nuxt **4.5.2** (Vue 3.5, Vite 8, Nitro 2.13) |
| State | Pinia **4.0.3** via `@pinia/nuxt` **1.0.2** |
| Styling | **SCSS only** (`sass` 1.105.0) — no inline CSS |
| Types | TypeScript 5.9 strict, `vue-tsc` 3.3 |
| Node | **^22.19 or ^24.11** (Nuxt 4.5 `engines`; Node 20 fails the build with `Set#difference`) |

## Commands

`pnpm dev` · `pnpm build` · `pnpm preview` · `pnpm typecheck` (must pass clean) ·
`pnpm og` · `pnpm icons`.

## Architecture (PRD §10)

```
app/
  config/       structure + constants (nav, product types, generation stages/templates)
  types/        domain contracts (PRD §9) + ProductGeneration* API contract (PRD §15.5)
  mock/seed.ts  deterministic seeded demo data, dates relative to now
  services/     framework-free logic — NO Vue imports
    adapter.ts          DataAdapter boundary (mock = seed + localStorage)
    generation.service  local "AI": canvas pixel signals + template matching
    intelligence.service Marketing Brain rules → Insight[] with evidence
    analytics.service   KPIs, series, conversion
    commerce.service    checkout (idempotency key), product-from-draft, publish blockers
  stores/workspace.ts   single Pinia store; applies records returned by services, persists
  composables/  useWorkspace, useAuth, useProducts, useCustomers, useCommunity,
                useAnalytics, useAIInsights, useProductGenerator, useFormat, useToast
  components/   auto-imported by FILENAME (pathPrefix: false)
    ui/         presentational kit (UiButton, UiCard, UiModal, UiField, UiConfidence…)
    app/        shell (AppSidebar, AppTopbar, AppMobileNav, PublicHeader/Footer, BrandMark)
    landing/    GeneratorStudio (composition root), ImageDrop, StageList, AiFlag,
                HeroShowcase (hero art — shows the REAL output of the mug sample; keep in sync),
                LandingSections (steps, workspace bento, trust, CTA), LandingFaq
    dashboard/  AreaChart, BarList, MiniColumns (SVG, no chart lib), ActivityFeed
    products/ community/ marketing/
  layouts/      default (public), app (workspace shell), store (public storefront)
  pages/        orchestration only
```

Rules: pages orchestrate; components are prop-driven; domain logic lives in services and is
reached through composables; UI never imports mock data.

- Landing studio is a wizard: step 1 (upload) is shown alone and centred; step 2 (listing)
  mounts only once an image exists, and Reset returns to step 1.
- `ProductPreview` is container-query driven; pass `framed` for the browser-mock look (landing
  modal, editor) and omit it on the real storefront.
- App routes are `ssr: false` (localStorage-backed); `/` is SSR, with the studio in `<ClientOnly>`.
- Bump `DEMO_STORAGE_KEY` in `config/app.config.ts` whenever the seed shape/content changes.

## AI honesty rules (do not break)

1. Every AI-produced field is visibly marked (`ai-mark` mixin / `UiBadge tone="ai"`), stays
   editable, shows “Edited” + Restore once changed, and has a “Why?” evidence line.
2. Evidence must describe the **actual** signal used. Do not claim model capabilities the local
   simulation does not have.
3. No external side effect without explicit human approval: insights → `ApprovalModal`
   (checkbox + button) → campaign in `scheduled` state only. Nothing is sent.
4. Numbers shown as metrics are computed from the snapshot — no hard-coded deltas.
5. Checkout never asks for card details.

## Styling

- Tokens (only place for colour literals): `assets/scss/_tokens.scss`.
- `_variables.scss` + `_mixins.scss` are injected into every component via `_shared.scss`
  (`surface`, `ai-mark`, `glass`, `respond-to`, `container`, `eyebrow`, `numeric`, …).
- Only permitted `:style` use: passing CSS custom properties (currently `--swatch` in
  GeneratorStudio). SVG geometry attributes are fine.
- `orbit-text` (gradient-clipped text) must keep its `::selection` override, or selected text
  turns invisible.
- Breakpoints `sm 36rem · md 48rem · lg 64rem · xl 80rem · xxl 100rem`; must not scroll horizontally at 375px.

## SEO

- `@nuxtjs/seo` 5.3.16 (site config, sitemap, robots, schema.org). `site.url` comes from
  `NUXT_PUBLIC_SITE_URL` (see `.env.example`); set it to the real domain before deploying.
- **Only `/` is indexable.** Every app/storefront route gets `ssr: false` + `robots: false`
  (`X-Robots-Tag: noindex`) from the `noindexRoutes` list in `nuxt.config.ts`, and is excluded
  from the sitemap — they are client-only demo data. Add new app routes to that list.
- Home meta lives in `config/landing.config.ts` (`HOME_SEO`, description ≤ 155 chars). The same
  `FAQ` array renders `LandingFaq` and the FAQPage JSON-LD, so they cannot drift.
- `usePageSeo()` sets title/description/canonical/OG/Twitter. It must be **imported
  explicitly** (`~/composables/usePageSeo`): with the SEO module installed Nuxt does not
  auto-import it.
- `og:image` must stay raster: `pnpm og` builds `public/og-image.png` (1200×630, ~65 KB);
  `pnpm icons` builds PNG favicons, apple-touch-icon, 192/512 icons and `site.webmanifest`.
  Re-run both after brand changes.
- Optional verification meta: `NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NUXT_PUBLIC_BING_SITE_VERIFICATION`.

## Commits

Author **Maulana Yusup Abdullah <maulanayusupp@gmail.com>**. No AI co-author trailer.
Commit and push after each change.
