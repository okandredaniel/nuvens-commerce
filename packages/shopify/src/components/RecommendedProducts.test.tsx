import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RecommendedProducts } from './RecommendedProducts';

vi.mock('./ProductItem', () => ({
  ProductItem: ({ product }: any) => <div data-testid="item">{product.title}</div>,
}));

function deferred<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('RecommendedProducts', () => {
  it('shows fallback while loading and then renders items when resolved', async () => {
    const d = deferred<any | null>();
    render(<RecommendedProducts products={d.promise} />);

    expect(screen.getByText('Recommended Products')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      d.resolve({
        products: {
          nodes: [{ id: 'p1', title: 'Product 1' } as any, { id: 'p2', title: 'Product 2' } as any],
        },
      });
    });

    expect(screen.queryByText('Loading...')).toBeNull();
    const items = screen.getAllByTestId('item');
    expect(items.map((el) => el.textContent)).toEqual(['Product 1', 'Product 2']);
  });

  it('renders no items when the resolved value is null', async () => {
    render(<RecommendedProducts products={Promise.resolve(null)} />);

    expect(screen.getByText('Recommended Products')).toBeInTheDocument();
    await act(async () => {});
    expect(screen.queryAllByTestId('item')).toHaveLength(0);
  });
});
