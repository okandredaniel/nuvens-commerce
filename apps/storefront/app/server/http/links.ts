import type { LinksFunction } from '@shopify/remix-oxygen';
import favicon from '../../assets/favicon.svg';
import keenStyles from 'keen-slider/keen-slider.min.css?url';
import tailwindStyles from '../../styles/tailwind.css?url';

export const links: LinksFunction = () => [
  { rel: 'icon', type: 'image/svg+xml', href: favicon },
  { rel: 'preload', as: 'style', href: tailwindStyles },
  { rel: 'stylesheet', href: tailwindStyles },
  { rel: 'stylesheet', href: keenStyles },
];
