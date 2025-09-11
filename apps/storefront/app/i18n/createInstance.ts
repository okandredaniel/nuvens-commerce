import { createInstance, type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

export function createI18n(locale: string, resources: Record<string, any>): i18n {
  const ns = Object.keys(resources || {});
  const defaultNS = ns.includes('common') ? 'common' : ns[0] || 'common';

  const instance = createInstance();

  instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: false,
    ns,
    defaultNS,
    fallbackNS: undefined,
    resources: { [locale]: resources },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    debug:
      typeof import.meta !== 'undefined'
        ? !!import.meta.env?.DEV
        : process.env.NODE_ENV !== 'production',
    parseMissingKeyHandler: (key) => `⟦MISSING:${key}⟧`,
  });

  instance.on('missingKey', (_lngs, ns, key) => {
    if (typeof console !== 'undefined') {
      console.warn(`[i18n] missing key → ${ns}:${key}`);
    }
  });

  return instance;
}
