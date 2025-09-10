# Architecture & Decisions — Concise ADR

> Living document focused on architectural choices. Operational minutiae and low‑level implementation are intentionally omitted.

## 1) Project Overview

- **Stack:** Shopify Hydrogen (Remix), TypeScript, React, Tailwind CSS, Radix UI, lucide-react.
- **Mono‑repo:** `apps/storefront` (Hydrogen app) + `packages/ui-core` (neutral tokens & base components) + `packages/brand-ui-*` (brand tokens/resources).

## 2) Runtime, Hosting & Environments

- **Hosting:** Shopify Oxygen.
- **Runtime target:** Oxygen edge runtime (Workers).
- **Environments/Branches:** production → `main`; staging → `develop`; preview → PR previews via GitHub Deployments on Oxygen.
- **Env vars:** managed via Shopify Oxygen environment variables (admin). Keys: `BRAND_ID`, `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_ID`, `PUBLIC_CHECKOUT_DOMAIN`, `PUBLIC_STOREFRONT_API_TOKEN`.

## 3) Repository, Build & CI/CD

- **Package manager:** pnpm.
- **Task orchestrator:** Turborepo.
- **CI/CD:** GitHub Actions → workflows: lint · typecheck · unit/e2e · build · deploy (preview/staging/prod).
- **Workspaces:** `@nuvens/*` aliases; app composes core + brand packages.
- **TypeScript:** root base config; brand packages export tokens/resources; app composes.

## 4) Internationalization

- **Library:** i18next / react-i18next.
- **Locales:** `en`, `pt`, `es`, `fr`, `it`.
- **Decisions:** No silent fallbacks (surface missing keys). URL locale segment (`/{lang}/…`) takes precedence; else Shopify `storefront.i18n.language`.

## 5) Design Tokens & Theming

- **Model:** `DesignTokens = { palette: Record<string,Record<string,string>>; colors: Record<string,string> }`.
- **Core tokens:** neutral palettes + semantic mapping (e.g., `surface`, `primary`, `accent`, `danger`, `border`).
- **Brand tokens:** each `brand-ui-*` defines palette and maps semantics.
- **CSS vars:** generated once and injected at `:root`; classes use only CSS variables (no hex fallbacks).

## 6) UI Core

- **Base components:** Button, IconButton, Stepper, Input, Container. Colors derive from tokens; `cn` (tailwind-merge) ensures user `className` overrides.
- **Single Stepper source:** reused across cart and product flows.
- **Video policy:** YouTube via `youtube-nocookie` inside Radix Dialog; optional muted autoplay preview under hero.

## 7) Commerce & Pages

- **Cart:** Hydrogen CartForm actions (`LinesAdd/Update/Remove`, `DiscountCodesUpdate`, `GiftCardCodesUpdate`). Live feedback for loading/success/error. Checkout URL fallback derives from `cartId` when needed.
- **Catalog & pagination:** Hydrogen `<Pagination>` wrapped with localized controls.
- **Product page:** optimistic variant selection, URL sync for selected options; Add‑to‑Cart opens cart aside.
- **CMS pages:** catch‑all route fetches by handle; template chosen by metafield `app.template` or heuristics; avoid `templateSuffix` (404 risk).

## 8) Accessibility & UX

- **Radix primitives** with tokenized colors; a11y labels and live regions for async states.

## 9) Security (CSP)

- **Authority:** enforced centrally in the Remix server on Oxygen.
- **Directives:**  
  `frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com`  
  `img-src 'self' data: https://i.ytimg.com https://*.ytimg.com`  
  `media-src 'self' https://*.googlevideo.com`  
  `connect-src 'self' https://www.youtube.com https://*.googlevideo.com`
- **Aux headers:** `Referrer-Policy: strict-origin-when-cross-origin`; appropriate `Permissions-Policy` for autoplay.

## 10) Performance & SEO

- **CWV targets:** LCP ≤ 2.5s; INP ≤ 200ms; CLS ≤ 0.1; TTFB ≤ 0.8s.
- **Images:** Shopify CDN responsive images; avoid heavy local assets.
- **Caching:** CDN + edge caching; Cache API for GraphQL with SWR where safe; stream RSC where applicable.
- **SEO:** canonical URLs via helper; product SEO from Shopify fields with sensible fallbacks.

## 11) Analytics & Observability

- **Analytics:** Shopify Hydrogen Analytics (`ProductView` etc.) + GA4 (primary) + optional Meta Pixel/Pinterest.
- **Observability:** Sentry (web) + Oxygen logs; optional uptime monitoring.

