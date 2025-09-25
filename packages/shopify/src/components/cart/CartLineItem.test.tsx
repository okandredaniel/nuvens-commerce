import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  closeSpy: vi.fn(),
  variantUrlFn: vi.fn((handle: string, opts?: Array<{ name: string; value: string }>) => {
    const qs = (opts || [])
      .map((o) => `${encodeURIComponent(o.name)}=${encodeURIComponent(o.value)}`)
      .join('&');
    return `/products/${handle}${qs ? `?${qs}` : ''}`;
  }),
}));

vi.mock('@nuvens/ui', () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="btn" {...rest}>
      {children}
    </button>
  ),
  Stepper: ({
    value,
    decDisabled,
    incDisabled,
    onDecrement,
    onIncrement,
    decreaseLabel,
    increaseLabel,
  }: any) => (
    <div data-testid="stepper">
      <button
        data-testid="dec"
        onClick={onDecrement}
        disabled={decDisabled}
        aria-label={decreaseLabel}
      />
      <span data-testid="qty">{String(value)}</span>
      <button
        data-testid="inc"
        onClick={onIncrement}
        disabled={incDisabled}
        aria-label={increaseLabel}
      />
    </div>
  ),
  useAside: () => ({ close: hoisted.closeSpy }),
}));

vi.mock('@shopify/hydrogen', () => {
  const CartForm = ({ children, action, inputs, fetcherKey }: any) => (
    <div
      data-testid="cartform"
      data-action={action}
      data-key={fetcherKey}
      data-inputs={JSON.stringify(inputs)}
    >
      {children}
    </div>
  );
  (CartForm as any).ACTIONS = {
    LinesAdd: 'LinesAdd',
    LinesUpdate: 'LinesUpdate',
    LinesRemove: 'LinesRemove',
  };
  const Image = ({ alt, data, width, height, className }: any) => (
    <img
      data-testid="img"
      alt={alt}
      src={(data && (data.url || data.src)) || ''}
      width={width}
      height={height}
      className={className}
    />
  );
  return { CartForm, Image };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => {
      if (k === 'common:actions.remove' || k === 'actions.remove') return 'Remove';
      if (k === 'common:quantity.decrease' || k === 'quantity.decrease') return 'Decrease quantity';
      if (k === 'common:quantity.increase' || k === 'quantity.increase') return 'Increase quantity';
      return k;
    },
  }),
}));

vi.mock('react-router', () => ({
  Link: ({ to, onClick, children, className, 'aria-label': ariaLabel }: any) => (
    <a
      href={typeof to === 'string' ? to : String((to as any)?.pathname ?? to)}
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  ),
}));

vi.mock('../../adapter', () => ({
  useShopifyAdapter: () => ({
    useVariantUrl: (handle: string, opts?: Array<{ name: string; value: string }>) =>
      hoisted.variantUrlFn(handle, opts),
  }),
}));

vi.mock('../ProductPrice', () => ({
  ProductPrice: ({ price }: any) => (
    <div data-testid="price">{price ? `${price.amount} ${price.currencyCode}` : ''}</div>
  ),
}));

import { CartLineItem } from './CartLineItem';

type Line = {
  id: string;
  quantity?: number;
  isOptimistic?: boolean;
  merchandise: {
    product: { handle: string; title: string };
    title: string;
    image?: { url: string } | null;
    selectedOptions?: Array<{ name: string; value: string }>;
  };
  cost?: { totalAmount?: { amount: string; currencyCode: string } | null };
};

function makeLine(partial?: Partial<Line>): Line {
  const base: Line = {
    id: 'line-1',
    quantity: 2,
    isOptimistic: false,
    merchandise: {
      product: { handle: 'hat', title: 'Fancy Hat' },
      title: 'Fancy Hat Variant',
      image: { url: 'https://img/x.jpg' },
      selectedOptions: [{ name: 'Color', value: 'Red' }],
    },
    cost: { totalAmount: { amount: '10.00', currencyCode: 'USD' } },
  };
  const merch = { ...base.merchandise, ...(partial?.merchandise as any) };
  const cost = {
    totalAmount: {
      ...(base.cost?.totalAmount as any),
      ...((partial?.cost as any)?.totalAmount || {}),
    },
  };
  const merged: any = { ...base, ...(partial || {}) };
  merged.merchandise = merch;
  merged.cost = cost;
  return merged as Line;
}

