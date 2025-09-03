import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import type { HeaderQuery } from 'storefrontapi.generated';
import { HEADER_QUERY } from '~/lib/fragments';
import { sfQuery } from '../i18n/storefront.server';

export async function loadCriticalData(args: LoaderFunctionArgs) {
  const header = await sfQuery<HeaderQuery>(args, HEADER_QUERY, { headerMenuHandle: 'main-menu' });
  return { header };
}
