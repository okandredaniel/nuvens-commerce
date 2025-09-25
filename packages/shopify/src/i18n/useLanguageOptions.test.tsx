import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type LanguageOption = { isoCode: string; href: string; label: string };

const router = vi.hoisted(() => ({
  useLocation: vi.fn<() => { pathname: string; search: string }>(() => ({
    pathname: '/',
    search: '',
  })),
  useRouteLoaderData: vi.fn<() => any>(() => undefined),
}));
vi.mock('react-router', () => router);

vi.mock('./localize', () => {
  const toLang = vi.fn((s: any) =>
    String(s || 'en')
      .trim()
      .toLowerCase()
      .replace(/_/g, '-'),
  );
  return { toLang };
});

async function fresh() {
  vi.resetModules();
  const hook = await import('./useLanguageOptions');
  const adapter = await import('../adapter');
  return { hook, adapter };
}

function renderWithAdapter(
  useLanguageOptions: any,
  Provider: any,
  providerValue: { defaultLocale: string; locales: string[] },
) {
  const Probe = () => {
    const result = useLanguageOptions();
    return <pre data-testid="out">{JSON.stringify(result)}</pre>;
  };
  render(
    <Provider value={providerValue}>
      <Probe />
    </Provider>,
  );
  return JSON.parse(screen.getByTestId('out').textContent || '{}') as {
    options: LanguageOption[];
    current: string;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  router.useLocation.mockReturnValue({ pathname: '/', search: '' });
  router.useRouteLoaderData.mockReturnValue(undefined);
});

describe('useLanguageOptions', () => {
  it('returns provided languages from route data and current from path', async () => {
    const { hook, adapter } = await fresh();
    router.useLocation.mockReturnValue({ pathname: '/es/products', search: '?q=a' });
    const provided: LanguageOption[] = [
      { isoCode: 'fr', href: '/fr/products?q=a', label: 'FR' },
      { isoCode: 'es', href: '/es/products?q=a', label: 'ES' },
    ];
    router.useRouteLoaderData.mockReturnValue({ languages: provided });

    const out = renderWithAdapter(hook.useLanguageOptions, adapter.ShopifyAdapterProvider, {
      defaultLocale: 'en-US',
      locales: ['en-US', 'fr-FR', 'es-ES'],
    });

    expect(out.current).toBe('es');
    expect(out.options).toStrictEqual(provided);
  });

  it('builds options from locales and replaces prefix for default language', async () => {
    const { hook, adapter } = await fresh();
    router.useLocation.mockReturnValue({ pathname: '/pt/catalog/1', search: '?x=1' });

    const out = renderWithAdapter(hook.useLanguageOptions, adapter.ShopifyAdapterProvider, {
      defaultLocale: 'pt-BR',
      locales: ['pt-BR', 'en-US', 'es-ES'],
    });

    expect(out.current).toBe('pt');
    expect(out.options).toStrictEqual([
      { isoCode: 'pt-br', href: '/catalog/1?x=1', label: 'PT-BR' },
      { isoCode: 'en-us', href: '/en-us/catalog/1?x=1', label: 'EN-US' },
      { isoCode: 'es-es', href: '/es-es/catalog/1?x=1', label: 'ES-ES' },
    ]);
  });

  it('adds language prefix when path has no prefix and preserves search', async () => {
    const { hook, adapter } = await fresh();
    router.useLocation.mockReturnValue({ pathname: '/', search: '?p=1' });

    const out = renderWithAdapter(hook.useLanguageOptions, adapter.ShopifyAdapterProvider, {
      defaultLocale: 'en-US',
      locales: ['en-US', 'fr-FR'],
    });

    expect(out.options).toStrictEqual([
      { isoCode: 'en-us', href: '/?p=1', label: 'EN-US' },
      { isoCode: 'fr-fr', href: '/fr-fr?p=1', label: 'FR-FR' },
    ]);
  });

  it('replaces existing two-letter prefix when switching to non-default', async () => {
    const { hook, adapter } = await fresh();
    router.useLocation.mockReturnValue({ pathname: '/en/deals', search: '' });

    const out = renderWithAdapter(hook.useLanguageOptions, adapter.ShopifyAdapterProvider, {
      defaultLocale: 'en-US',
      locales: ['en-US', 'it-IT'],
    });

    expect(out.options).toStrictEqual([
      { isoCode: 'en-us', href: '/deals', label: 'EN-US' },
      { isoCode: 'it-it', href: '/it-it/deals', label: 'IT-IT' },
    ]);
  });
});
