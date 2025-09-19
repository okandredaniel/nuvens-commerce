import faviconUrl from '@/assets/favicon.svg?url';
import brandUiStyles from '@nuvens/brand-ui/styles.css?url';
import type { LinksFunction } from '@shopify/remix-oxygen';

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: faviconUrl },
  { rel: 'stylesheet', href: brandUiStyles },
];
