import { type CountryMap, Language } from './i18n.interface';

const getDefaultRegion = (lang: Language): string => new Intl.Locale(lang).maximize().region!;

export const defaultCountryByLocale: CountryMap = Object.fromEntries(
  Object.values(Language).map((lang) => [lang, getDefaultRegion(lang)]),
) as CountryMap;
