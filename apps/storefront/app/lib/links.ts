import favicon from '~/assets/favicon.svg';

export function links() {
  return [
    { rel: 'preconnect', href: 'https://cdn.shopify.com' },
    { rel: 'preconnect', href: 'https://shop.app' },
    { rel: 'icon', type: 'image/svg+xml', href: favicon },
  ];
}
