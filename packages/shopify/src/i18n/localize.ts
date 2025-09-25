import { Language } from '@nuvens/core';
import { getShopifyAdapter } from '../adapter';

export const isExternal = (href: string): boolean => {
  if (!href) return false;
  const s = href.trim();
  const l = s.toLowerCase();
  if (l.startsWith('#')) return true;
  if (
    l.startsWith('mailto:') ||
    l.startsWith('tel:') ||
    l.startsWith('data:') ||
    l.startsWith('blob:') ||
    l.startsWith('javascript:') ||
    l.startsWith('ftp:')
  )
    return true;
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) return true;
  if (s.startsWith('//')) return true;
  return false;
};

const splitHref = (s: string) => {
  const i = s.search(/[?#]/);
  return i === -1 ? { path: s, suffix: '' } : { path: s.slice(0, i), suffix: s.slice(i) };
};

const stripLeadingLang = (path: string) => path.replace(/^\/[a-z]{2}(?=\/|$)/i, '') || '/';

const normalizePath = (p: string) =>
  ('/' + (p || '/')).replace(/^\/+/, '/').replace(/\/{2,}/g, '/');

export function localizeTo(
  to: import('react-router').To,
  currentLang?: string,
): import('react-router').To {
  const adapterDefault = toLang(getShopifyAdapter().defaultLocale || Language.English);
  const lang = toLang(currentLang || adapterDefault);
  if (typeof to === 'string') {
    if (isExternal(to)) return to;
    const { path, suffix } = splitHref(to);
    const base = stripLeadingLang(normalizePath(path));
    const localized =
      lang === adapterDefault ? base : base === '/' ? `/${lang}` : `/${lang}${base}`;
    return `${localized}${suffix}`;
  }
  const base = stripLeadingLang(normalizePath(to.pathname ?? '/'));
  const pathname = lang === adapterDefault ? base : base === '/' ? `/${lang}` : `/${lang}${base}`;
  return { ...to, pathname };
}

export const toLang = (tag?: string) => {
  const t = String(tag ?? '')
    .trim()
    .toLowerCase();
  const base = t.split('-')[0];
  return base || Language.English;
};

export const localizeHref = localizeTo;
