// apps/storefront/app/Layout.test.tsx
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const rr = vi.hoisted(() => ({
  useMatches: vi.fn<() => any[]>(() => []),
  useRouteLoaderData: vi.fn<() => any>(() => undefined),
  useLocation: vi.fn<() => { pathname: string; search: string }>(() => ({
    pathname: '/',
    search: '',
  })),
  Links: (props: any) => <link data-testid="links" {...props} />,
  Meta: (props: any) => <meta data-testid="meta" {...props} />,
  Scripts: ({ nonce }: any) => <div data-testid="scripts" data-nonce={nonce} />,
  ScrollRestoration: ({ nonce }: any) => <div data-testid="scroll" data-nonce={nonce} />,
}));
vi.mock('react-router', () => rr);

const hyd = vi.hoisted(() => ({
  useNonce: vi.fn(() => 'NONCE-123'),
}));
vi.mock('@shopify/hydrogen', () => hyd);

vi.mock('@/components/cart', () => ({ CartAside: () => <div data-testid="cart" /> }));
vi.mock('@/components/footer', () => ({ Footer: () => <footer data-testid="footer" /> }));
vi.mock('@/components/header', () => ({
  Header: ({ pref }: { pref?: 'transparent' | 'solid' }) => (
    <header data-testid="header" data-pref={pref || ''} />
  ),
}));
vi.mock('@/components/MobileMenuAside', () => ({
  MobileMenuAside: () => <div data-testid="mobile-menu" />,
}));
vi.mock('@/providers/Providers', () => ({
  Providers: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
  BrandStyleTag: () => <style data-testid="brand-style" />,
}));

const eff = vi.hoisted(() => ({
  getEffectiveLang: vi.fn(() => 'en'),
}));
vi.mock('@/i18n/effective', () => eff);

async function importLayout() {
  vi.resetModules();
  return await import('./Layout');
}

beforeEach(() => {
  vi.clearAllMocks();
  rr.useMatches.mockReturnValue([]);
  rr.useRouteLoaderData.mockReturnValue({ i18n: { locale: 'en' } });
  hyd.useNonce.mockReturnValue('NONCE-123');
  eff.getEffectiveLang.mockReturnValue('en');
});

describe('Layout', () => {
  it('sets html lang from getEffectiveLang and renders children', async () => {
    eff.getEffectiveLang.mockReturnValue('it');
    const { Layout } = await importLayout();
    const { container } = render(
      <Layout>
        <div data-testid="child">X</div>
      </Layout>,
    );
    const html = container.querySelector('html')!;
    expect(html.getAttribute('lang')).toBe('it');
    expect(screen.getByTestId('child')).toHaveTextContent('X');
    expect(screen.getByTestId('brand-style')).toBeInTheDocument();
    expect(screen.getByTestId('cart')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('uses header pref=transparent to remove main top padding', async () => {
    rr.useMatches.mockReturnValue([
      { handle: { header: 'solid' } },
      { handle: { header: 'transparent' } },
    ]);
    const { Layout } = await importLayout();
    const { container } = render(<Layout />);
    const main = container.querySelector('main')!;
    expect(main.className).toContain('pt-0');
    expect(screen.getByTestId('header')).toHaveAttribute('data-pref', 'transparent');
  });

  it('uses header pref=solid to apply default main padding', async () => {
    rr.useMatches.mockReturnValue([{ handle: { header: 'solid' } }]);
    const { Layout } = await importLayout();
    const { container } = render(<Layout />);
    const main = container.querySelector('main')!;
    expect(main.className).toContain('pt-16');
    expect(screen.getByTestId('header')).toHaveAttribute('data-pref', 'solid');
  });

  it('applies default padding when no header pref is provided', async () => {
    rr.useMatches.mockReturnValue([{}, {}] as any);
    const { Layout } = await importLayout();
    const { container } = render(<Layout />);
    const main = container.querySelector('main')!;
    expect(main.className).toContain('pt-16');
    expect(screen.getByTestId('header')).toHaveAttribute('data-pref', '');
  });

  it('passes nonce to Scripts and ScrollRestoration', async () => {
    hyd.useNonce.mockReturnValue('XYZ');
    const { Layout } = await importLayout();
    render(<Layout />);
    expect(screen.getByTestId('scripts')).toHaveAttribute('data-nonce', 'XYZ');
    expect(screen.getByTestId('scroll')).toHaveAttribute('data-nonce', 'XYZ');
  });
});
