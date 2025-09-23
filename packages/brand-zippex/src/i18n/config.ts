import { Language, type Resources } from '@nuvens/core';
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';

export const brandLocales = [Language.French, Language.English, Language.Spanish];
export type BrandLocale = (typeof brandLocales)[number];

export const brandDefaultLocale: BrandLocale = Language.English;

export const brandCountryOverrides: Partial<Record<Language, string>> = {};

export const brandResources: Partial<Record<Language, Resources>> = {
  fr: fr as Resources,
  en: en as Resources,
  es: es as Resources,
} as const;
