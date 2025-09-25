import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductItem } from './ProductItem';

vi.mock('@shopify/hydrogen', () => ({
  Image: (p: any) => (
    <img
      data-testid="img"
      alt={p.alt}
      src={p.data?.url || ''}
      loading={p.loading}
      data-aspect={p.aspectRatio}
      data-sizes={p.sizes}
      className={p.className}
    />
  ),
  Money: (p: any) => (
    <span data-testid="money">
      {p.data?.amount} {p.data?.currencyCode}
    </span>
  ),
}));

vi.mock('react-router', () => ({
  NavLink: ({ to, children, ...rest }: any) => {
    const href = typeof to === 'string' ? to : to?.pathname || '';
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
}));

vi.mock('../adapter', () => ({
  useShopifyAdapter: () => ({
    useVariantUrl: (handle: string) => `/products/${handle}`,
    useLocalizedHref: () => (to: any) => (typeof to === 'string' ? to : to?.pathname || ''),
  }),
}));

function makeProduct(overrides: Partial<any> = {}) {
  return {
    handle: 'hat',
    title: 'Warm Hat',
    featuredImage: { url: 'https://x/img.jpg', altText: 'Alt' },
    priceRange: { minVariantPrice: { amount: '19.90', currencyCode: 'USD' } },
    ...overrides,
  };
}

describe('ProductItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('links to variant url and renders image, title and price', () => {
    const product = makeProduct();
    render(<ProductItem product={product as any} />);
    const link = screen.getByRole('link', { name: 'Warm Hat' }) as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/products/hat');
    expect(screen.getByText('Warm Hat')).toBeInTheDocument();
    const img = screen.getByTestId('img') as HTMLImageElement;
    expect(img).toHaveAttribute('alt', 'Alt');
    expect(img).toHaveAttribute('src', 'https://x/img.jpg');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('data-aspect', '1/1');
    expect(img).toHaveAttribute(
      'data-sizes',
      '(min-width: 1024px) 320px, (min-width: 768px) 33vw, 50vw',
    );
    expect(screen.getByTestId('money').textContent).toBe('19.90 USD');
  });

  it('respects eager loading for image', () => {
    const product = makeProduct();
    render(<ProductItem product={product as any} loading="eager" />);
    const img = screen.getByTestId('img') as HTMLImageElement;
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('omits image when featuredImage is null', () => {
    const product = makeProduct({ featuredImage: null });
    render(<ProductItem product={product as any} />);
    expect(screen.queryByTestId('img')).toBeNull();
  });

  it('renders price only when present', () => {
    const withPrice = makeProduct();
    render(<ProductItem product={withPrice as any} />);
    expect(screen.getByTestId('money')).toBeInTheDocument();
  });

  it('omits price section when priceRange is missing', () => {
    const noPrice = makeProduct({ priceRange: undefined });
    render(<ProductItem product={noPrice as any} />);
    expect(screen.queryByTestId('money')).toBeNull();
  });
});
