import type { To } from 'react-router';
import { brandDefaultLocale } from '@nuvens/brand-ui';

export const toLang = (tag?: string) => (tag?.split?.('-')[0] ?? '').toLowerCase();

const isExternal = (to: string) =>
  /^https?:\/\//i.test(to) || to.startsWith('mailto:') || to.startsWith('tel:');

const hasLangPrefix = (path: string) => /^\/[a-z]{2}(?:\/|$)/i.test(path);

function stripDefaultPrefix(path: string, defaultLang: string) {
  const m = path.match(/^\/([a-z]{2})(?:\/|$)/i);
  if (!m) return path;
  const seg = m[1].toLowerCase();
  if (seg !== defaultLang) return path;
  const rest = path.slice(m[0].length - (path.endsWith('/') && m[0].endsWith('/') ? 1 : 0));
  return rest ? `/${rest}` : '/';
}

export function localizeStringHref(to: string, currentLang?: string) {
  if (!to) return '/';
  if (isExternal(to) || to.startsWith('#')) return to;

  const path = to.startsWith('/') ? to : `/${to}`;
  const lang = toLang(currentLang);
  const defaultLang = toLang(String(brandDefaultLocale));

  if (hasLangPrefix(path)) {
    return stripDefaultPrefix(path, defaultLang);
  }

  if (!lang || lang === defaultLang) return path;

  return path === '/' ? `/${lang}` : `/${lang}${path}`;
}

export function localizeTo(to: To, currentLang?: string): To {
  if (typeof to === 'string') return localizeStringHref(to, currentLang);
  const pathname = localizeStringHref(to.pathname ?? '/', currentLang);
  return { ...to, pathname };
}

export const localizeHref = localizeTo;
export { isExternal };
