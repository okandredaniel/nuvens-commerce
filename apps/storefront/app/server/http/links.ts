import brandUiStyles from '@nuvens/brand-ui/styles.css?url';
import type { LinksFunction } from '@shopify/remix-oxygen';

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.png' },
  { rel: 'stylesheet', href: brandUiStyles },
];
