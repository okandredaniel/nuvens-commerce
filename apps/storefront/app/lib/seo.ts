import { brandDefaultLocale, brandLocales } from '@nuvens/brand-ui';
import { stripLocale } from '@nuvens/core';
import { toLang } from '@nuvens/shopify';

const DEFAULT_LANG = toLang(brandDefaultLocale);

const SUPPORTED_CODES: string[] = Array.from(new Set((brandLocales ?? []).map((l) => toLang(l))));

const TRACKING = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
]);

function normalizeRoot(path: string) {
  if (path === '/_root' || path === '/index' || path === '/.') return '/';
  return path || '/';
}

export function normalizePath(pathname: string, defaultLang: string = DEFAULT_LANG) {
  const p = normalizeRoot(pathname || '/');
  const rgx = new RegExp(`^/${toLang(defaultLang)}(?:-[a-z]{2})?`, 'i');
  return p.replace(rgx, '') || '/';
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
  defaultLang?: string,
) {
  const def = defaultLang ? toLang(defaultLang) : DEFAULT_LANG;
  const path = normalizePath(pathname, def);
  const q = sanitizeSearch(search);
  return `${base.replace(/\/$/, '')}${path}${q}`;
}

export function buildHreflangs(
  base: string,
  pathname: string,
  search: string,
  defaultLang?: string,
) {
  const def = defaultLang ? toLang(defaultLang) : DEFAULT_LANG;
  const baseClean = base.replace(/\/$/, '');
  const q = sanitizeSearch(search);

  const withoutAnyLocale = stripLocale(normalizeRoot(pathname)).path;
  const resourcePath = withoutAnyLocale === '/' ? '' : withoutAnyLocale;

  const codes = SUPPORTED_CODES.length ? SUPPORTED_CODES : [def];

  const list = codes.map((code) => {
    const href =
      code === def ? `${baseClean}${resourcePath}${q}` : `${baseClean}/${code}${resourcePath}${q}`;
    return { hrefLang: code, href };
  });

  const xDefault = { hrefLang: 'x-default', href: `${baseClean}${resourcePath}${q}` };
  return [...list, xDefault];
}

export function buildMetaLinks(base: string, pathname: string, search: string) {
  const canonical = buildCanonical(base, pathname, search);
  const alts = buildHreflangs(base, pathname, search);
  return [
    { tagName: 'link', rel: 'canonical', href: canonical },
    ...alts.map((a) => ({ tagName: 'link', rel: 'alternate', hrefLang: a.hrefLang, href: a.href })),
  ];
}
