import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const rr = vi.hoisted(() => ({
  useMatches: vi.fn<() => any[]>(() => []),
  useRouteLoaderData: vi.fn<() => any>(() => undefined),
  Links: (props: any) => <link data-testid="links" {...props} />,
  Meta: (props: any) => <meta data-testid="meta" {...props} />,
  Scripts: ({ nonce }: any) => <div data-testid="scripts" data-nonce={nonce} />,
  ScrollRestoration: ({ nonce }: any) => <div data-testid="scroll" data-nonce={nonce} />,
  Await: ({ resolve, children }: any) =>
    typeof children === 'function' ? children(resolve) : null,
}));
vi.mock('react-router', () => rr);

const hyd = vi.hoisted(() => ({
  useNonce: vi.fn(() => 'NONCE-123'),
}));
vi.mock('@shopify/hydrogen', () => hyd);

const shop = vi.hoisted(() => ({
  getEffectiveLang: vi.fn(() => 'en'),
}));
vi.mock('@nuvens/shopify', () => ({
  CartAside: ({ heading }: any) => <div data-testid="cart" data-h={heading} />,
  Footer: () => <footer data-testid="footer" />,
  Header: ({ pref }: { pref?: 'transparent' | 'solid' }) => (
    <header data-testid="header" data-pref={pref || ''} />
  ),
  MobileMenuAside: () => <div data-testid="mobile-menu" />,
  getEffectiveLang: shop.getEffectiveLang,
}));

vi.mock('@nuvens/brand-ui', () => ({
  Brand: (props: any) => <div data-testid="brand" {...props} />,
  brandDefaultLocale: 'en-US',
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('@/providers/Providers', () => ({
  Providers: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
  BrandStyleTag: () => <style data-testid="brand-style" />,
}));

const ctx = vi.hoisted(() => ({
  useCart: vi.fn(() => ({ id: 'cart' })),
  useRoutingPolicy: vi.fn(() => ({ recommendedFallback: '/' })),
  useStore: vi.fn(() => ({
    publicStoreDomain: 'shop.example',
    header: {
      shop: { primaryDomain: { url: 'https://base.com' }, name: 'Brand' },
      menu: { items: [] },
    },
    footer: { menu: { items: [] } },
  })),
}));
vi.mock('@/providers/AppContexts', () => ({
  useCart: ctx.useCart,
  useRoutingPolicy: ctx.useRoutingPolicy,
  useStore: ctx.useStore,
}));

async function importLayout() {
  vi.resetModules();
  return await import('./Layout');
}

beforeEach(() => {
  vi.clearAllMocks();
  rr.useMatches.mockReturnValue([]);
  rr.useRouteLoaderData.mockReturnValue({ i18n: { locale: 'en' } });
  hyd.useNonce.mockReturnValue('NONCE-123');
  shop.getEffectiveLang.mockReturnValue('en');
  ctx.useCart.mockReturnValue({ id: 'cart' });
  ctx.useRoutingPolicy.mockReturnValue({ recommendedFallback: '/' });
  ctx.useStore.mockReturnValue({
    publicStoreDomain: 'shop.example',
    header: {
      shop: { primaryDomain: { url: 'https://base.com' }, name: 'Brand' },
      menu: { items: [] },
    },
    footer: { menu: { items: [] } },
  });
});

describe('Layout', () => {
  it('sets html lang using getEffectiveLang and renders shell', async () => {
    shop.getEffectiveLang.mockReturnValue('it');
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

  it('applies transparent header preference and removes main top padding', async () => {
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

  it('applies solid header preference and keeps default top padding', async () => {
    rr.useMatches.mockReturnValue([{ handle: { header: 'solid' } }]);
    const { Layout } = await importLayout();
    const { container } = render(<Layout />);
    const main = container.querySelector('main')!;
    expect(main.className).toContain('pt-16');
    expect(screen.getByTestId('header')).toHaveAttribute('data-pref', 'solid');
  });

  it('uses default padding when no header preference is provided', async () => {
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
