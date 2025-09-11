## Requirements

- **Node:** ≥ 18.x (LTS recommended)
- **pnpm:** ≥ 8.x
- **Shopify CLI:** v3+ (`npm i -g @shopify/cli`)
- **Shopify Storefront API** credentials
- **Git** (for subcommands & hooks)

> Hosting/Runtime: **Shopify Oxygen** (edge workers)

---

## Quick Start

0. **Login to Shopify (once per machine)**

```bash
shopify login --store your-store.myshopify.com
```

1. **Install deps**

```bash
pnpm install
```

2. **Configure environment**

Create `apps/storefront/.env` (or `.env.local`) with:

```bash
BRAND_ID=zippex
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_ID=gid://shopify/Storefront/<id>
PUBLIC_STOREFRONT_API_TOKEN=xxx
PUBLIC_CHECKOUT_DOMAIN=your-store.myshopify.com
FOOTER_MENU_HANDLE=footer
```

> These are injected into the Hydrogen runtime; Oxygen manages prod/staging variables.

3. **Run dev**

- From the repo root (Turborepo orchestrated):

```bash
pnpm dev
```

- Or just the app:

```bash
pnpm --filter ./apps/storefront dev
```

Open the URL Remix prints (typically `http://localhost:3000`).

---

## Scripts (Common)

At the **repo root**:

```bash
pnpm dev                 # Start app in dev (and any watched packages)
pnpm build               # Build everything via Turborepo
pnpm lint                # ESLint
pnpm typecheck           # TypeScript
pnpm test                # Unit tests (Vitest)
pnpm e2e                 # E2E (Playwright), if configured
pnpm locale:add          # Add a new i18n namespace (see i18n section)
```

---

## Internationalization (i18n)

- **Libraries:** `i18next` + `react-i18next`
- **Locales:** `en`, `pt`, `es`, `fr`, `it`
- **Policy:** no silent fallbacks (missing keys should surface)
- **URL locale** (first segment) takes precedence; else uses `storefront.i18n.language`
- App merges **core** and **brand** resources in the root loader before rendering.

**Add translation namespaces**

```bash
pnpm locale:add
# runs: node scripts/add-locale-namespace.mjs
# guided prompts to create <namespace>.json for active locales
```

---

## UI

Available from `@nuvens/ui`:

```
Aside.tsx
Badge.tsx
Button.tsx
Card.tsx
Checkbox.tsx
Container.tsx
Heading.tsx
IconButton.tsx
Input.tsx
Label.tsx
Link.tsx
Sheet.tsx
Stepper.tsx
Textarea.tsx
Tooltip.tsx
dialog/      # dialog primitives
dropdown/    # dropdown primitives
index.ts     # public exports
```

Utilities: `tokensToCssVars`, token types, `cn` (tailwind-merge aware)

> `cn` ensures **caller `className` wins** over default styles.
