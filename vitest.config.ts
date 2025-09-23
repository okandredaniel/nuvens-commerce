import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, type PluginOption } from 'vite';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const r = (p: string) => path.resolve(__dirname, p);

function normalizeForTs(fromFile: string, toAbsPath: string) {
  let rel = path.relative(path.dirname(fromFile), toAbsPath);
  if (path.sep === '\\') rel = rel.replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

const mode = process.env.MODE || process.env.NODE_ENV || 'test';
const env = loadEnv(mode, r('./apps/storefront'), '');
for (const k of Object.keys(env)) {
  if (process.env[k] === undefined) process.env[k] = env[k];
}

if (!process.env.BRAND_ID) {
  throw new Error('Missing BRAND_ID. Add it to apps/storefront/.env or export it in your shell.');
}

const isCI = process.env.CI === 'true' || !!process.env.GITHUB_ACTIONS;

const brandSrcDir = r(`./packages/brand-${process.env.BRAND_ID}/src`);
const brandEntryPath = r('./apps/storefront/app/brand-ui.generated.ts');

const stubRemixBuild = {
  name: 'stub-remix-build-virtual',
  resolveId(id: string) {
    if (id === 'virtual:react-router/server-build') return '\0remix-build-stub';
    return null;
  },
  load(id: string) {
    if (id === '\0remix-build-stub') return 'export default {}';
    return null;
  },
} satisfies PluginOption;

const brandEntryForVitest = {
  name: 'brand-entry-for-vitest',
  enforce: 'pre' as const,
  configResolved() {
    fs.mkdirSync(path.dirname(brandEntryPath), { recursive: true });
    const content = `export * from '${normalizeForTs(brandEntryPath, brandSrcDir)}';\n`;
    fs.writeFileSync(brandEntryPath, content, 'utf8');
  },
  buildStart() {
    fs.mkdirSync(path.dirname(brandEntryPath), { recursive: true });
    const content = `export * from '${normalizeForTs(brandEntryPath, brandSrcDir)}';\n`;
    fs.writeFileSync(brandEntryPath, content, 'utf8');
  },
} satisfies PluginOption;

const brandCssVirtual = {
  name: 'brand-css-virtual',
  enforce: 'pre' as const,
  resolveId(id: string) {
    if (/^@nuvens\/brand-ui\/styles\.css(\?.*)?$/.test(id)) return '\0brand-css-stub';
    return null;
  },
  load(id: string) {
    if (id === '\0brand-css-stub') return 'export default ""';
    return null;
  },
} satisfies PluginOption;

export default defineConfig({
  plugins: [stubRemixBuild, brandEntryForVitest, brandCssVirtual],
  resolve: {
    alias: [
      { find: '@', replacement: r('./apps/storefront/app/') },
      { find: '@nuvens/core', replacement: r('./packages/core/src') },
      { find: '@nuvens/shopify', replacement: r('./packages/shopify/src') },
      { find: '@nuvens/ui', replacement: r('./packages/ui/src') },
      { find: /^@nuvens\/brand-ui$/, replacement: brandEntryPath },
    ],
    dedupe: ['react', 'react-dom', 'i18next', 'react-i18next'],
  },
  test: {
    include: [
      'apps/storefront/**/*.{test,spec}.{ts,tsx}',
      'packages/core/**/*.{test,spec}.{ts,tsx}',
      'packages/ui/**/*.{test,spec}.{ts,tsx}',
      'packages/brand-*/**/*.{test,spec}.{ts,tsx}',
    ],
    environment: 'node',
    environmentMatchGlobs: [
      ['apps/storefront/**', 'jsdom'],
      ['packages/ui/**', 'jsdom'],
      ['packages/brand-*/**', 'jsdom'],
      ['packages/core/**', 'node'],
    ],
    setupFiles: ['apps/storefront/vitest.setup.ts', 'packages/ui/vitest.setup.ts'],
    globals: true,
    reporters: isCI ? ['dot'] : ['default'],
    coverage: {
      provider: 'v8',
      reporter: isCI ? ['text-summary', 'lcov', 'json'] : ['text', 'lcov', 'html', 'json'],
      reportsDirectory: 'coverage',
      all: true,
      include: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/*.d.ts',
        '**/*.interface.ts',
        '**/*.types.ts',
        '**/*.test.{ts,tsx}',
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/*.stories.{ts,tsx}',
        '**/vitest.setup.{ts,tsx}',
        '**/test-utils/**',
        '**/mocks/**',
        '**/fixtures/**',
        '**/vite.config.{ts,js,mjs,cjs}',
        '**/tailwind.config.{ts,js}',
        '**/postcss.config.{ts,js}',
        '**/eslint.config.{js,ts,cjs,mjs}',
        '**/*.generated.{ts,tsx}',
        '**/build/**',
        '**/dist/**',
        '**/coverage/**',
        '**/.*/**',
      ],
      thresholds: {
        perFile: true,
        lines: 80,
        branches: 70,
        functions: 80,
        statements: 80,
      },
      reportOnFailure: true,
    },
  },
});
