import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { HEADER_QUERY } from '~/lib/fragments';

export async function loadCriticalData({ context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { headerMenuHandle: 'main-menu' },
    }),
  ]);
  return { header };
}
