import { createInstance, type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { attachI18nDiagnostics, createI18nextLogger } from './logger';

declare global {
  var __i18nSingleton__: i18n | undefined;
}

function ensureInstance(): i18n {
  if (globalThis.__i18nSingleton__) return globalThis.__i18nSingleton__;
  const instance = createInstance();
  instance.use(initReactI18next);
  instance.use(createI18nextLogger());
  globalThis.__i18nSingleton__ = instance;
  return instance;
}

export function createI18n(locale: string, resources: Record<string, any>): i18n {
  const ns = Object.keys(resources || {});
  const defaultNS = ns.includes('common') ? 'common' : ns[0] || 'common';
  const instance = ensureInstance();

  if (!instance.isInitialized) {
    instance.init({
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
    attachI18nDiagnostics(instance);
  } else {
    for (const n of ns) {
      instance.addResourceBundle(locale, n, resources[n], true, true);
    }
    instance.setDefaultNamespace(defaultNS);
    if (instance.language !== locale) instance.changeLanguage(locale);
    attachI18nDiagnostics(instance);
  }

  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    (globalThis as any).__i18n = instance;
  }

  return instance;
}
