import { brandDefaultLocale } from '@nuvens/brand-ui';

export const toLang = (tag?: string) => (tag?.split?.('-')[0] || brandDefaultLocale).toLowerCase();

const isExternal = (to: string) =>
  /^https?:\/\//i.test(to) || to.startsWith('mailto:') || to.startsWith('tel:');

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
  const lang = toLang(currentLang);
  if (typeof to === 'string') {
    if (isExternal(to)) return to;
    const { path, suffix } = splitHref(to);
    const base = stripLeadingLang(normalizePath(path));
    const localized =
      lang === brandDefaultLocale ? base : base === '/' ? `/${lang}` : `/${lang}${base}`;
    return `${localized}${suffix}`;
  }
  const base = stripLeadingLang(normalizePath(to.pathname ?? '/'));
  const pathname =
    lang === brandDefaultLocale ? base : base === '/' ? `/${lang}` : `/${lang}${base}`;
  return { ...to, pathname };
}

export const localizeHref = localizeTo;
export { isExternal };
