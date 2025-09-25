import type { I18nBundle } from '@nuvens/core';
import { getShopifyAdapter } from '../adapter';
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
  const { defaultLocale } = getShopifyAdapter();
  const want = toLang(lang);
  const wantBase = want.split('-')[0];
  const def = defaultLocale ? toLang(defaultLocale) : null;
  const defBase = def ? def.split('-')[0] : null;

  const mods =
    sources ??
    import.meta.glob('../../../../packages/brand-*/src/**/*.i18n.{ts,js}', { eager: true });

  const out: Record<string, any> = {};
  for (const [, mod] of Object.entries(mods)) {
    const bundle = asBundle(mod);
    if (!bundle) continue;
    const bag = bundle.resources as Record<string, Record<string, any> | undefined>;

    const candidate =
      bag[want] ??
      bag[wantBase] ??
      (def ? bag[def] : undefined) ??
      (defBase ? bag[defBase] : undefined);

    if (!candidate || typeof candidate !== 'object' || Object.keys(candidate).length === 0)
      continue;

    out[bundle.ns] = { ...(out[bundle.ns] || {}), ...candidate };
  }
  return out;
}

export function loadBrandLocaleDictionaries(language: string) {
  const { defaultLocale } = getShopifyAdapter();
  const out: Record<string, Record<string, any>> = {};
  const mods = import.meta.glob('../../../../packages/brand-*/src/i18n/locales/*/index.{ts,js}', {
    eager: true,
  });
  const want = toLang(language).split('-')[0];
  const fallback = defaultLocale ? toLang(defaultLocale).split('-')[0] : null;

  for (const [path, mod] of Object.entries(mods)) {
    const m = (mod as any).default as Record<string, any> | undefined;
    if (!m) continue;
    const match = path.match(/locales\/([^/]+)\/index\.(?:ts|js)$/);
    if (!match) continue;
    const lang = toLang(match[1]).split('-')[0];
    if (lang !== want && lang !== fallback) continue;
    for (const [ns, dict] of Object.entries(m)) {
      if (!dict || typeof dict !== 'object' || Object.keys(dict).length === 0) continue;
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