## 12) Testing & Quality

- **Static checks:** ESLint, TypeScript, Prettier.
- **Unit tests:** Vitest (+ React Testing Library).
- **E2E tests:** Playwright (critical user journeys).
- **Pre‑commit:** Husky + lint-staged (enabled).

## 13) Deployment

- **Build steps:** install → lint/typecheck/test → build (turbo) → deploy (Oxygen). Artifacts cached between jobs.
- **Release process:** trunk‑based via PR; Changesets for package versioning; semantic tags & GitHub Release notes; auto‑deploy on merge to `main`/`develop`.

## 14) Decision Log (ADR Summary)

|  ID | Decision                                                   | Status  | Date       | Context                                               |
| --: | ---------------------------------------------------------- | ------- | ---------- | ----------------------------------------------------- |
| 001 | Enforce CSP centrally; allow YouTube `nocookie` embeds     | Decided | 2025-09-10 | Security headers centralized; enables modal playback. |
| 002 | No i18n silent fallbacks                                   | Decided | 2025-09-10 | Surface missing keys early in dev.                    |
| 003 | Tokens → CSS vars; single injection of merged core + brand | Decided | 2025-09-10 | Consistent theming; low runtime cost.                 |
| 004 | Use `cn` (tailwind-merge) for class conflict resolution    | Decided | 2025-09-10 | Guarantees consumer overrides.                        |
| 005 | Single Stepper in UI core                                  | Decided | 2025-09-10 | Avoids drift across cart/product.                     |
| 006 | Remove hex fallbacks from class strings                    | Decided | 2025-09-10 | Ensures all theming via CSS variables.                |
| 007 | Cart feedback UX for discount/gift card                    | Decided | 2025-09-10 | Clear async states and errors.                        |
| 008 | CMS catch‑all uses `app.template` and handle heuristics    | Decided | 2025-09-10 | Avoids `templateSuffix` 404s; reliable fallback.      |

## 15) Backlog (Future Work)

- **[DX]** Husky pre-commit/pre-push (lint, typecheck, tests) + `commitlint` (Conventional Commits) + `lint-staged`.
- **[DX]** Typed env schema (`zod`) with runtime validation; secret storage on Oxygen + scheduled rotation.
- **[DX]** Dependency automation with Renovate/Dependabot; license allowlist & SPDX checks.
- **[DX]** UI-core preview with Storybook/Ladle + visual regression (Chromatic/Playwright snapshots).

- **[Perf]** Persisted GraphQL queries + ETags + SWR edge caching; cache keys by locale/brand.
- **[Perf]** Route-level code splitting; critical CSS extraction; Tailwind pruning; bundle size budgets enforced in CI.
- **[Perf]** Lighthouse CI gating for CWV (LCP/INP/CLS) with strict thresholds per route.

- **[Security]** CSP nonces + SRI + Trusted Types (opt-in); tighten Permissions-Policy, COOP/COEP, CORP.
- **[Security]** Edge rate limiting & bot protection (e.g., Cloudflare Turnstile); audit logging; PII redaction in logs.
- **[Security]** Automated SCA (npm audit/Snyk) + CodeQL security scanning + recurring pentest cadence.

- **[A11y]** axe-core CI checks; keyboard-trap tests for Dialog/Popover; focus-visible audit.

- **[i18n]** Lint rule to forbid missing/unused keys; translation completeness check in CI; in-context preview build.

- **[Analytics/Obs]** **Sentry** (errors + performance) with release health, source maps upload, alerting/ownership routing; RUM for CWV to GA4; GraphQL cost/latency dashboards.

- **[SEO]** JSON-LD (Product, Breadcrumb, FAQ); `hreflang` matrix; font/CDN preconnect & critical preload.

- **[Release]** Feature flags (Unleash/Flagsmith) with kill switches; canary deploys (% traffic) and one-click rollback.

- **[Quality / Code Smell]** SonarQube/SonarCloud quality gates on PRs (bugs/vulns/code smells, coverage); `eslint-plugin-sonarjs` + complexity thresholds; duplication & dependency-cycle checks (madge); enforce max function length/cyclomatic complexity in CI.

## 16) Ownership

- **Engineering owners:** André Daniel
- **Content/Translations owners:** André Daniel
- **Review:** changes to locales/tokens require review by André Daniel; ADRs recorded in §14.

—  
_Last updated: 2025-09-10_
