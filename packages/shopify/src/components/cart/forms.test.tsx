import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  fetcher: { state: 'idle', formData: undefined as any, data: undefined as any },
}));

vi.mock('@shopify/hydrogen', () => {
  const ACTIONS = {
    DiscountCodesUpdate: 'DiscountCodesUpdate',
    GiftCardCodesUpdate: 'GiftCardCodesUpdate',
  };
  const CartForm = ({ route, action, inputs, children }: any) => {
    const tid = action === ACTIONS.DiscountCodesUpdate ? 'udf' : 'ugf';
    return (
      <form
        data-testid={tid}
        data-route={route}
        data-action={action}
        data-inputs={JSON.stringify(inputs)}
      >
        {typeof children === 'function' ? children(hoisted.fetcher) : children}
      </form>
    );
  };
  (CartForm as any).ACTIONS = ACTIONS;
  return { CartForm };
});

beforeEach(() => {
  hoisted.fetcher.state = 'idle';
  hoisted.fetcher.formData = undefined;
  hoisted.fetcher.data = undefined;
});

describe('forms', () => {
  it('UpdateDiscountForm renders with route/action/inputs and supports function children', async () => {
    const mod = await import('./forms');
    render(
      <mod.UpdateDiscountForm discountCodes={['SAVE10']}>
        {(fetcher: any) => <div data-testid="child">{fetcher.state}</div>}
      </mod.UpdateDiscountForm>,
    );
    const form = screen.getByTestId('udf');
    expect(form).toHaveAttribute('data-route', '/cart');
    expect(form).toHaveAttribute('data-action', 'DiscountCodesUpdate');
    expect(JSON.parse(form.getAttribute('data-inputs') || '{}')).toEqual({
      discountCodes: ['SAVE10'],
    });
    expect(screen.getByTestId('child')).toHaveTextContent('idle');
  });

  it('UpdateDiscountForm accepts ReactNode children', async () => {
    const mod = await import('./forms');
    render(<mod.UpdateDiscountForm>ok</mod.UpdateDiscountForm>);
    expect(screen.getByTestId('udf')).toBeInTheDocument();
  });

  it('UpdateGiftCardForm renders with route/action/inputs and exposes lastEntered from formData', async () => {
    const mod = await import('./forms');
    const fd = new FormData();
    fd.set('giftCardCode', 'ABCD1234');
    hoisted.fetcher.formData = fd;
    render(
      <mod.UpdateGiftCardForm>
        {(state: any) => <div data-testid="last">{state.lastEntered}</div>}
      </mod.UpdateGiftCardForm>,
    );
    const form = screen.getByTestId('ugf');
    expect(form).toHaveAttribute('data-route', '/cart');
    expect(form).toHaveAttribute('data-action', 'GiftCardCodesUpdate');
    expect(JSON.parse(form.getAttribute('data-inputs') || '{}')).toEqual({ giftCardCodes: [] });
    expect(screen.getByTestId('last')).toHaveTextContent('ABCD1234');
  });

  it('UpdateGiftCardForm renders hidden input when clear is true', async () => {
    const mod = await import('./forms');
    render(<mod.UpdateGiftCardForm clear>ok</mod.UpdateGiftCardForm>);
    const form = screen.getByTestId('ugf');
    const hidden = form.querySelector(
      'input[type="hidden"][name="giftCardCode"]',
    ) as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden.value).toBe('');
  });

  it('UpdateGiftCardForm accepts ReactNode children', async () => {
    const mod = await import('./forms');
    render(<mod.UpdateGiftCardForm>ok</mod.UpdateGiftCardForm>);
    expect(screen.getByTestId('ugf')).toBeInTheDocument();
  });
});
