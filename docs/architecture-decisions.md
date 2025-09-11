# ADR - Architecture Decision Record

> Living document focused on architectural choices. Operational minutiae and low-level implementation are intentionally omitted.

## 1) Project Overview

- **Stack:** Shopify Hydrogen (Remix), TypeScript, React, Tailwind CSS, Radix UI, lucide-react.
- **Mono-repo:** `apps/storefront` (Hydrogen app) + `packages/core` (cross-cutting infra: tokens, i18n, routing/policy, utils, adapters) + `packages/ui` (presentational components) + `packages/brand-*` (brand tokens/resources/policy).

## 2) Runtime, Hosting & Environments

- **Hosting:** Shopify Oxygen.
- **Runtime target:** Oxygen edge runtime (Workers).
- **Environments/Branches:** production → `main`; staging → `develop`; preview → PR previews via GitHub Deployments on Oxygen.
- **Env vars:** managed via Shopify Oxygen. Keys: `BRAND_ID`, `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_ID`, `PUBLIC_CHECKOUT_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`.

## 3) Repository, Build & CI/CD

- **Package manager:** pnpm.
- **Task orchestrator:** Turborepo.
- **CI/CD:** GitHub Actions → workflows: lint · typecheck · unit/e2e · build · deploy (preview/staging/prod).
- **Workspaces:** `@nuvens/*` aliases; app composes core + ui + brand packages.
- **TypeScript & exports:** public surface consolidated per package (`src/index.ts`); subpath imports avoided. TS `paths` point to root entries only.

## 4) Internationalization

- **Library:** i18next / react-i18next.
- **Locales:** `en`, `pt`, `es`, `fr`, `it`.
- **Locale resolution:** URL segment `/{lang}/…` takes precedence; fallback to `storefront.i18n.language`.
- **Policy:** no silent fallbacks; missing keys are surfaced.
- **Resource merge:** app resources + core resources + brand resources are merged in the **root loader** per active language; SPA transitions reuse the initialized instance.

## 5) Design Tokens & Theming

- **Model:** `DesignTokens = { palette: Record<string,Record<string,string>>; colors: Record<string,string> }`.
- **Core tokens:** neutral palettes + semantic mapping (`surface`, `primary`, `accent`, `danger`, `border`).
- **Brand tokens:** each brand defines palette and semantic mapping.
- **CSS vars:** generated once and injected at `:root`; components consume only CSS vars.

## 6) UI

- **Scope:** presentational, brand-agnostic components (Button, Card, Dialog, Container, Stepper, etc.).
- **Conventions:** token-driven styling; `cn` merge; predictable overrides.
- **Exports:** single entry; no nested barrels.

## 7) Commerce & Pages

- **Cart:** Hydrogen CartForm actions with explicit async states.
- **Catalog:** paginated listings with localized controls.
- **PDP:** optimistic variant selection; URL sync; add-to-cart opens aside.
- **CMS pages:** catch-all by handle; template via metafield `app.template` or heuristics (no `templateSuffix`).

## 8) Routing & Policy

- **Per-brand allowlist:** `RouteAccessPolicy` (default `deny`) with normalized patterns.
- **Enforcement:** evaluated on the **server** and mirrored in **route loaders** (guarded loaders) to guarantee consistent 404 across SSR and SPA.
- **Data requests:** `.data`/`?_data` for blocked routes return **404** (no redirects), aligning crawler semantics.
- **404 UX:** blocked routes throw; ErrorBoundary renders 404 inside the shared Layout.

## 9) Accessibility & UX

- **Radix primitives** with tokenized colors; labels/live regions for async states.

## 10) Security (CSP)

- **Authority:** headers enforced centrally in the Oxygen server.
- **Directives:**
  - `frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com`
  - `img-src 'self' data: https://i.ytimg.com https://*.ytimg.com`
  - `media-src 'self' https://*.googlevideo.com`
  - `connect-src 'self' https://www.youtube.com https://*.googlevideo.com`

- **Extras:** `Referrer-Policy: strict-origin-when-cross-origin`; appropriate `Permissions-Policy`.

## 11) Performance & SEO

- **CWV targets:** LCP ≤ 2.5s; INP ≤ 200ms; CLS ≤ 0.1; TTFB ≤ 0.8s.
- **Images:** Shopify CDN responsive images.
- **Caching:** CDN/edge caching; short cache for shared chrome via root headers; SWR considered for GraphQL in future work.
- **SEO:** canonical/hreflang helpers; Product SEO from Shopify fields.

## 12) Analytics & Observability

