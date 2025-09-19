import type { I18nBase } from '@shopify/hydrogen';
import type { LanguageCode } from '@shopify/hydrogen-react/storefront-api-types';
import type { CountryCode } from '@shopify/hydrogen/customer-account-api-types';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { toLang } from './localize';

function toCountryCode(input?: string): CountryCode {
  try {
    const loc = new Intl.Locale(input || 'en');
    const region = (loc.maximize().region || 'US').toUpperCase();
    return region as CountryCode;
  } catch {
    return 'US' as CountryCode;
  }
}

function toLanguageCode(input?: string): LanguageCode {
  return toLang(input || 'en').toUpperCase() as LanguageCode;
}

function langFromPath(pathname: string) {
  const seg = pathname.split('/').filter(Boolean)[0] || '';
  return /^[a-z]{2}$/i.test(seg) ? seg.toLowerCase() : undefined;
}

export function getLocaleFromRequest(request: Request): I18nBase {
  const pathname = new URL(request.url).pathname;
  const pathLang = langFromPath(pathname);
  const raw = (request.headers.get('accept-language') || '').split(',')[0]?.trim() || '';
  const language = toLanguageCode(pathLang || raw);
  const country = toCountryCode(pathLang || raw);
  return {
    language,
    country,
  };
}

export function getActiveLocale(args: LoaderFunctionArgs) {
  const { storefront } = args.context;
  const pathname = new URL(args.request.url).pathname;
  const pathLang = langFromPath(pathname);
  const raw = (args.request.headers.get('accept-language') || '').split(',')[0]?.trim() || '';
  const fallbackLang = storefront.i18n.language;
  const language = toLanguageCode(pathLang || raw || fallbackLang);
  const country =
    (storefront.i18n.country?.toUpperCase() as CountryCode) || toCountryCode(pathLang || raw);
  const lang = toLang(language);
  return {
    lang,
    language,
    country,
  };
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
    variables: {
      language,
      country,
      ...vars,
    },
    cache: cache ?? context.storefront.CacheShort(),
  });
}
