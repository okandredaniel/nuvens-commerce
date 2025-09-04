import { defaultCountryByLocale, Language } from '@nuvens/ui-core';
import { brandCountryOverrides } from './i18n/config';

export * from './components';
export * from './i18n/config';
export * from './pages';
export * from './tokens';
export { brandTokens } from './tokens';
export const brandCountryByLocale: Record<Language, string> = {
  ...defaultCountryByLocale,
  ...brandCountryOverrides,
};
