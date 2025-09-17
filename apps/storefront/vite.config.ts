import { reactRouter } from '@react-router/dev/vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const r = (p: string) => path.resolve(__dirname, p);

function normalizeForTs(fromFile: string, toAbsPath: string) {
  let rel = path.relative(path.dirname(fromFile), toAbsPath);
  if (path.sep === '\\') rel = rel.replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function brandEntryPlugin(appDir: string, brandId: string): Plugin {
  const entryPath = path.resolve(appDir, 'app/brand-ui.generated.ts');
  const target = path.resolve(appDir, `../../packages/brand-${brandId}/src`);
  const content = `export * from '${normalizeForTs(entryPath, target)}';\n`;
  return {
    name: 'brand-entry',
    apply: 'serve',
    configResolved() {
      ensureDir(path.dirname(entryPath));
      fs.writeFileSync(entryPath, content, 'utf8');
    },
    buildStart() {
      ensureDir(path.dirname(entryPath));
      fs.writeFileSync(entryPath, content, 'utf8');
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const BRAND_ID = env.BRAND_ID || process.env.BRAND_ID;
  if (!BRAND_ID)
    throw new Error('BRAND_ID is missing or invalid. Please set BRAND_ID in your env.');
  const appDir = __dirname;

  return {
    plugins: [
      tailwindcss(),
      hydrogen(),
      oxygen(),
      reactRouter(),
      tsconfigPaths(),
      brandEntryPlugin(appDir, BRAND_ID),
    ],
    resolve: {
      alias: {
        '@': r('app'),
        '@lib': r('app/lib'),
        '@server': r('app/server'),
        '@nuvens/brand-ui': r('app/brand-ui.generated.ts'),
        '@nuvens/core': r('../../packages/core/src'),
        '@nuvens/ui': r('../../packages/ui/src'),
      },
      dedupe: ['react', 'react-dom', 'i18next', 'react-i18next'],
    },
    server: {
      fs: {
        allow: [r('.'), r('app'), r('../../packages'), r('../..')],
      },
    },
    build: {
      assetsInlineLimit: 0,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-i18next',
        'i18next',
        'html-parse-stringify',
        'void-elements',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        'keen-slider',
      ],
    },
    ssr: {
      optimizeDeps: {
        include: ['path-to-regexp', 'html-parse-stringify', 'void-elements'],
      },
      noExternal: [
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@nuvens/core',
        '@nuvens/ui',
        '@nuvens/brand-ui',
        'keen-slider',
      ],
    },
  };
});
