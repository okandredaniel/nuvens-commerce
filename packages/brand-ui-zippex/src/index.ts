import { defaultCountryByLocale, Language } from '@nuvens/ui-core';
export * from './components';
export * from './i18n/config';
export * from './pages';
import { brandCountryOverrides } from './i18n/config';

export const brandCountryByLocale: Record<Language, string> = {
  ...defaultCountryByLocale,
  ...brandCountryOverrides,
};

export { brandTokens } from './tokens';
