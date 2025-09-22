import { describe, expect, it } from 'vitest';
import { buildCspSources } from './domains';

function isSorted(a: string[]) {
  const b = [...a].sort();
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function expectUniqueAndSorted(arr: string[]) {
  expect(new Set(arr).size).toBe(arr.length);
  expect(isSorted(arr)).toBe(true);
}

function expectBaseInvariants(o: ReturnType<typeof buildCspSources>) {
  expect(o.frameSrc).toContain("'self'");
  expect(o.imgSrc).toEqual(
    expect.arrayContaining(["'self'", 'data:', 'blob:', 'https://cdn.shopify.com']),
  );
  expect(o.mediaSrc).toEqual(
    expect.arrayContaining([
      "'self'",
      'blob:',
      'https://cdn.shopify.com',
      'https://*.googlevideo.com',
    ]),
  );
  expect(o.fontSrc).toEqual(expect.arrayContaining(["'self'", 'https://cdn.shopify.com', 'data:']));
  expect(o.styleSrc).toEqual(expect.arrayContaining(["'self'", 'https://cdn.shopify.com']));

  expectUniqueAndSorted(o.frameSrc);
  expectUniqueAndSorted(o.imgSrc);
  expectUniqueAndSorted(o.mediaSrc);
  expectUniqueAndSorted(o.fontSrc);
  expectUniqueAndSorted(o.styleSrc);
  expectUniqueAndSorted(o.scriptSrc);
  expectUniqueAndSorted(o.connectSrc);
}

describe('buildCspSources', () => {
  it('dev mode: includes unsafe-eval and dev hosts; includes store/checkout when provided', () => {
    const res = buildCspSources({
      PUBLIC_STORE_DOMAIN: 'store.myshopify.com',
      PUBLIC_CHECKOUT_DOMAIN: 'checkout.myshopify.com',
    });

    expect(res.shop).toEqual({
      checkoutDomain: 'checkout.myshopify.com',
      storeDomain: 'store.myshopify.com',
    });

    expect(res.scriptSrc).toEqual(
      expect.arrayContaining(["'self'", 'https://cdn.shopify.com', "'unsafe-eval'"]),
    );

    expect(res.connectSrc).toEqual(
      expect.arrayContaining([
        "'self'",
        'https://cdn.shopify.com',
        'https://shopify.com',
        'https://monorail-edge.shopifysvc.com',
        'https://store.myshopify.com',
        'https://checkout.myshopify.com',
        'https://www.youtube.com',
        'https://www.youtube-nocookie.com',
        'https://*.googlevideo.com',
        'http://localhost:*',
        'ws://localhost:*',
        'ws://127.0.0.1:*',
        'ws://*.tryhydrogen.dev:*',
      ]),
    );

    expectBaseInvariants(res);
  });

  it('prod mode: no unsafe-eval and no dev hosts; includes store/checkout when provided', () => {
    const res = buildCspSources({
      NODE_ENV: 'production',
      PUBLIC_STORE_DOMAIN: 'store.myshopify.com',
      PUBLIC_CHECKOUT_DOMAIN: 'checkout.myshopify.com',
    });

    expect(res.scriptSrc).toEqual(expect.arrayContaining(["'self'", 'https://cdn.shopify.com']));
    expect(res.scriptSrc).not.toContain("'unsafe-eval'");

    expect(res.connectSrc).toEqual(
      expect.arrayContaining([
        "'self'",
        'https://cdn.shopify.com',
        'https://shopify.com',
        'https://monorail-edge.shopifysvc.com',
        'https://store.myshopify.com',
        'https://checkout.myshopify.com',
        'https://www.youtube.com',
        'https://www.youtube-nocookie.com',
        'https://*.googlevideo.com',
      ]),
    );

    expect(res.connectSrc).not.toEqual(
      expect.arrayContaining([
        'http://localhost:*',
        'ws://localhost:*',
        'ws://127.0.0.1:*',
        'ws://*.tryhydrogen.dev:*',
      ]),
    );

    expectBaseInvariants(res);
  });

  it('omits empty store/checkout in connectSrc when env is missing', () => {
    const res = buildCspSources({ NODE_ENV: 'production' });
    expect(res.shop).toEqual({ checkoutDomain: '', storeDomain: '' });
    expect(res.connectSrc).not.toContain('');
    expectBaseInvariants(res);
  });
});
