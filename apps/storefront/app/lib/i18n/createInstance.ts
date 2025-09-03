import { createInstance, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

export function createI18n(locale: string, resources: Record<string, any>): i18n {
  const ns = Object.keys(resources || {});
  const defaultNS = ns.includes('common') ? 'common' : ns[0] || 'common';
  const instance = createInstance();
  instance.use(initReactI18next);
  instance.init({
    lng: locale,
    fallbackLng: locale,
    ns,
    defaultNS,
    fallbackNS: ns.includes('common') ? 'common' : undefined,
    resources: { [locale]: resources },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
}
