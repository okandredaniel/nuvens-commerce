import { Language } from './config';
import { resources } from './resources';

export const coreI18n = {
  defaultLocale: Language.English,
  locales: Object.keys(resources),
  resources,
};
