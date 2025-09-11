import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRouteLoaderData } from 'react-router';
import type { RootLoader } from '~/root';

export default function I18nBridge() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const data = useRouteLoaderData<RootLoader>('root') as any;

  const lang = String(data?.i18n?.locale || i18n.language || 'en').toLowerCase();
  const resources = (data?.i18n?.resources ?? {}) as Record<string, any>;

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
