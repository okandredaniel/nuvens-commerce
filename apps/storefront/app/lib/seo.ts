import { brandDefaultLocale, brandLocales } from '@nuvens/brand-ui';

const TRACKING = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
]);

export function normalizePath(pathname: string, defaultLang: string) {
  const rgx = new RegExp(`^/${defaultLang}(?:-[a-z]{2})?`, 'i');
  return pathname.replace(rgx, '') || '/';
}

export function sanitizeSearch(search: string) {
  if (!search || search === '?') return '';
  const p = new URLSearchParams(search);
  for (const k of Array.from(p.keys())) if (TRACKING.has(k)) p.delete(k);
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function buildCanonical(
  base: string,
  pathname: string,
  search: string,
  defaultLang = brandDefaultLocale.toLowerCase(),
) {
  const path = normalizePath(pathname, defaultLang);
  const q = sanitizeSearch(search);
  return `${base.replace(/\/$/, '')}${path}${q}`;
}

export function buildHreflangs(
  base: string,
  pathname: string,
  search: string,
  defaultLang = brandDefaultLocale.toLowerCase(),
) {
  const pathNoDefault = normalizePath(pathname, defaultLang);
  const q = sanitizeSearch(search);
  const baseClean = base.replace(/\/$/, '');
  const list = brandLocales.map((l) => {
    const lang = l.toLowerCase();
    const href =
      lang === defaultLang
        ? `${baseClean}${pathNoDefault}${q}`
        : `${baseClean}/${lang}${pathNoDefault}${q}`;
    return {
      hrefLang: lang,
      href,
    };
  });
  const xDefault = {
    hrefLang: 'x-default',
    href: `${baseClean}${pathNoDefault}${q}`,
  };
  return [...list, xDefault];
}

export function buildMetaLinks(base: string, pathname: string, search: string) {
  const canonical = buildCanonical(base, pathname, search);
  const alts = buildHreflangs(base, pathname, search);
  return [
    {
      tagName: 'link',
      rel: 'canonical',
      href: canonical,
    },
    ...alts.map((a) => ({
      tagName: 'link',
      rel: 'alternate',
      hrefLang: a.hrefLang,
      href: a.href,
    })),
  ];
}
