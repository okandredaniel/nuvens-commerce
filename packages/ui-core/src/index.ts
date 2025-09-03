export type Resources = Record<string, Record<string, any>>;

import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import it from './locales/it';
import pt from './locales/pt';

const resources: Resources = {
  en,
  es,
  fr,
  it,
  pt,
};

export const coreI18n = {
  defaultLocale: 'en',
  locales: Object.keys(resources),
  resources,
};
