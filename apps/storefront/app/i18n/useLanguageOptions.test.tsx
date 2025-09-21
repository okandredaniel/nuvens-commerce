import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type LanguageOption = { isoCode: string; href: string; label: string };

const brand = vi.hoisted(() => ({
  brandDefaultLocale: 'en-US' as string,
  brandLocales: ['en-US'] as string[],
}));
vi.mock('@nuvens/brand-ui', () => brand);

const router = vi.hoisted(() => ({
  useLocation: vi.fn<() => { pathname: string; search: string }>(() => ({
    pathname: '/',
    search: '',
  })),
  useRouteLoaderData: vi.fn<() => any>(() => undefined),
}));
vi.mock('react-router', () => router);

vi.mock('@/i18n/localize', () => {
  const toLang = vi.fn((s: any) =>
    String(s || 'en')
      .trim()
      .toLowerCase()
      .replace(/_/g, '-'),
  );
  (globalThis as any).__toLang = toLang;
  return { toLang };
});

async function importHook() {
  vi.resetModules();
  return await import('@/i18n/useLanguageOptions');
}

function renderProbe(useLanguageOptions: any) {
  const Probe = () => {
    const result = useLanguageOptions();
    return <pre data-testid="out">{JSON.stringify(result)}</pre>;
  };
  render(<Probe />);
  return JSON.parse(screen.getByTestId('out').textContent || '{}') as {
    options: LanguageOption[];
    current: string;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  brand.brandDefaultLocale = 'en-US';
  brand.brandLocales = ['en-US'];
  router.useLocation.mockReturnValue({ pathname: '/', search: '' });
  router.useRouteLoaderData.mockReturnValue(undefined);
});

describe('useLanguageOptions', () => {
  it('returns provided languages from route data and current from path', async () => {
    router.useLocation.mockReturnValue({ pathname: '/es/products', search: '?q=a' });
    const provided: LanguageOption[] = [
      { isoCode: 'fr', href: '/fr/products?q=a', label: 'FR' },
      { isoCode: 'es', href: '/es/products?q=a', label: 'ES' },
    ];
    router.useRouteLoaderData.mockReturnValue({ languages: provided });

    const { useLanguageOptions } = await importHook();
    const out = renderProbe(useLanguageOptions);

    expect(out.current).toBe('es');
    expect(out.options).toStrictEqual(provided);
  });

  it('builds options from brandLocales and composes hrefs with prefix replacement', async () => {
    brand.brandDefaultLocale = 'pt-BR';
    brand.brandLocales = ['pt-BR', 'en-US', 'es-ES'];
    router.useLocation.mockReturnValue({ pathname: '/pt/catalog/1', search: '?x=1' });

    const { useLanguageOptions } = await importHook();
    const out = renderProbe(useLanguageOptions);

    expect(out.current).toBe('pt');
    expect(out.options).toStrictEqual([
      { isoCode: 'pt-br', href: '/catalog/1?x=1', label: 'PT-BR' },
      { isoCode: 'en-us', href: '/en-us/catalog/1?x=1', label: 'EN-US' },
      { isoCode: 'es-es', href: '/es-es/catalog/1?x=1', label: 'ES-ES' },
    ]);
  });

  it('adds language prefix when path has no prefix and preserves search', async () => {
    brand.brandDefaultLocale = 'en-US';
    brand.brandLocales = ['en-US', 'fr-FR'];
    router.useLocation.mockReturnValue({ pathname: '/', search: '?p=1' });

    const { useLanguageOptions } = await importHook();
    const out = renderProbe(useLanguageOptions);

    expect(out.options).toStrictEqual([
      { isoCode: 'en-us', href: '/?p=1', label: 'EN-US' },
      { isoCode: 'fr-fr', href: '/fr-fr?p=1', label: 'FR-FR' },
    ]);
  });

  it('replaces existing two-letter prefix with target iso when switching to non-default', async () => {
    brand.brandDefaultLocale = 'en-US';
    brand.brandLocales = ['en-US', 'it-IT'];
    router.useLocation.mockReturnValue({ pathname: '/en/deals', search: '' });

    const { useLanguageOptions } = await importHook();
    const out = renderProbe(useLanguageOptions);

    expect(out.options).toStrictEqual([
      { isoCode: 'en-us', href: '/deals', label: 'EN-US' },
      { isoCode: 'it-it', href: '/it-it/deals', label: 'IT-IT' },
    ]);
  });
});
