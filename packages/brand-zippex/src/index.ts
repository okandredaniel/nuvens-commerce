import { defaultCountryByLocale, Language } from '@nuvens/core';
import { brandCountryOverrides } from './i18n/config';

export const brandCountryByLocale: Record<Language, string> = {
  ...defaultCountryByLocale,
  ...brandCountryOverrides,
};

export * from './components';
export * from './i18n/config';
export * from './pages';
export * from './routing';
