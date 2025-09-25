import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/ui', () => ({
  Aside: ({ children, heading, type }: any) => (
    <aside data-testid="aside" data-type={type} data-heading={heading}>
      {children}
    </aside>
  ),
}));

vi.mock('./CartMain', () => ({
  CartMain: ({ cart, layout, fallback }: any) => (
    <div
      data-testid="cart-main"
      data-layout={layout}
      data-fallback={fallback}
      data-id={cart?.id ?? ''}
    />
  ),
}));

import { CartAside } from './CartAside';

describe('CartAside', () => {
  it('returns null when cart is falsy', () => {
    const { container } = render(
      <CartAside cart={null as any} heading="Your cart" fallback="Loading..." />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders Aside with heading and CartMain with layout and props', () => {
    const cart = { id: 'gid://cart/1', updatedAt: '2024-01-01T00:00:00Z', totalQuantity: 3 } as any;
    render(<CartAside cart={cart} heading="Your cart" fallback="Loading..." />);

    const aside = screen.getByTestId('aside');
    expect(aside).toHaveAttribute('data-type', 'cart');
    expect(aside).toHaveAttribute('data-heading', 'Your cart');

    const main = screen.getByTestId('cart-main');
    expect(main).toHaveAttribute('data-layout', 'aside');
    expect(main).toHaveAttribute('data-fallback', 'Loading...');
    expect(main).toHaveAttribute('data-id', 'gid://cart/1');
  });
});
