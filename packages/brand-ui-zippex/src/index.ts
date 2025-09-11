import { defaultCountryByLocale, Language } from '@nuvens/ui-core';
import { brandCountryOverrides } from './i18n';

export * from './components';
export * from './i18n';
export * from './pages';
export * from './routing';
export * from './tokens';

export const brandCountryByLocale: Record<Language, string> = {
  ...defaultCountryByLocale,
  ...brandCountryOverrides,
};
