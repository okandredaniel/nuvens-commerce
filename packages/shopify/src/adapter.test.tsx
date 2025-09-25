import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type AdapterModule = typeof import('./adapter');

const fresh = async (): Promise<AdapterModule> => {
  vi.resetModules();
  return import('./adapter');
};

const Show = ({ useShopifyAdapter }: { useShopifyAdapter: AdapterModule['useShopifyAdapter'] }) => {
  const v = useShopifyAdapter();
  const Brand = v.Brand;
  return (
    <>
      <Brand>
        <span data-testid="brand-child">ok</span>
      </Brand>
      <div data-testid="default-locale">{v.defaultLocale}</div>
      <div data-testid="locales">{v.locales.join(',')}</div>
      <div data-testid="cart">{String(v.useCart())}</div>
      <div data-testid="cart-maybe">{String(v.useCartMaybe?.())}</div>
      <div data-testid="variant-url">
        {v.useVariantUrl('hat', [{ name: 'Size', value: 'L' } as any])}
      </div>
      <div data-testid="href">{String(v.useLocalizedHref()('/p'))}</div>
      <div data-testid="store">{JSON.stringify(v.useStore())}</div>
    </>
  );
};

const BrandProbe = ({
  useShopifyAdapter,
}: {
  useShopifyAdapter: AdapterModule['useShopifyAdapter'];
}) => {
  const { Brand } = useShopifyAdapter();
  return (
    <Brand>
      <span data-testid="child">x</span>
    </Brand>
  );
};

describe('Shopify adapter', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
  });

  it('uses defaults when nothing is configured', async () => {
    const mod = await fresh();
    render(<Show useShopifyAdapter={mod.useShopifyAdapter} />);
    expect(screen.getByTestId('brand-child')).toBeInTheDocument();
    expect(screen.getByTestId('default-locale').textContent).toBe('en');
    expect(screen.getByTestId('locales').textContent).toBe('en');
    expect(screen.getByTestId('cart').textContent).toBe('null');
    expect(screen.getByTestId('cart-maybe').textContent).toBe('undefined');
    expect(screen.getByTestId('variant-url').textContent).toBe('/products/hat?Size=L');
    expect(screen.getByTestId('href').textContent).toBe('/p');
    expect(screen.getByTestId('store').textContent).toBe('{}');
  });

  it('DefaultBrand renders children without extra wrapper', async () => {
    const mod = await fresh();
    const { container } = render(
      <mod.ShopifyAdapterProvider value={{}}>
        <BrandProbe useShopifyAdapter={mod.useShopifyAdapter} />
      </mod.ShopifyAdapterProvider>,
    );
    const first = container.firstElementChild as HTMLElement | null;
    expect(first?.dataset.testid).toBe('child');
  });

  it('default hooks return expected values and identity', async () => {
    const mod = await fresh();
    render(<Show useShopifyAdapter={mod.useShopifyAdapter} />);
    expect(screen.getByTestId('cart').textContent).toBe('null');
    expect(screen.getByTestId('cart-maybe').textContent).toBe('undefined');
    expect(screen.getByTestId('href').textContent).toBe('/p');
    expect(screen.getByTestId('store').textContent).toBe('{}');
  });

  it('setShopifyAdapter merges defined values and preserves previous ones', async () => {
    const mod = await fresh();
    mod.setShopifyAdapter({
      defaultLocale: 'fr',
      locales: ['fr', 'en'],
      useCart: () => ({ id: 'c' }) as any,
      useLocalizedHref: () => (to: any) => `/fr${String(to)}` as any,
      useVariantUrl: (handle: string) => `/fr/products/${handle}`,
      Brand: ({ children }: any) => <div data-testid="brand-x">{children}</div>,
    });
    const r = render(<Show useShopifyAdapter={mod.useShopifyAdapter} />);
    expect(screen.getByTestId('brand-x')).toBeInTheDocument();
    expect(screen.getByTestId('default-locale').textContent).toBe('fr');
    expect(screen.getByTestId('locales').textContent).toBe('fr,en');
    expect(screen.getByTestId('cart').textContent).toBe('[object Object]');
    expect(screen.getByTestId('variant-url').textContent).toBe('/fr/products/hat');
    expect(screen.getByTestId('href').textContent).toBe('/fr/p');

    mod.setShopifyAdapter({ useCart: undefined });
    r.rerender(<Show useShopifyAdapter={mod.useShopifyAdapter} />);
    expect(screen.getByTestId('cart').textContent).toBe('[object Object]');
  });

  it('ShopifyAdapterProvider is exported and renders children', async () => {
    const mod = await fresh();
    expect(typeof mod.ShopifyAdapterProvider).toBe('function');
    render(
      <mod.ShopifyAdapterProvider value={{}}>
        <div data-testid="inside">y</div>
      </mod.ShopifyAdapterProvider>,
    );
    expect(screen.getByTestId('inside')).toBeInTheDocument();
  });

  it('Provider merges with registry, ignores undefined, and context overrides win', async () => {
    const mod = await fresh();
    mod.setShopifyAdapter({
      defaultLocale: 'fr',
      locales: ['fr', 'en'],
      useLocalizedHref: () => (to: any) => `/fr${String(to)}` as any,
    });
    render(
      <mod.ShopifyAdapterProvider
        value={{
          defaultLocale: undefined,
          locales: ['pt'],
          useLocalizedHref: () => (to: any) => `/pt${String(to)}` as any,
        }}
      >
        <Show useShopifyAdapter={mod.useShopifyAdapter} />
      </mod.ShopifyAdapterProvider>,
    );
    expect(screen.getByTestId('default-locale').textContent).toBe('fr');
    expect(screen.getByTestId('locales').textContent).toBe('pt');
    expect(screen.getByTestId('href').textContent).toBe('/pt/p');
  });

  it('useVariantUrl ignores empty selectedOptions pairs', async () => {
    const mod = await fresh();
    const Variants = () => {
      const { useVariantUrl } = mod.useShopifyAdapter();
      return (
        <div data-testid="vu">
          {useVariantUrl('shoe', [
            { name: '', value: 'x' } as any,
            { name: 'Color', value: '' } as any,
          ])}
        </div>
      );
    };
    render(
      <mod.ShopifyAdapterProvider value={{}}>
        <Variants />
      </mod.ShopifyAdapterProvider>,
    );
    expect(screen.getByTestId('vu').textContent).toBe('/products/shoe');
  });
});
