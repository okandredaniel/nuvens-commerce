import { HEADER_QUERY } from '@lib/fragments';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import type { HeaderQuery } from 'storefrontapi.generated';

export async function queryHeader(args: LoaderFunctionArgs, language: string, country: string) {
  const { storefront } = args.context;
  return storefront.query<HeaderQuery>(HEADER_QUERY, {
    variables: {
      headerMenuHandle: 'main-menu',
      language: language.toUpperCase(),
      country: country.toUpperCase(),
    } as any,
  });
}
