export function getCSP({ storeDomain }: { storeDomain: string }) {
  const directives = {
    'connect-src': [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      `https://${storeDomain}`,
      'http://localhost:*',
      'ws://localhost:*',
      'ws://127.0.0.1:*',
      'ws://*.tryhydrogen.dev:*',
      'https://cdn.shopify.com',
    ],
    'script-src': ["'self'", "'unsafe-inline'", "'strict-dynamic'", 'https://cdn.shopify.com'],
  };

  return Object.entries(directives)
    .map(([k, v]) => `${k} ${v.join(' ')}`)
    .join('; ');
}