- **Analytics:** Hydrogen Analytics + GA4; optional Meta/Pinterest.
- **Observability:** Sentry (planned) + Oxygen logs.

## 13) Testing & Quality

- **Static checks:** ESLint, TypeScript, Prettier.
- **Unit:** Vitest (+ RTL).
- **E2E:** Playwright.
- **Pre-commit:** Husky + lint-staged (planned).

## 14) Deployment

- **Build:** install → lint/typecheck/test → build (turbo) → deploy (Oxygen); cached artifacts.
- **Release:** trunk-based; Changesets for package versioning; PR previews.

## 15) Decision Log (ADR Summary)

|  ID | Decision                                                     | Status  | Date       | Context                                                                                |
| --: | ------------------------------------------------------------ | ------- | ---------- | -------------------------------------------------------------------------------------- |
| 001 | Enforce CSP centrally; allow YouTube `nocookie` embeds       | Decided | 2025-09-10 | Security headers centralized; enables modal playback.                                  |
| 002 | No i18n silent fallbacks                                     | Decided | 2025-09-10 | Surface missing keys early.                                                            |
| 003 | Tokens → CSS vars; single injection of merged core + brand   | Decided | 2025-09-10 | Consistent theming; low runtime cost.                                                  |
| 004 | Use `cn` (tailwind-merge) for class conflict resolution      | Decided | 2025-09-10 | Predictable overrides.                                                                 |
| 005 | Single Stepper in UI                                         | Decided | 2025-09-10 | Avoids component drift.                                                                |
| 006 | Remove hex fallbacks from class strings                      | Decided | 2025-09-10 | All theming via CSS vars.                                                              |
| 007 | Cart feedback UX for discount/gift card                      | Decided | 2025-09-10 | Clear async/error states.                                                              |
| 008 | CMS catch-all uses `app.template` and handle heuristics      | Decided | 2025-09-10 | Avoids `templateSuffix` 404s.                                                          |
| 009 | Split `@nuvens/ui-core` into `@nuvens/core` and `@nuvens/ui` | Decided | 2025-09-11 | Clarify boundaries: infra vs presentation; simplify imports/paths.                     |
| 010 | Per-brand **RouteAccessPolicy** (default-deny allowlist)     | Decided | 2025-09-11 | Block unused Shopify routes for single-product brands; normalized patterns.            |
| 011 | **Guarded loader** pattern across app routes                 | Decided | 2025-09-11 | SPA/SSR consistency: blocked routes throw 404; Layout still renders via ErrorBoundary. |
| 012 | Server returns **404 for `.data`** on blocked routes         | Decided | 2025-09-11 | Avoid successful data responses that keep SPA alive; crawler-friendly.                 |
| 013 | Consolidate package exports to a **single root entry**       | Decided | 2025-09-11 | Remove nested barrels/subpaths; simplify TS `paths`; reduce cyclic import risk.        |
| 014 | i18n resource **merge at root** (app + core + brand)         | Decided | 2025-09-11 | Normalize per language and merge; SPA reuses initialized instance.                     |
| 015 | Root sets **cache headers** for shared chrome                | Decided | 2025-09-11 | Keep header/footer available on error pages with minimal overhead.                     |

## 16) Backlog (Future Work)

- **DX:** Husky pre-commit/pre-push, `commitlint`, `lint-staged`; typed env schema (zod) with runtime validation; Renovate/Dependabot; license/SPDX checks.
- **UI Preview:** Storybook/Ladle + visual regression (Chromatic/Playwright snapshots).
- **Perf:** Persisted GraphQL queries + ETags + SWR edge caching; route-level code splitting; CSS extraction; bundle budgets; Lighthouse CI gates.
- **Security:** CSP nonces, SRI, Trusted Types; Permissions-Policy/COOP/COEP/CORP hardening; bot protection/rate limiting; audit logging.
- **A11y:** axe-core CI; keyboard-trap tests; focus-visible audit.
- **i18n:** lint for missing/unused keys; translation completeness CI; in-context preview build.
- **Analytics/Obs:** Sentry with release health, source maps, alerting; CWV RUM to GA4; GraphQL cost/latency dashboards.
- **SEO:** JSON-LD (Product, Breadcrumb, FAQ); `hreflang` matrix; CDN preconnect & critical preload.
- **Release:** Feature flags with kill switches; canary deploys and one-click rollback.

## 17) Ownership

- **Engineering:** André Daniel
- **Content/Translations:** André Daniel
- **Review:** changes to locales/tokens require review by André Daniel; ADRs recorded in §15.

—
_Last updated: 2025-09-11_
