import { brandDefaultLocale } from '@nuvens/brand-ui';
import type { To } from 'react-router';

export const toLang = (tag?: string) =>
  (tag?.split?.('-')[0] || String(brandDefaultLocale) || 'en').toLowerCase();

const isExternal = (to: string) =>
  /^https?:\/\//i.test(to) || to.startsWith('mailto:') || to.startsWith('tel:');

const getLangPrefix = (path: string) => {
  const m = path.match(/^\/([a-z]{2})(?=\/|$)/i);
  return m ? m[1].toLowerCase() : undefined;
};

const stripLeadingLang = (path: string) => path.replace(/^\/[a-z]{2}(?=\/|$)/i, '') || '/';

function localizeStringHref(href: string, currentLang?: string) {
  if (!href || isExternal(href)) return href;
  const defaultLang = toLang(String(brandDefaultLocale));
  const lang = toLang(currentLang) || defaultLang;

  const existing = getLangPrefix(href);
  if (existing) {
    const rest = stripLeadingLang(href);
    if (existing === lang) {
      return lang === defaultLang ? rest : href;
    }
    return lang === defaultLang ? rest : rest === '/' ? `/${lang}` : `/${lang}${rest}`;
  }

  return lang === defaultLang ? href : href === '/' ? `/${lang}` : `/${lang}${href}`;
}

export function localizeTo(to: To, currentLang?: string): To {
  if (typeof to === 'string') return localizeStringHref(to, currentLang);
  const pathname = localizeStringHref(to.pathname ?? '/', currentLang);
  return {
    ...to,
    pathname,
  };
}

export const localizeHref = localizeTo;
export { isExternal };
