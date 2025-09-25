import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/ui', () => ({
  cn: (...parts: any[]) => parts.filter(Boolean).join(' '),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('./CartEmpty', () => ({
  CartEmpty: ({ fallback }: any) => <div data-testid="empty">empty:{fallback}</div>,
}));

vi.mock('./CartLineItem', () => ({
  CartLineItem: ({ line, layout }: any) => (
    <div data-testid="line" data-id={line?.id} data-layout={layout} />
  ),
}));

vi.mock('./CartSummaryPanel', () => ({
  CartSummaryPanel: ({ cart, layout }: any) => (
    <div data-testid="summary" data-layout={layout} data-total={cart?.totalQuantity} />
  ),
}));

import { CartMain } from './CartMain';

const line = (id: string) => ({
  id,
  quantity: 1,
  merchandise: {
    product: { handle: 'h', title: 'T' },
    title: 'V',
    image: null,
    selectedOptions: [],
  },
  cost: { totalAmount: { amount: '1.00', currencyCode: 'USD' } },
});

function makeCart(qty: number, count: number) {
  return {
    id: 'c1',
    totalQuantity: qty,
    lines: { nodes: Array.from({ length: count }, (_, i) => line(`L${i + 1}`)) },
  } as any;
}

describe('CartMain', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null when cart is falsy', () => {
    const { container } = render(<CartMain cart={null as any} layout="page" fallback="/f" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders CartEmpty when there are no items and passes fallback', () => {
    render(<CartMain cart={makeCart(0, 0)} layout="aside" fallback="/collections/all" />);
    const empty = screen.getByTestId('empty');
    expect(empty).toBeInTheDocument();
    expect(empty).toHaveTextContent('empty:/collections/all');
    expect(screen.queryByTestId('line')).toBeNull();
    expect(screen.queryByTestId('summary')).toBeNull();
  });

  it('renders list of lines and summary when there are items', () => {
    const cart = makeCart(3, 3);
    render(<CartMain cart={cart} layout="page" fallback="/x" />);

    const heading = screen.getByRole('heading', { name: 'aria-title' });
    expect(heading).toBeInTheDocument();

    const list = heading.parentElement?.querySelector('ul') as HTMLElement;
    expect(list).toBeTruthy();
    expect(list.getAttribute('aria-labelledby')).toBe('cart-lines');

    const items = screen.getAllByTestId('line');
    expect(items.length).toBe(3);
    items.forEach((el, idx) => {
      expect(el).toHaveAttribute('data-id', `L${idx + 1}`);
      expect(el).toHaveAttribute('data-layout', 'page');
    });

    const summary = screen.getByTestId('summary');
    expect(summary).toHaveAttribute('data-layout', 'page');
    expect(summary).toHaveAttribute('data-total', '3');
  });

  it('uses page grid classes when layout="page"', () => {
    const cart = makeCart(2, 2);
    const { container } = render(<CartMain cart={cart} layout="page" fallback="/x" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/grid grid-cols-1/);
    const section = root.querySelector('section') as HTMLElement;
    const aside = root.querySelector('aside') as HTMLElement;
    expect(section.className).toMatch(/lg:col-span-2/);
    expect(aside.className).toMatch(/lg:col-span-1/);
  });

  it('uses stacked spacing when layout="aside"', () => {
    const cart = makeCart(1, 1);
    const { container } = render(<CartMain cart={cart} layout="aside" fallback="/x" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/space-y-5/);
    const section = root.querySelector('section') as HTMLElement;
    const aside = root.querySelector('aside') as HTMLElement;
    expect(section.className).not.toMatch(/lg:col-span/);
    expect(aside.className).not.toMatch(/lg:col-span/);
  });
});
