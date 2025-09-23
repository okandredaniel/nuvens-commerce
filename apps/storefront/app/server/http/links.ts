import faviconUrl from '@nuvens/brand-ui/favicon.png?url';
import brandUiStyles from '@nuvens/brand-ui/styles.css?url';
import type { LinksFunction } from '@shopify/remix-oxygen';

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/png', href: faviconUrl },
  { rel: 'stylesheet', href: brandUiStyles },
];
