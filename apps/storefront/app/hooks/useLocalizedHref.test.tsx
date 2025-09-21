// apps/storefront/app/i18n/useLocalizedHref.test.tsx
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const router = vi.hoisted(() => ({
  useRouteLoaderData: vi.fn<() => any>(() => undefined),
  useLocation: vi.fn<() => { pathname: string }>(() => ({ pathname: '/' })),
}));
vi.mock('react-router', () => router);

const lz = vi.hoisted(() => ({
  localizeTo: vi.fn((to: any, lang?: string) => {
    const t =
      typeof to === 'string'
        ? to
        : String(to?.pathname || '') + String(to?.search || '') + String(to?.hash || '');
    return `HREF[${lang ?? ''}]:${t}`;
  }),
}));
vi.mock('@/i18n/localize', () => lz);

async function importHook() {
  vi.resetModules();
  return await import('./useLocalizedHref');
}

function renderProbe(useLocalizedHref: any, to: any) {
  const Probe = ({ to: t }: { to: any }) => {
    const getHref = useLocalizedHref();
    const href = getHref(t);
    return <div data-testid="out">{href}</div>;
  };
  render(<Probe to={to} />);
  return screen.getByTestId('out').textContent || '';
}

beforeEach(() => {
  vi.clearAllMocks();
  router.useRouteLoaderData.mockReturnValue(undefined);
  router.useLocation.mockReturnValue({ pathname: '/' });
});

describe('useLocalizedHref', () => {
  it('uses path language when present', async () => {
    router.useLocation.mockReturnValue({ pathname: '/fr/products' });
    const { useLocalizedHref } = await importHook();
    const out = renderProbe(useLocalizedHref, '/x?q=1');
    expect(out).toBe('HREF[fr]:/x?q=1');
    expect(lz.localizeTo).toHaveBeenCalledWith('/x?q=1', 'fr');
  });

  it('uses route loader i18n.locale when path has no language', async () => {
    router.useLocation.mockReturnValue({ pathname: '/products' });
    router.useRouteLoaderData.mockReturnValue({ i18n: { locale: 'pt-BR' } });
    const { useLocalizedHref } = await importHook();
    const out = renderProbe(useLocalizedHref, { pathname: '/y', search: '?p=2' });
    expect(out).toBe('HREF[pt-BR]:/y?p=2');
    expect(lz.localizeTo).toHaveBeenCalledWith({ pathname: '/y', search: '?p=2' }, 'pt-BR');
  });

  it('handles uppercase path segment and normalizes to lower', async () => {
    router.useLocation.mockReturnValue({ pathname: '/EN/deals' });
    const { useLocalizedHref } = await importHook();
    const out = renderProbe(useLocalizedHref, '/z');
    expect(out).toBe('HREF[en]:/z');
    expect(lz.localizeTo).toHaveBeenCalledWith('/z', 'en');
  });

  it('passes undefined lang when neither path nor data provide one', async () => {
    router.useLocation.mockReturnValue({ pathname: '/shop' });
    router.useRouteLoaderData.mockReturnValue({});
    const { useLocalizedHref } = await importHook();
    const out = renderProbe(useLocalizedHref, { pathname: '/a', hash: '#h' });
    expect(out).toBe('HREF[]:/a#h');
    expect(lz.localizeTo).toHaveBeenCalledWith({ pathname: '/a', hash: '#h' }, undefined);
  });
});
