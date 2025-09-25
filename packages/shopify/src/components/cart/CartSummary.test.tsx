import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/ui', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('@shopify/hydrogen', () => ({
  Money: ({ data }: any) => (
    <span data-testid="money">
      {String(data?.amount)} {String(data?.currencyCode)}
    </span>
  ),
}));

import { CartSummary } from './CartSummary';

function makeCart(subtotal?: { amount: string; currencyCode: string }) {
  return {
    cost: {
      subtotalAmount: subtotal ? { ...subtotal } : null,
    },
  } as any;
}

describe('CartSummary', () => {
  it('renders the card with title and structure', () => {
    render(<CartSummary cart={makeCart()} layout="page" />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toHaveClass('p-4 sm:p-5');
    expect(screen.getByRole('heading', { name: 'summary.title' })).toBeInTheDocument();
    expect(screen.getByText('summary.subtotal')).toBeInTheDocument();
  });

  it('shows "-" when subtotal is missing', () => {
    render(<CartSummary cart={makeCart()} layout="aside" />);
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.queryByTestId('money')).toBeNull();
  });

  it('renders Money when subtotal is present', () => {
    render(
      <CartSummary cart={makeCart({ amount: '123.45', currencyCode: 'USD' })} layout="page" />,
    );
    const money = screen.getByTestId('money');
    expect(money).toHaveTextContent('123.45 USD');
    expect(screen.queryByText('-')).toBeNull();
  });
});
