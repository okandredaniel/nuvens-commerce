import type { I18nBundle, Language } from '@nuvens/core';

const toLang = (tag?: string) => (tag?.slice(0, 2) || 'en').toLowerCase();

function asBundle(m: unknown): I18nBundle | null {
  const b = (m as any)?.default ?? m;
  if (!b) return null;
  if (typeof (b as any).ns !== 'string') return null;
  if (!(b as any).resources || typeof (b as any).resources !== 'object') return null;
  return b as I18nBundle;
}

export function getAppResources(lang: string) {
  const l = toLang(lang);
  const outside = import.meta.glob('../../locales/*/index.{ts,js}', { eager: true });
  const inside = import.meta.glob('../locales/*/index.{ts,js}', { eager: true });
  const mods = {
    ...outside,
    ...inside,
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
      out[ns] = {
        ...(out[ns] || {}),
        ...(dict as Record<string, any>),
      };
    }
  }
  return out;
}

export function getBrandBundleResources(lang: string) {
  const l = toLang(lang) as Language;
  const brandMods = import.meta.glob('../../../../packages/brand-*/src/**/*.i18n.{ts,js}', {
    eager: true,
  });

  const out: Record<string, any> = {};
  for (const [, mod] of Object.entries(brandMods)) {
    const bundle = asBundle(mod);
    if (!bundle) continue;
    const bag = bundle.resources as Partial<Record<Language, Record<string, any>>>;
    const dict = bag[l] || bag['en' as Language] || {};
    if (!dict || typeof dict !== 'object') continue;
    out[bundle.ns] = {
      ...(out[bundle.ns] || {}),
      ...dict,
    };
  }
  return out;
}
