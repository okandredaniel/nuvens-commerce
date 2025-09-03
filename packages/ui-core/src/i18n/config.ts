export type Resources = Record<string, Record<string, any>>;

export enum Language {
  English = 'en',
  French = 'fr',
  Portuguese = 'pt',
  Spanish = 'es',
  German = 'de',
  Italian = 'it',
}

export type CountryMap = Record<Language, string>;

const getDefaultRegion = (lang: Language): string => new Intl.Locale(lang).maximize().region!;

export const defaultCountryByLocale: CountryMap = Object.fromEntries(
  Object.values(Language).map((lang) => [lang, getDefaultRegion(lang)]),
) as CountryMap;
