import { Language } from './i18n.interface';
import { resources } from './resources';

export const coreI18n = {
  defaultLocale: Language.English,
  locales: Object.keys(resources),
  resources,
};
