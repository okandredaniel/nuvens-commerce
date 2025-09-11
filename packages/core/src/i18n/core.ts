import { Language, type Resources } from './i18n.interface';

export const coreI18n = {
  defaultLocale: Language.English,
  locales: [] as Language[],
  resources: {} as Resources,
} as const;
