import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  fetcher: { state: 'idle', formData: undefined as any, data: undefined as any },
}));

vi.mock('@nuvens/ui', () => ({
  Card: ({ children, ...rest }: any) => (
    <article data-testid="card" {...rest}>
      {children}
    </article>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  Input: (props: any) => <input data-testid="input" {...props} />,
  Button: ({ children, ...rest }: any) => (
    <button data-testid="btn" {...rest}>
      {children}
    </button>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: (ns?: string) => {
    const t = (k: string, opts?: any) => {
      if (ns === 'cart') {
        if (k === 'giftcard.title') return 'Gift cards';
        if (k === 'giftcard.placeholder') return 'Gift card code';
      }
      if (ns === 'common') {
        if (k === 'actions.apply') return 'Apply';
        if (k === 'actions.remove') return 'Remove';
        if (k === 'status.applied') return 'Applied';
        if (k === 'status.invalid') return 'Invalid';
      }
      return k.replace(/^.+\./, '');
    };
    return { t };
  },
}));

vi.mock('./forms', () => ({
  UpdateGiftCardForm: ({ clear, children }: any) => {
    const fetcher = hoisted.fetcher;
    const stateObj = {
      lastEntered: fetcher.formData?.get?.('giftCardCode') || '',
    };
    return (
      <form
        data-testid={clear ? 'ugf-clear' : 'ugf'}
        data-state={fetcher.state}
        data-cart={JSON.stringify(fetcher.data || {})}
      >
        {clear ? <input type="hidden" name="giftCardCode" value="" /> : null}
        {typeof children === 'function' ? children(stateObj, fetcher) : children}
      </form>
    );
  },
}));

beforeEach(() => {
  hoisted.fetcher.state = 'idle';
  hoisted.fetcher.formData = undefined;
  hoisted.fetcher.data = undefined;
});

describe('GiftCardBox', () => {
  it('renders header, input with placeholder/aria-label and Apply button', async () => {
    const mod = await import('./GiftCardBox');
    render(<mod.GiftCardBox giftCards={[]} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Gift cards')).toBeInTheDocument();
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input).toHaveAttribute('placeholder', 'Gift card code');
    expect(input).toHaveAttribute('aria-label', 'Gift card code');
    const btn = screen.getByTestId('btn') as HTMLButtonElement;
    expect(btn).toHaveTextContent('Apply');
    expect(btn).not.toBeDisabled();
  });

  it('disables Apply button while loading', async () => {
    const mod = await import('./GiftCardBox');
    hoisted.fetcher.state = 'submitting';
    render(<mod.GiftCardBox giftCards={[]} />);
    const btn = screen.getByTestId('btn') as HTMLButtonElement;
    expect(btn).toBeDisabled();
  });

  it('prefills input defaultValue from lastEntered', async () => {
    const mod = await import('./GiftCardBox');
    const fd = new FormData();
    fd.set('giftCardCode', 'ZZZZ-1234');
    hoisted.fetcher.formData = fd;
    render(<mod.GiftCardBox giftCards={[]} />);
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input).toHaveValue('ZZZZ-1234');
  });

  it('shows success feedback when the last code matches applied gift cards after idle', async () => {
    const mod = await import('./GiftCardBox');
    const fd = new FormData();
    fd.set('giftCardCode', 'CODE-9999');
    hoisted.fetcher.formData = fd;
    hoisted.fetcher.state = 'submitting';
    const { rerender } = render(<mod.GiftCardBox giftCards={[]} />);
    hoisted.fetcher.state = 'idle';
    hoisted.fetcher.data = {
      cart: { appliedGiftCards: [{ lastCharacters: '9999' }] },
    };
    rerender(<mod.GiftCardBox giftCards={[]} />);
    expect(screen.getByText('Applied')).toBeInTheDocument();
  });

  it('shows error feedback when the last code does not match applied gift cards after idle', async () => {
    const mod = await import('./GiftCardBox');
    const fd = new FormData();
    fd.set('giftCardCode', 'CODE-1111');
    hoisted.fetcher.formData = fd;
    hoisted.fetcher.state = 'submitting';
    const { rerender } = render(<mod.GiftCardBox giftCards={[]} />);
    hoisted.fetcher.state = 'idle';
    hoisted.fetcher.data = { cart: { appliedGiftCards: [{ lastCharacters: '2222' }] } };
    rerender(<mod.GiftCardBox giftCards={[]} />);
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  it('renders applied gift cards list and a clear form with a disabled remove button while loading', async () => {
    const mod = await import('./GiftCardBox');
    const giftCards = [{ lastCharacters: '1234' }, { lastCharacters: '5678' }] as any[];
    hoisted.fetcher.state = 'submitting';
    render(<mod.GiftCardBox giftCards={giftCards} />);
    expect(screen.getByText('***1234, ***5678')).toBeInTheDocument();
    const clearForm = screen.getByTestId('ugf-clear');
    const hidden = clearForm.querySelector(
      'input[type="hidden"][name="giftCardCode"]',
    ) as HTMLInputElement;
    expect(hidden).toBeInTheDocument();
    expect(hidden.value).toBe('');
    const removeBtn = clearForm.querySelector('[data-testid="btn"]') as HTMLButtonElement;
    expect(removeBtn).toHaveTextContent('Remove');
    expect(removeBtn).toBeDisabled();
  });

  it('enables remove button when idle', async () => {
    const mod = await import('./GiftCardBox');
    const giftCards = [{ lastCharacters: '9999' }] as any[];
    hoisted.fetcher.state = 'idle';
    render(<mod.GiftCardBox giftCards={giftCards} />);
    const clearForm = screen.getByTestId('ugf-clear');
    const removeBtn = clearForm.querySelector('[data-testid="btn"]') as HTMLButtonElement;
    expect(removeBtn).not.toBeDisabled();
  });
});
