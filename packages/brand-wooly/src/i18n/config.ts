import { Language } from '@nuvens/core';

export const brandLocales = [
  Language.English,
  Language.French,
  Language.Italian,
  Language.Portuguese,
  Language.Spanish,
] as const;
export type BrandLocale = (typeof brandLocales)[number];

export const brandDefaultLocale: BrandLocale = Language.English;

export const brandCountryOverrides: Partial<Record<Language, string>> = {};
