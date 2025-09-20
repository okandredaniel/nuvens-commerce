import { brandCountryOverrides, brandDefaultLocale } from '@nuvens/brand-ui';
import { Language, countryForLanguage, toLanguage } from '@nuvens/core';
import type { I18nBase } from '@shopify/hydrogen';
import type { LanguageCode } from '@shopify/hydrogen-react/storefront-api-types';
import type { CountryCode } from '@shopify/hydrogen/customer-account-api-types';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { toLang } from './localize';

function asLanguage(input?: string): Language {
  return toLanguage(input, brandDefaultLocale as Language);
}

function toCountryCode(input?: string): CountryCode {
  const lang = asLanguage(input);
  const code = countryForLanguage(lang, brandCountryOverrides);
  return code.toUpperCase() as CountryCode;
}

function toLanguageCode(input?: string): LanguageCode {
  return asLanguage(input).toUpperCase() as LanguageCode;
}

function langFromPath(pathname: string) {
  const seg = pathname.split('/').filter(Boolean)[0] || '';
  return /^[a-z]{2}$/i.test(seg) ? seg.toLowerCase() : undefined;
}

export function getLocaleFromRequest(request: Request): I18nBase {
  const pathname = new URL(request.url).pathname;
  const pathLang = langFromPath(pathname);
  const raw = (request.headers.get('accept-language') || '').split(',')[0]?.trim() || '';
  const language = toLanguageCode(pathLang || raw || brandDefaultLocale);
  const country = toCountryCode(pathLang || raw || brandDefaultLocale);
  return { language, country };
}

export function getActiveLocale(args: LoaderFunctionArgs) {
  const { storefront } = args.context;
  const pathname = new URL(args.request.url).pathname;
  const pathLang = langFromPath(pathname);
  const raw = (args.request.headers.get('accept-language') || '').split(',')[0]?.trim() || '';
  const fallbackLang = storefront.i18n.language as string | undefined;

  const language = toLanguageCode(pathLang || raw || fallbackLang || brandDefaultLocale);

  const storefrontCountry = (storefront.i18n.country &&
    String(storefront.i18n.country).toUpperCase()) as CountryCode | undefined;

  const country =
    storefrontCountry || toCountryCode(pathLang || raw || fallbackLang || brandDefaultLocale);

  const lang = toLang(language);
  return { lang, language, country };
}

type Vars = Record<string, unknown>;

export async function sfQuery<TData>(
  args: LoaderFunctionArgs,
  doc: string,
  vars: Vars = {},
  cache?: unknown,
) {
  const { context } = args;
  const { language, country } = getActiveLocale(args);
  return context.storefront.query<TData>(doc, {
    variables: { language, country, ...vars },
    cache: cache ?? context.storefront.CacheShort(),
  });
}
