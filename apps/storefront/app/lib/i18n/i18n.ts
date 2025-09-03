import type { I18nBase } from '@shopify/hydrogen';

export interface I18nLocale extends I18nBase {
  pathPrefix: string;
}

export type Resources = Record<string, Record<string, unknown>>;
export type I18nShape = { defaultLocale?: string; resources: Resources };

export const toLang = (tag?: string) => (tag?.split?.('-')[0] ?? 'en').toLowerCase();

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
  const def = toLang(src.defaultLocale ?? 'en');
  return src.resources[locale] ?? src.resources[lang] ?? src.resources[def] ?? {};
}

export function mergeResources(locale: string, ...shapes: Array<I18nShape | null | undefined>) {
  return shapes.reduce((acc, s) => mergeDeep(acc, pickResources(s, locale)), {});
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const seg = url.pathname.split('/').filter(Boolean)[0] ?? '';

  let pathPrefix = '';
  let language: I18nLocale['language'] = 'EN';
  let country: I18nLocale['country'] = 'US';

  if (/^[A-Za-z]{2}(-[A-Za-z]{2})?$/.test(seg)) {
    pathPrefix = '/' + seg.toLowerCase();
    if (seg.includes('-')) {
      const [lang, ctry] = seg.split('-');
      language = lang.toUpperCase() as I18nLocale['language'];
      country = ctry.toUpperCase() as I18nLocale['country'];
    } else {
      language = seg.toUpperCase() as I18nLocale['language'];
    }
  }

  return { language, country, pathPrefix };
}
