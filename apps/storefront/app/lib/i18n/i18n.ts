import { Language } from '@nuvens/ui-core';
import { brandCountryByLocale, brandDefaultLocale, brandLocales } from '@nuvens/brand-ui';
import type { I18nBase } from '@shopify/hydrogen';

export interface I18nLocale extends I18nBase {
  pathPrefix: string;
}

export type Resources = Record<string, Record<string, unknown>>;
export type I18nShape = { defaultLocale?: string; resources: Resources };

export const toLang = (tag?: string) => (tag?.split?.('-')[0] ?? Language.English).toLowerCase();

const isPlain = (v: unknown): v is Record<string, unknown> =>
  !!v && Object.prototype.toString.call(v) === '[object Object]';

export function mergeDeep<A extends Record<string, unknown>, B extends Record<string, unknown>>(
  a: A,
  b: B,
) {
  const out: Record<string, unknown> = { ...a };
  for (const k of Object.keys(b)) {
    const av = (a as any)[k];
    const bv = (b as any)[k];
    out[k] = isPlain(av) && isPlain(bv) ? mergeDeep(av, bv) : bv;
  }
  return out as A & B;
}

export function pickResources(src: I18nShape | null | undefined, locale: string) {
  if (!src) return {};
  const lang = toLang(locale);
  const def = toLang(src.defaultLocale ?? brandDefaultLocale);
  return src.resources[locale] ?? src.resources[lang] ?? src.resources[def] ?? {};
}

export function mergeResources(locale: string, ...shapes: Array<I18nShape | null | undefined>) {
  return shapes.reduce((acc, s) => mergeDeep(acc, pickResources(s, locale)), {});
}

const SUPPORTED = new Set(brandLocales.map((l) => l.toLowerCase()));

function resolveCountry(lang: string): I18nBase['country'] {
  const lc = lang.toLowerCase() as Language;
  return (brandCountryByLocale[lc] || 'US').toUpperCase() as I18nBase['country'];
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const seg = url.pathname.split('/').filter(Boolean)[0] ?? '';
  const re = /^[A-Za-z]{2}(?:-[A-Za-z]{2})?$/;

  if (re.test(seg)) {
    const lower = seg.toLowerCase();
    if (lower.includes('-')) {
      const [l, c] = lower.split('-');
      return {
        language: l.toUpperCase() as I18nBase['language'],
        country: c.toUpperCase() as I18nBase['country'],
        pathPrefix: '/' + lower,
      };
    }
    const lang = SUPPORTED.has(lower) ? lower : brandDefaultLocale.toLowerCase();
    const country = resolveCountry(lang);
    return {
      language: lang.toUpperCase() as I18nBase['language'],
      country,
      pathPrefix: '/' + lang,
    };
  }

  const defLang = brandDefaultLocale.toLowerCase();
  const defCountry = resolveCountry(defLang);
  return {
    language: defLang.toUpperCase() as I18nBase['language'],
    country: defCountry,
    pathPrefix: '',
  };
}
