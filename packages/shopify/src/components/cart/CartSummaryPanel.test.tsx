import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  routeData: { consent: { checkoutDomain: 'checkout.example.com' }, publicStoreDomain: '' },
}));

vi.mock('@nuvens/ui', () => ({
  Button: ({ children, asChild, className, size }: any) =>
    asChild ? (
      <div data-testid="btn-as-child" data-class={className} data-size={size}>
        {children}
      </div>
    ) : (
      <button data-testid="btn" className={className} data-size={size}>
        {children}
      </button>
    ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('react-router', () => ({
  useRouteLoaderData: () => hoisted.routeData,
}));

vi.mock('.', () => ({
  CartSummary: ({ cart, layout }: any) => (
    <div data-testid="summary" data-layout={layout}>
      {String(!!cart)}
    </div>
  ),
  DiscountBox: ({ codes }: any) => (
    <div data-testid="discount" data-codes={JSON.stringify(codes || [])} />
  ),
  GiftCardBox: ({ giftCards }: any) => (
    <div data-testid="giftcards" data-gc={JSON.stringify(giftCards || [])} />
  ),
}));

import { CartSummaryPanel } from './CartSummaryPanel';

function makeCart(overrides: Partial<any> = {}) {
  return {
    id: 'gid://shopify/Cart/abc123',
    checkoutUrl: undefined,
    discountCodes: [{ code: 'WELCOME10' }],
    appliedGiftCards: [{ lastCharacters: '1234' }],
    ...overrides,
  } as any;
}

function b64(s: string) {
  return Buffer.from(s, 'utf-8').toString('base64');
}

beforeEach(() => {
  (globalThis as any).atob = (b: string) => Buffer.from(b, 'base64').toString('utf-8');
});

describe('CartSummaryPanel', () => {
  it('returns null when cart is falsy', () => {
    const { container } = render(<CartSummaryPanel cart={null as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders summary, discount and giftcard boxes and passes layout through', () => {
    render(<CartSummaryPanel cart={makeCart()} layout="page" />);
    expect(screen.getByTestId('summary')).toHaveAttribute('data-layout', 'page');
    expect(screen.getByTestId('discount')).toHaveAttribute(
      'data-codes',
      JSON.stringify([{ code: 'WELCOME10' }]),
    );
    expect(screen.getByTestId('giftcards')).toHaveAttribute(
      'data-gc',
      JSON.stringify([{ lastCharacters: '1234' }]),
    );
  });

  it('renders checkout button using checkoutUrl when present', () => {
    render(<CartSummaryPanel cart={makeCart({ checkoutUrl: 'https://x/checkout' })} />);
    const anchor = screen.getByRole('link', { name: 'checkout.cta' }) as HTMLAnchorElement;
    expect(anchor).toHaveAttribute('href', 'https://x/checkout');
    expect(screen.getByTestId('btn-as-child')).toHaveAttribute('data-size', 'lg');
  });

  it('builds fallback checkout URL from cart id and loader checkoutDomain when checkoutUrl is missing', () => {
    const id = b64('gid://shopify/Cart/zzz999');
    render(<CartSummaryPanel cart={makeCart({ id })} />);
    const anchor = screen.getByRole('link', { name: 'checkout.cta' }) as HTMLAnchorElement;
    expect(anchor).toHaveAttribute('href', 'https://checkout.example.com/cart/c/zzz999');
  });

  it('uses publicStoreDomain when consent.checkoutDomain is not set', () => {
    hoisted.routeData = { consent: {}, publicStoreDomain: 'store.myshopify.com' } as any;
    const id = b64('gid://shopify/Cart/tok321');
    render(<CartSummaryPanel cart={makeCart({ id })} />);
    const anchor = screen.getByRole('link', { name: 'checkout.cta' }) as HTMLAnchorElement;
    expect(anchor).toHaveAttribute('href', 'https://store.myshopify.com/cart/c/tok321');
  });

  it('omits checkout action when neither checkoutUrl nor fallback pieces are available', () => {
    hoisted.routeData = { consent: {}, publicStoreDomain: '' } as any;
    render(<CartSummaryPanel cart={makeCart({ id: undefined, checkoutUrl: undefined })} />);
    expect(screen.queryByRole('link', { name: 'checkout.cta' })).toBeNull();
  });
});
