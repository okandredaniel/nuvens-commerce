import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();

  vi.doMock('@nuvens/shopify', () => ({
    ErrorBoundary: ({ children }: any) => <>{children}</>,
    loadAppDictionaries: () => ({}),
    loadBrandDictionaries: () => ({}),
    toLang: (s: string) => s,
  }));

  // Mock the links module so Vite doesn't need to resolve `?url` assets
  vi.doMock('./server/http/links', () => ({
    links: () => [
      { rel: 'icon', type: 'image/svg+xml', href: '/test-favicon.png' },
      { rel: 'stylesheet', href: '/brand-ui.css' },
    ],
  }));

  vi.doMock('./server/i18n/merge', () => ({ mergeI18nResources: () => ({ merged: true }) }));
  vi.doMock('./server/brand', () => ({
    getBrandContext: async () => ({ brandI18n: {}, brand: { id: 'b' } }),
  }));
  vi.doMock('./server/data/loaders', () => ({
    loadCriticalData: async () => ({ crit: 1 }),
    loadDeferredData: () => ({ def: 1 }),
  }));
  vi.doMock('./server/runtime/getRuntimeConfig.server', () => ({
    getRuntimeConfig: () => ({
      env: {
        BRAND_ID: 'Z',
        PUBLIC_STORE_DOMAIN: 'shop.example',
        PUBLIC_STOREFRONT_ID: 'sfid',
        PUBLIC_CHECKOUT_DOMAIN: 'chk.example',
        PUBLIC_STOREFRONT_API_TOKEN: 'tok',
        PRIVATE_STOREFRONT_API_TOKEN: 'shhh',
      },
    }),
  }));
  vi.doMock('@/lib/seo', () => ({ buildMetaLinks: () => 'META' }));
  vi.doMock('@shopify/hydrogen', () => ({ getShopAnalytics: () => Promise.resolve({}) }));
  vi.doMock('react-router', () => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Outlet: () => React.createElement('div', { 'data-testid': 'outlet' }),
  }));
  vi.doMock('./server/routing/resolvePathname', () => ({
    resolvePathname: (r: Request) => new URL(r.url).pathname,
  }));
});

it('loader applies locale from URL when present', async () => {
  const mod = await import('./root');
  const args: any = {
    request: new Request('https://site.com/fr/products'),
    context: { storefront: { i18n: { language: 'EN', country: 'US' } } },
  };
  const data = await mod.loader(args);
  expect(data.i18n.locale).toBe('fr');
  expect(data.origin).toBe('https://site.com');
  expect(data.i18n.resources.merged).toBe(true);
  expect(JSON.stringify(data)).not.toContain('shhh');
  expect(JSON.stringify(data)).not.toContain('PRIVATE_STOREFRONT_API_TOKEN');
  await expect(data.shop).resolves.toBeTruthy();
});

it('loader uses context locale when URL has no prefix', async () => {
  const mod = await import('./root');
  const args: any = {
    request: new Request('https://site.com/products'),
    context: { storefront: { i18n: { language: 'EN', country: 'US' } } },
  };
  const data = await mod.loader(args);
  expect(data.i18n.locale).toBe('en');
});

it('meta delegates to buildMetaLinks', async () => {
  const mod = await import('./root');
  const res = mod.meta({
    data: { header: { shop: { primaryDomain: { url: 'https://base.com' } } } },
    location: { pathname: '/p', search: '?q=1' } as any,
  } as any);
  expect(res).toBe('META');
});

it('App renders Outlet', async () => {
  const mod = await import('./root');
  render(React.createElement(mod.default));
  expect(screen.getByTestId('outlet')).toBeTruthy();
});
