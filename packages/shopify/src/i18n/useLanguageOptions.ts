import { useLocation, useRouteLoaderData } from 'react-router';
import { type LanguageOption } from '../components/header';
import { useShopifyAdapter } from '../shopify-adapter';
import { toLang } from './localize';

const replaceLangInPath = (pathname: string, target: string, defaultLang: string) => {
  const segs = pathname.split('/').filter(Boolean);
  const hasPrefix = /^[a-z]{2}$/i.test(segs[0] ?? '');
  if (target === defaultLang) return hasPrefix ? `/${segs.slice(1).join('/')}` : pathname;
  if (hasPrefix) {
    segs[0] = target;
    return `/${segs.join('/')}`;
  }
  return `/${target}${pathname === '/' ? '' : pathname}`;
};

export function useLanguageOptions() {
  const { defaultLocale, locales } = useShopifyAdapter();
  const data = useRouteLoaderData('root') as unknown as {
    languages?: LanguageOption[];
  };
  const { pathname, search } = useLocation();
  const defaultLang = toLang(String(defaultLocale));
  const current = toLang(pathname.split('/').filter(Boolean)[0]);

  const provided = data?.languages;
  if (provided && provided.length > 0)
    return {
      options: provided,
      current,
    };

  const options: LanguageOption[] = locales.map((code) => {
    const iso = toLang(String(code));
    return {
      isoCode: iso,
      href: replaceLangInPath(pathname, iso, defaultLang) + (search || ''),
      label: iso.toUpperCase(),
    };
  });

  return {
    options,
    current,
  };
}
