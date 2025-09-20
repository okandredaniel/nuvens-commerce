import { defaultCountryByLocale } from './config';
import { type CountryMap, Language } from './i18n.interface';

const ALL = Object.values(Language) as string[];

export function toLanguage(
  input?: string | Language,
  fallback: Language = Language.English,
): Language {
  const raw = typeof input === 'string' ? input.split('-')[0].toLowerCase() : input;
  if (raw && ALL.includes(raw as string)) return raw as Language;
  return fallback;
}

export function countryForLanguage(
  lang: Language,
  overrides?: Partial<Record<Language, string>>,
  defaults: CountryMap = defaultCountryByLocale,
): string {
  const fromOverride = overrides?.[lang];
  if (fromOverride && /^[A-Za-z]{2}$/.test(fromOverride)) return fromOverride.toUpperCase();
  const base = defaults[lang];
  return base ? base.toUpperCase() : 'US';
}
