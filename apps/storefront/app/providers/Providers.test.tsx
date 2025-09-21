import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function setup(routeDataImpl: any, cssVars: string = '--brand-color: #000;') {
  vi.resetModules();

  vi.doMock('@/i18n/effective', () => ({
    getEffectiveLang: (d: any) => d?.i18n?.locale ?? 'en',
  }));

  const loadAppDictionaries = vi.fn((lang: string) =>
    lang === 'fr'
      ? {
          appNS: { a: 1 },
          shared: { b: 'app' },
        }
      : {},
  );
  vi.doMock('@/i18n/resources', () => ({ loadAppDictionaries }));

  vi.doMock('@nuvens/core', () => ({
    coreI18n: {
      resources: {
        fr: {
          coreNS: { c: 1 },
          shared: { a: 'core', c: 'core' },
        },
      },
    },
  }));

  const createI18n = vi.fn((lang: string, dicts: any) => ({ lang, dicts }));
  vi.doMock('@/i18n/createInstance', () => ({ createI18n }));

  vi.doMock('react-router', () => ({
    useRouteLoaderData:
      typeof routeDataImpl === 'function' ? routeDataImpl : vi.fn().mockReturnValue(routeDataImpl),
  }));

  vi.doMock('@nuvens/ui', () => ({
    Tooltip: { Provider: ({ children }: any) => <>{children}</> },
    Aside: { Provider: ({ children }: any) => <>{children}</> },
  }));

  vi.doMock('@shopify/hydrogen', () => ({
    Analytics: { Provider: ({ children }: any) => <>{children}</> },
  }));

  vi.doMock('react-i18next', () => ({
    I18nextProvider: ({ children }: any) => <>{children}</>,
  }));

  vi.doMock('@/lib/routing/paths', () => ({
    resolvePolicyPath: (p: string) => `/policies/${p}`,
  }));

  vi.doMock('./AppContexts', () => {
    const Pass = ({ children }: any) => <>{children}</>;
    return {
      ProvidersMap: { Brand: Pass, Store: Pass, User: Pass, Cart: Pass },
      useShallowMemo: (v: any) => v,
      useBrand: () => ({ cssVars }),
    };
  });

  return { loadAppDictionaries, createI18n };
}

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
  });

  afterEach(() => {
    cleanup();
  });

  it('mescla core < server < app e cria i18n com lang efetivo', async () => {
    const { loadAppDictionaries, createI18n } = setup(baseRouteData, '--brand-color: #000;');
    const mod = await import('./Providers');

    render(
      <mod.Providers>
        <div data-testid="ok" />
      </mod.Providers>,
    );

    expect(loadAppDictionaries).toHaveBeenCalledWith('fr');
    expect(createI18n).toHaveBeenCalledTimes(1);
    const [lang, dicts] = (createI18n as any).mock.calls[0];
    expect(lang).toBe('fr');
    expect(Object.keys(dicts).sort()).toEqual(['appNS', 'coreNS', 'serverNS', 'shared'].sort());
    expect(dicts.shared).toEqual({ a: 'server', b: 'app', c: 'core' });
    expect(screen.getByTestId('ok')).toBeTruthy();
  });

  it('usa LAST_ROOT_DATA quando useRouteLoaderData retorna undefined depois', async () => {
    const seq = vi.fn().mockReturnValueOnce(baseRouteData).mockReturnValueOnce(undefined);
    const { createI18n } = setup(seq, '--brand-color: #000;');
    const mod = await import('./Providers');

    render(<mod.Providers />);
    render(<mod.Providers />);

    expect(createI18n).toHaveBeenCalledTimes(2);
    expect((createI18n as any).mock.calls[0][0]).toBe('fr');
    expect((createI18n as any).mock.calls[1][0]).toBe('fr');
  });

  it('BrandStyleTag renderiza quando há cssVars e não renderiza quando vazio', async () => {
    setup(baseRouteData, '--brand-color:#000;');
    const mod1 = await import('./Providers');
    const { container: c1 } = render(<mod1.BrandStyleTag />);
    expect(c1.querySelector('style#brand-vars')?.textContent).toBe(':root{--brand-color:#000;}');

    cleanup();
    const seq = vi.fn().mockReturnValue(baseRouteData);
    setup(seq, '');
    const mod2 = await import('./Providers');
    const { container: c2 } = render(<mod2.BrandStyleTag />);
    expect(c2.querySelector('style#brand-vars')).toBeNull();
  });
});
