import { describe, expect, it } from 'vitest';
import { getRuntimeConfig } from './getRuntimeConfig.server';

function makeRequest(path = '/', headers: Record<string, string> = {}) {
  return new Request(`https://example.com${path}`, { headers: new Headers(headers) });
}

function makeArgs({
  env = {},
  path = '/',
  headers = {},
  storefrontI18n,
}: {
  env?: Record<string, string | undefined>;
  path?: string;
  headers?: Record<string, string>;
  storefrontI18n?: { language?: string; country?: string };
}) {
  const baseEnv = {
    BRAND_ID: 'zippex',
    PUBLIC_STORE_DOMAIN: 'store.myshopify.com',
    PUBLIC_STOREFRONT_ID: 'gid://shopify/App/123',
    PUBLIC_STOREFRONT_API_TOKEN: 'public-token',
    PUBLIC_CHECKOUT_DOMAIN: 'checkout.myshopify.com',
    PRIVATE_STOREFRONT_API_TOKEN: 'private-token',
    ...env,
  };
  const context: any = {
    env: baseEnv,
    storefront: storefrontI18n
      ? { i18n: { language: storefrontI18n.language, country: storefrontI18n.country } }
      : undefined,
  };
  return {
    context,
    request: makeRequest(path, headers),
  } as any;
}

describe('getRuntimeConfig', () => {
  it('builds runtime env and detects i18n from URL and Accept-Language', () => {
    const args = makeArgs({
      path: '/fr/products',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { 'accept-language': 'pt-BR,pt;q=0.9' },
    });
    const cfg = getRuntimeConfig(args);
    expect(cfg.env).toEqual({
      BRAND_ID: 'zippex',
      PUBLIC_STORE_DOMAIN: 'store.myshopify.com',
      PUBLIC_STOREFRONT_ID: 'gid://shopify/App/123',
      PUBLIC_STOREFRONT_API_TOKEN: 'public-token',
      PUBLIC_CHECKOUT_DOMAIN: 'checkout.myshopify.com',
      PRIVATE_STOREFRONT_API_TOKEN: 'private-token',
    });
    expect(cfg.brand).toEqual({ id: 'zippex' });
    expect(cfg.i18n).toEqual({ language: 'FR', country: 'BR' });
    expect(cfg.languages).toBeUndefined();
  });

  it('falls back to Accept-Language and CF country when no URL segment', () => {
    const args = makeArgs({
      path: '/',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { 'accept-language': 'es', 'cf-ipcountry': 'mx' },
    });
    const cfg = getRuntimeConfig(args);
    expect(cfg.i18n).toEqual({ language: 'ES', country: 'MX' });
  });

  it('defaults to EN/US when no hints are present', () => {
    const args = makeArgs({ path: '/', headers: {} });
    const cfg = getRuntimeConfig(args);
    expect(cfg.i18n).toEqual({ language: 'EN', country: 'US' });
  });

  it('prefers storefront i18n from context over detection and uppercases values', () => {
    const args = makeArgs({
      path: '/en',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { 'accept-language': 'pt-BR' },
      storefrontI18n: { language: 'de', country: 'at' },
    });
    const cfg = getRuntimeConfig(args);
    expect(cfg.i18n).toEqual({ language: 'DE', country: 'AT' });
  });

  it('throws when BRAND_ID is missing', () => {
    const args = makeArgs({
      env: { BRAND_ID: undefined },
    });
    expect(() => getRuntimeConfig(args)).toThrow('BRAND_ID is invalid or missing');
  });

  it.each([
    ['PUBLIC_STORE_DOMAIN'],
    ['PUBLIC_STOREFRONT_ID'],
    ['PUBLIC_STOREFRONT_API_TOKEN'],
    ['PUBLIC_CHECKOUT_DOMAIN'],
  ])('throws when %s is missing', (key) => {
    const env: Record<string, string | undefined> = {};
    env[key] = undefined;
    const args = makeArgs({ env });
    expect(() => getRuntimeConfig(args)).toThrow(`${key} is invalid or missing`);
  });
});
