import { brandDefaultLocale } from '@nuvens/brand-ui';
import type { I18nBundle, Language } from '@nuvens/core';
import { toLang } from './localize';

function asBundle(m: unknown): I18nBundle | null {
  const b = (m as any)?.default ?? m;
  if (!b) return null;
  if (typeof (b as any).ns !== 'string') return null;
  if (!(b as any).resources || typeof (b as any).resources !== 'object') return null;
  return b as I18nBundle;
}

export function loadAppDictionaries(lang: string, sources?: Record<string, unknown>) {
  const l = toLang(lang);
  const mods = sources ?? {
    ...import.meta.glob('../../locales/*/index.{ts,js}', { eager: true }),
    ...import.meta.glob('../locales/*/index.{ts,js}', { eager: true }),
  };

  const out: Record<string, any> = {};
  for (const [p, mod] of Object.entries(mods)) {
    const bag = (mod as any)?.default ?? mod;
    if (!bag || typeof bag !== 'object') continue;
    const m = p.match(/\/locales\/([a-z]{2})\//i);
    const code = (m?.[1] || '').toLowerCase();
    if (code && code !== l) continue;
    for (const [ns, dict] of Object.entries(bag)) {
      if (!dict || typeof dict !== 'object') continue;
      out[ns] = { ...(out[ns] || {}), ...(dict as Record<string, any>) };
    }
  }
  return out;
}

export function loadBrandBundleDictionaries(lang: string, sources?: Record<string, unknown>) {
  const l = toLang(lang) as Language;
  const mods =
    sources ??
    import.meta.glob('../../../../packages/brand-*/src/**/*.i18n.{ts,js}', { eager: true });

  const out: Record<string, any> = {};
  for (const [, mod] of Object.entries(mods)) {
    const bundle = asBundle(mod);
    if (!bundle) continue;
    const bag = bundle.resources as Partial<Record<Language, Record<string, any>>>;
    const dict = bag[l] || bag[brandDefaultLocale as Language] || {};
    if (!dict || typeof dict !== 'object') continue;
    out[bundle.ns] = { ...(out[bundle.ns] || {}), ...dict };
  }
  return out;
}

export function loadBrandLocaleDictionaries(language: string) {
  const out: Record<string, Record<string, any>> = {};
  const mods = import.meta.glob('../../../../packages/brand-*/src/i18n/locales/*/index.{ts,js}', {
    eager: true,
  });
  const want = toLang(language).split('-')[0];
  const fallback = brandDefaultLocale.split('-')[0];

  for (const [path, mod] of Object.entries(mods)) {
    const m = (mod as any).default as Record<string, any> | undefined;
    if (!m) continue;
    const match = path.match(/locales\/([^/]+)\/index\.(?:ts|js)$/);
    if (!match) continue;
    const lang = match[1].split('-')[0];
    if (lang !== want && lang !== fallback) continue;
    for (const [ns, dict] of Object.entries(m)) {
      out[ns] = out[ns] || {};
      Object.assign(out[ns], dict as object);
    }
  }
  return out;
}

export function loadBrandDictionaries(language: string, bundleSources?: Record<string, unknown>) {
  const localeJson = loadBrandLocaleDictionaries(language);
  const bundles = loadBrandBundleDictionaries(language, bundleSources);
  const namespaces = new Set([...Object.keys(localeJson), ...Object.keys(bundles)]);
  const merged: Record<string, any> = {};
  for (const ns of namespaces) {
    merged[ns] = { ...(localeJson as any)[ns], ...(bundles as any)[ns] };
  }
  return merged;
}
