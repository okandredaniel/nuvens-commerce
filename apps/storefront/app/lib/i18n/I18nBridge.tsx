import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRouteLoaderData } from 'react-router';
import type { RootLoader } from '~/root';
import { toLang } from './localize';

function pickBundles(resources: Record<string, any>, lang: string) {
  const out: Record<string, any> = {};
  for (const [ns, bundle] of Object.entries(resources || {})) {
    const v = bundle && typeof bundle === 'object' ? bundle : {};
    out[ns] = v[lang] && typeof v[lang] === 'object' ? v[lang] : v;
  }
  return out;
}

export default function I18nBridge() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const data = useRouteLoaderData<RootLoader>('root') as any;

  const lang = toLang(data?.i18n?.locale || i18n.language || 'en');
  const raw = (data?.i18n?.resources ?? {}) as Record<string, any>;
  const bundles = pickBundles(raw, lang);

  useEffect(() => {
    if (!lang) return;
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    if (document.documentElement.lang !== lang) document.documentElement.lang = lang;
    for (const [ns, bundle] of Object.entries(bundles)) {
      if (!bundle) continue;
      i18n.addResourceBundle(lang, ns, bundle, true, true);
    }
  }, [pathname, lang, i18n, bundles]);

  return null;
}
