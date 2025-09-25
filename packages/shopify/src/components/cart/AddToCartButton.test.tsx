import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  fetcherState: 'idle' as 'idle' | 'loading' | 'submitting',
}));

vi.mock('@nuvens/ui', () => ({
  Button: ({ children, className, ...rest }: any) => (
    <button data-testid="btn" className={className} {...rest}>
      {children}
    </button>
  ),
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

vi.mock('@shopify/hydrogen', () => {
  const CartForm = ({ children }: any) => {
    return <form data-testid="form">{children({ state: hoisted.fetcherState })}</form>;
  };
  (CartForm as any).ACTIONS = { LinesAdd: 'LinesAdd' };
  return { CartForm };
});

import { AddToCartButton } from './AddToCartButton';

beforeEach(() => {
  hoisted.fetcherState = 'idle';
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('AddToCartButton', () => {
  it('renders a submit button with label and children', () => {
    render(
      <AddToCartButton ariaLabel="Add to cart" disabled={false} lines={[]} onClick={() => {}}>
        Add
      </AddToCartButton>,
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('aria-label', 'Add to cart');
    expect(btn).toHaveTextContent('Add');
  });

  it('respects disabled prop when idle', () => {
    render(
      <AddToCartButton ariaLabel="x" disabled lines={[]} onClick={() => {}}>
        X
      </AddToCartButton>,
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'false');
    expect(btn).toHaveAttribute('data-state', 'idle');
  });

  it('shows busy state while submitting', () => {
    hoisted.fetcherState = 'submitting';
    render(
      <AddToCartButton ariaLabel="x" disabled={false} lines={[]} onClick={() => {}}>
        X
      </AddToCartButton>,
    );
    const btn = screen.getByTestId('btn');
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(btn).toHaveAttribute('data-state', 'submitting');
    expect(btn).toBeDisabled();
  });

  it('shows success style after submit completes and hides it after 2s', async () => {
    const { rerender } = render(
      <AddToCartButton ariaLabel="x" disabled={false} lines={[]} onClick={() => {}}>
        Added
      </AddToCartButton>,
    );
    hoisted.fetcherState = 'submitting';
    rerender(
      <AddToCartButton ariaLabel="x" disabled={false} lines={[]} onClick={() => {}}>
        Added
      </AddToCartButton>,
    );
    hoisted.fetcherState = 'idle';
    rerender(
      <AddToCartButton ariaLabel="x" disabled={false} lines={[]} onClick={() => {}}>
        Added
      </AddToCartButton>,
    );
    const btn = screen.getByTestId('btn');
    expect(btn.className).toMatch(/bg-green-600/);
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(btn.className).not.toMatch(/bg-green-600/);
  });

  it('defers onClick by 500ms and debounces multiple clicks', async () => {
    const onClick = vi.fn();
    render(
      <AddToCartButton ariaLabel="x" disabled={false} lines={[]} onClick={onClick}>
        Buy
      </AddToCartButton>,
    );
    const btn = screen.getByTestId('btn');

    fireEvent.click(btn);
    await act(async () => {
      vi.advanceTimersByTime(499);
    });
    expect(onClick).not.toHaveBeenCalled();
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(onClick).toHaveBeenCalledTimes(1);

    onClick.mockClear();
    fireEvent.click(btn);
    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    fireEvent.click(btn);
    await act(async () => {
      vi.advanceTimersByTime(499);
    });
    expect(onClick).not.toHaveBeenCalled();
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('passes lines into the form render flow (rendered)', () => {
    render(
      <AddToCartButton
        ariaLabel="x"
        disabled={false}
        lines={[{ merchandiseId: 'gid://p/1', quantity: 2 } as any]}
        onClick={() => {}}
      >
        Add
      </AddToCartButton>,
    );
    expect(screen.getByTestId('form')).toBeInTheDocument();
  });
});