beforeEach(() => {
  hoisted.closeSpy.mockReset();
  hoisted.variantUrlFn.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CartLineItem', () => {
  it('renders image link with correct href and aria-label, title link, price and options', async () => {
    const line = makeLine();
    render(<CartLineItem layout="aside" line={line as any} />);

    const href = '/products/hat?Color=Red';
    const imageLink = screen.getAllByRole('link', { name: 'Fancy Hat' })[0] as HTMLAnchorElement;
    expect(imageLink.getAttribute('href')).toBe(href);

    const img = screen.getByTestId('img') as HTMLImageElement;
    expect(img.alt).toBe('Fancy Hat Variant');
    expect(img.src).toMatch(/^https:\/\/img\/x\.jpg\/?$/);

    const titleLink = screen.getAllByRole('link')[1] as HTMLAnchorElement;
    expect(titleLink.textContent).toContain('Fancy Hat');
    expect(titleLink.getAttribute('href')).toBe(href);

    const price = screen.getByTestId('price');
    expect(price).toHaveTextContent('10.00 USD');

    expect(screen.getByText('Color:')).toBeInTheDocument();
    expect(screen.getByText('Red')).toBeInTheDocument();
  });

  it('calls close when links are clicked in aside layout', async () => {
    const user = userEvent.setup();
    const line = makeLine();
    render(<CartLineItem layout="aside" line={line as any} />);
    const links = screen.getAllByRole('link');
    await user.click(links[0]);
    await user.click(links[1]);
    expect(hoisted.closeSpy).toHaveBeenCalledTimes(2);
  });

  it('does not render image section when image is null', () => {
    const line = makeLine({
      merchandise: {
        product: { handle: 'p', title: 'P' },
        title: 'V',
        image: null,
        selectedOptions: [],
      } as any,
    });
    render(<CartLineItem layout="page" line={line as any} />);
    expect(screen.queryByTestId('img')).toBeNull();
  });

  it('renders decrement/increment CartForms with correct inputs and keys', () => {
    const line = makeLine({ id: 'L', quantity: 3 });
    render(<CartLineItem layout="page" line={line as any} />);

    const forms = screen
      .getAllByTestId('cartform')
      .filter((el) => el.getAttribute('data-action') === 'LinesUpdate');
    const dec = forms.find((el) =>
      (el.getAttribute('data-key') || '').endsWith('dec'),
    ) as HTMLElement;
    const inc = forms.find((el) =>
      (el.getAttribute('data-key') || '').endsWith('inc'),
    ) as HTMLElement;

    const decInputs = JSON.parse(dec.getAttribute('data-inputs') || '{}');
    const incInputs = JSON.parse(inc.getAttribute('data-inputs') || '{}');

    expect(decInputs.lines[0].id).toBe('L');
    expect(decInputs.lines[0].quantity).toBe(2);
    expect(incInputs.lines[0].id).toBe('L');
    expect(incInputs.lines[0].quantity).toBe(4);

    const qty = screen.getByTestId('qty');
    expect(qty).toHaveTextContent('3');
  });

  it('disables stepper buttons correctly when quantity is 1 or line is optimistic', () => {
    const line1 = makeLine({ quantity: 1, isOptimistic: false });
    const { rerender } = render(<CartLineItem layout="page" line={line1 as any} />);
    expect(screen.getByTestId('dec')).toBeDisabled();
    expect(screen.getByTestId('inc')).not.toBeDisabled();

    const line2 = makeLine({ quantity: 1, isOptimistic: true });
    rerender(<CartLineItem layout="page" line={line2 as any} />);
    expect(screen.getByTestId('dec')).toBeDisabled();
    expect(screen.getByTestId('inc')).toBeDisabled();
  });

  it('renders remove button and LinesRemove form with correct payload; disabled when optimistic', () => {
    const line = makeLine({ isOptimistic: true });
    render(<CartLineItem layout="page" line={line as any} />);

    const removeBtn = screen.getByRole('button', { name: 'Remove' }) as HTMLButtonElement;
    expect(removeBtn).toBeDisabled();

    const removeForm = screen
      .getAllByTestId('cartform')
      .find((el) => el.getAttribute('data-action') === 'LinesRemove') as HTMLElement;
    const removeInputs = JSON.parse(removeForm.getAttribute('data-inputs') || '{}');
    expect(removeInputs.lineIds).toEqual([line.id]);
  });
});
