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

function copyIfExists(src: string, dest: string) {
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
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

function brandFaviconsPlugin(appDir: string, brandId: string): Plugin {
  const outDir = path.resolve(appDir, 'public');
  const srcRoot = path.resolve(appDir, `../../packages/brand-${brandId}`);
  const srcInSrc = path.resolve(srcRoot, 'src');
  const candidates = {
    svg: [path.resolve(srcRoot, 'favicon.svg'), path.resolve(srcInSrc, 'favicon.svg')],
    png: [path.resolve(srcRoot, 'favicon.png'), path.resolve(srcInSrc, 'favicon.png')],
  };
  const copy = () => {
    ensureDir(outDir);
    for (const c of candidates.svg) copyIfExists(c, path.resolve(outDir, 'favicon.svg'));
    for (const c of candidates.png) copyIfExists(c, path.resolve(outDir, 'favicon.png'));
  };
  return {
    name: 'brand-favicons',
    apply: 'serve',
    configureServer(server) {
      copy();
      server.watcher.add([...candidates.svg, ...candidates.png]);
      server.watcher.on('add', copy);
      server.watcher.on('change', copy);
    },
    buildStart() {
      copy();
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const BRAND_ID = env.BRAND_ID || process.env.BRAND_ID;
  if (!BRAND_ID)
    throw new Error('BRAND_ID is missing or invalid. Please set BRAND_ID in your env.');
  const appDir = __dirname;
  const brandSrcDir = path.resolve(appDir, `../../packages/brand-${BRAND_ID}/src`);
  const brandCssPath = path.resolve(brandSrcDir, 'styles.css');

  return {
    plugins: [
      tailwindcss(),
      hydrogen(),
      reactRouter(),
      oxygen(),
      tsconfigPaths(),
      brandEntryPlugin(appDir, BRAND_ID),
      brandFaviconsPlugin(appDir, BRAND_ID),
    ],
    resolve: {
      alias: [
        { find: '@', replacement: r('app') },
        { find: /^@nuvens\/brand-ui\/styles\.css\?url$/, replacement: `${brandCssPath}?url` },
        { find: /^@nuvens\/brand-ui\/styles\.css$/, replacement: brandCssPath },
        { find: '@nuvens/brand-ui', replacement: r('app/brand-ui.generated.ts') },
        { find: '@nuvens/core', replacement: r('../../packages/core/src') },
        { find: '@nuvens/ui', replacement: r('../../packages/ui/src') },
        { find: '@nuvens/shopify', replacement: r('../../packages/shopify/src') },
      ],
      dedupe: ['react', 'react-dom', 'i18next', 'react-i18next'],
    },
    server: {
      fs: { allow: [r('.'), r('app'), r('../../packages'), r('../..')] },
    },
    build: { assetsInlineLimit: 0 },
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
        '@shopify/hydrogen',
      ],
    },
    ssr: {
      optimizeDeps: {
        include: ['path-to-regexp', 'html-parse-stringify', 'void-elements', '@shopify/hydrogen'],
      },
      noExternal: [
        '@nuvens/brand-ui',
        '@nuvens/core',
        '@nuvens/shopify',
        '@nuvens/ui',
        '@radix-ui/react-dialog',
        '@radix-ui/react-dropdown-menu',
        '@shopify/hydrogen',
        'keen-slider',
      ],
    },
  };
});
