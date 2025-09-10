type EnvLike = {
  PUBLIC_CHECKOUT_DOMAIN?: string;
  PUBLIC_STORE_DOMAIN?: string;
  NODE_ENV?: string;
};

const SELF = "'self'";
const DATA = 'data:';
const BLOB = 'blob:';

const SHOPIFY_CDN = 'https://cdn.shopify.com';
const SHOPIFY_MAIN = 'https://shopify.com';
const MONORAIL = 'https://monorail-edge.shopifysvc.com';

const YOUTUBE = ['https://www.youtube.com', 'https://www.youtube-nocookie.com'];
const YT_IMG = ['https://i.ytimg.com', 'https://*.ytimg.com'];
const GOOGLEVIDEO = 'https://*.googlevideo.com';

const DEV_HTTP = ['http://localhost:*'];
const DEV_WS = ['ws://localhost:*', 'ws://127.0.0.1:*', 'ws://*.tryhydrogen.dev:*'];

const uniq = (a: string[]) => Array.from(new Set(a));

export function buildCspSources(env: EnvLike) {
  const isDev = env?.NODE_ENV !== 'production';
  const store = env.PUBLIC_STORE_DOMAIN ? `https://${env.PUBLIC_STORE_DOMAIN}` : '';
  const checkout = env.PUBLIC_CHECKOUT_DOMAIN ? `https://${env.PUBLIC_CHECKOUT_DOMAIN}` : '';

  return {
    shop: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN || '',
      storeDomain: env.PUBLIC_STORE_DOMAIN || '',
    },
    frameSrc: uniq([SELF, ...YOUTUBE]),
    imgSrc: uniq([SELF, DATA, BLOB, SHOPIFY_CDN, ...YT_IMG]),
    mediaSrc: uniq([SELF, BLOB, SHOPIFY_CDN, GOOGLEVIDEO]),
    fontSrc: uniq([SELF, SHOPIFY_CDN, DATA]),
    styleSrc: uniq([SELF, SHOPIFY_CDN]),
    scriptSrc: uniq([SELF, SHOPIFY_CDN, ...(isDev ? ["'unsafe-eval'"] : [])]),
    connectSrc: uniq([
      SELF,
      SHOPIFY_CDN,
      SHOPIFY_MAIN,
      MONORAIL,
      store,
      checkout,
      ...YOUTUBE,
      GOOGLEVIDEO,
      ...(isDev ? [...DEV_HTTP, ...DEV_WS] : []),
    ]),
  };
}
