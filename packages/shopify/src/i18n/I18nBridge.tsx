import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRouteLoaderData } from 'react-router';
import { useShopifyAdapter } from '../adapter';

export function I18nBridge() {
  const { defaultLocale } = useShopifyAdapter();
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const data = useRouteLoaderData('root') as any;

  const lang = useMemo(
    () => String(data?.i18n?.locale || i18n.language || defaultLocale).toLowerCase(),
    [data?.i18n?.locale, defaultLocale, i18n.language],
  );

  const resources = useMemo(
    () => (data?.i18n?.resources ?? {}) as Record<string, any>,
    [data?.i18n?.resources],
  );

  useEffect(() => {
    if (!lang) return;
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
    for (const [ns, bundle] of Object.entries(resources)) {
      if (!bundle) continue;
      i18n.addResourceBundle(lang, ns, bundle, true, true);
    }
  }, [pathname, lang, i18n, resources]);

  return null;
}
