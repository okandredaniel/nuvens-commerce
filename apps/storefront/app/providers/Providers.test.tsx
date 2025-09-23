import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const h = vi.hoisted(() => ({
  mockLoadAppDictionaries: vi.fn(),
  mockCreateI18n: vi.fn(),
  mockUseRouteLoaderData: vi.fn(),
  cssVarsValue: '--brand-color:#000;',
}));

vi.mock('@nuvens/shopify', () => ({
  loadAppDictionaries: h.mockLoadAppDictionaries,
  createI18n: h.mockCreateI18n,
  getEffectiveLang: (_brandDefaultLocale: string, d: any) => d?.i18n?.locale ?? 'en',
}));

vi.mock('@nuvens/core', () => ({
  coreI18n: {
    resources: {
      fr: {
        coreNS: { c: 1 },
        shared: { a: 'core', c: 'core' },
      },
    },
  },
}));

vi.mock('react-router', () => ({
  useRouteLoaderData: h.mockUseRouteLoaderData,
}));

vi.mock('@nuvens/ui', () => ({
  Tooltip: { Provider: ({ children }: any) => <>{children}</> },
  Aside: { Provider: ({ children }: any) => <>{children}</> },
}));

vi.mock('@shopify/hydrogen', () => ({
  Analytics: { Provider: ({ children }: any) => <>{children}</> },
}));

vi.mock('react-i18next', () => ({
  I18nextProvider: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/lib/routing/paths', () => ({
  resolvePolicyPath: (p: string) => `/policies/${p}`,
}));

vi.mock('./AppContexts', () => {
  const Pass = ({ children }: any) => <>{children}</>;
  return {
    ProvidersMap: { Brand: Pass, Store: Pass, User: Pass, Cart: Pass },
    useShallowMemo: (v: any) => v,
    useBrand: () => ({ cssVars: h.cssVarsValue }),
  };
});

vi.mock('@/brand-ui.generated', () => ({ brandDefaultLocale: 'en-US' }));

const baseRouteData = {
  i18n: {
    locale: 'fr',
    resources: {
      serverNS: { s: 1 },
      shared: { a: 'server' },
    },
  },
  publicStoreDomain: 'shop.example',
  header: { shop: { primaryDomain: { url: 'https://base.com' } } },
  cart: Promise.resolve(null),
  shop: Promise.resolve({}),
  consent: {},
  brand: { id: 'B' },
};

describe('Providers', () => {
  beforeEach(() => {
    cleanup();
    h.mockLoadAppDictionaries.mockReset();
    h.mockCreateI18n.mockReset();
    h.mockUseRouteLoaderData.mockReset();
    h.mockLoadAppDictionaries.mockImplementation((lang: string) =>
      lang === 'fr' ? { appNS: { a: 1 }, shared: { b: 'app' } } : {},
    );
    h.mockCreateI18n.mockImplementation((lang: string, dicts: any) => ({ lang, dicts }));
    h.mockUseRouteLoaderData.mockReturnValue(baseRouteData);
    h.cssVarsValue = '--brand-color:#000;';
  });

  afterEach(() => {
    cleanup();
  });

  it('merges core < server < app and creates i18n with effective language', async () => {
    const mod = await import('./Providers');
    render(
      <mod.Providers>
        <div data-testid="ok" />
      </mod.Providers>,
    );
    expect(h.mockLoadAppDictionaries).toHaveBeenCalledWith('fr');
    expect(h.mockCreateI18n).toHaveBeenCalledTimes(1);
    const [lang, dicts] = (h.mockCreateI18n as any).mock.calls[0];
    expect(lang).toBe('fr');
    expect(Object.keys(dicts).sort()).toEqual(['appNS', 'coreNS', 'serverNS', 'shared'].sort());
    expect(dicts.shared).toEqual({ a: 'server', b: 'app', c: 'core' });
    expect(screen.getByTestId('ok')).toBeInTheDocument();
  });

  it('BrandStyleTag renders only when cssVars exist', async () => {
    const mod = await import('./Providers');
    const { container: c1 } = render(<mod.BrandStyleTag />);
    expect(c1.querySelector('style#brand-vars')?.textContent).toBe(':root{--brand-color:#000;}');
    cleanup();
    h.cssVarsValue = '';
    const { container: c2 } = render(<mod.BrandStyleTag />);
    expect(c2.querySelector('style#brand-vars')).toBeNull();
  });
});
