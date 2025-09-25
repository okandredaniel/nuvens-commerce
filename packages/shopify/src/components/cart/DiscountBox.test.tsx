import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  form: {
    state: 'idle' as 'idle' | 'loading' | 'submitting',
    formData: null as any,
    data: null as any,
  },
}));

vi.mock('@nuvens/ui', () => ({
  Button: ({ children, disabled, type, variant, size, ...rest }: any) => (
    <button
      data-testid="btn"
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      type={type}
      {...rest}
    >
      {children}
    </button>
  ),
  Card: ({ children }: any) => <article data-testid="card">{children}</article>,
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  Input: ({ ...rest }: any) => <input data-testid="input" {...rest} />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => {
      if (k === 'discount.title') return 'Discounts';
      if (k === 'discount.placeholder') return 'Discount code';
      if (k === 'actions.remove') return 'Remove';
      if (k === 'actions.apply') return 'Apply';
      if (k === 'status.applied') return 'Applied';
      if (k === 'status.invalid') return 'Invalid';
      return k;
    },
  }),
}));

vi.mock('./FeedbackArea', () => ({
  FeedbackArea: ({ loading, success, error, successText, errorText }: any) => (
    <div
      data-testid="feedback"
      data-loading={String(loading)}
      data-success={String(success)}
      data-error={String(error)}
      data-success-text={successText}
      data-error-text={errorText}
    />
  ),
}));

vi.mock('./forms', () => ({
  UpdateDiscountForm: ({ children }: any) => {
    const fetcher = {
      state: hoisted.form.state,
      formData: hoisted.form.formData,
      data: hoisted.form.data,
    };
    return (
      <form data-testid="udf" data-state={fetcher.state} onSubmit={(e) => e.preventDefault()}>
        {typeof children === 'function' ? children(fetcher) : children}
      </form>
    );
  },
}));

import { DiscountBox } from './DiscountBox';

beforeEach(() => {
  hoisted.form = { state: 'idle', formData: null, data: null };
});

describe('DiscountBox', () => {
  it('renders title', () => {
    render(<DiscountBox codes={[]} />);
    expect(screen.getByText('Discounts')).toBeInTheDocument();
  });

  it('shows applied codes and an enabled Remove button when fetcher is idle', () => {
    render(
      <DiscountBox
        codes={
          [
            { code: 'WELCOME10', applicable: true },
            { code: 'BOGO', applicable: false },
          ] as any
        }
      />,
    );
    expect(screen.getByText('WELCOME10')).toBeInTheDocument();
    const removeBtn = screen.getAllByTestId('btn')[0] as HTMLButtonElement;
    expect(removeBtn).toHaveTextContent('Remove');
    expect(removeBtn).not.toBeDisabled();
  });

  it('disables Remove button when fetcher is not idle', () => {
    hoisted.form.state = 'submitting';
    render(<DiscountBox codes={[{ code: 'WELCOME10', applicable: true }] as any} />);
    const removeBtn = screen.getAllByTestId('btn')[0] as HTMLButtonElement;
    expect(removeBtn).toBeDisabled();
  });

  it('renders input and Apply button; Apply is disabled while loading', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<DiscountBox codes={[]} />);
    const input = screen.getByTestId('input') as HTMLInputElement;
    expect(input).toHaveAttribute('placeholder', 'Discount code');

    const applyForm = input.closest('form') as HTMLFormElement;
    const applyBtn = applyForm.querySelector('[data-testid="btn"]') as HTMLButtonElement;
    expect(applyBtn).toHaveTextContent('Apply');
    expect(applyBtn).not.toBeDisabled();

    await user.type(input, 'WELCOME10');
    hoisted.form.state = 'submitting';
    rerender(<DiscountBox codes={[]} />);

    const input2 = screen.getByTestId('input') as HTMLInputElement;
    const applyBtn2 = input2
      .closest('form')!
      .querySelector('[data-testid="btn"]') as HTMLButtonElement;
    expect(applyBtn2).toBeDisabled();
  });

  it('shows success feedback when last applied code is applicable after idle', () => {
    hoisted.form.formData = new FormData();
    hoisted.form.formData.set('discountCode', 'WELCOME10');
    hoisted.form.state = 'submitting';
    const { rerender } = render(<DiscountBox codes={[]} />);

    hoisted.form.state = 'idle';
    hoisted.form.data = { cart: { discountCodes: [{ code: 'WELCOME10', applicable: true }] } };
    rerender(<DiscountBox codes={[]} />);

    const feedback = screen.getByTestId('feedback');
    expect(feedback).toHaveAttribute('data-loading', 'false');
    expect(feedback).toHaveAttribute('data-success', 'true');
    expect(feedback).toHaveAttribute('data-error', 'false');
    expect(feedback).toHaveAttribute('data-success-text', 'Applied');
  });

  it('shows error feedback when last applied code is not applicable after idle', () => {
    hoisted.form.formData = new FormData();
    hoisted.form.formData.set('discountCode', 'BADCODE');
    hoisted.form.state = 'submitting';
    const { rerender } = render(<DiscountBox codes={[]} />);

    hoisted.form.state = 'idle';
    hoisted.form.data = { cart: { discountCodes: [{ code: 'BADCODE', applicable: false }] } };
    rerender(<DiscountBox codes={[]} />);

    const feedback = screen.getByTestId('feedback');
    expect(feedback).toHaveAttribute('data-loading', 'false');
    expect(feedback).toHaveAttribute('data-success', 'false');
    expect(feedback).toHaveAttribute('data-error', 'true');
    expect(feedback).toHaveAttribute('data-error-text', 'Invalid');
  });

  it('uses existing applied codes when fetcher has no data', () => {
    render(
      <DiscountBox
        codes={
          [
            { code: 'KEEP10', applicable: true },
            { code: 'OLD', applicable: false },
          ] as any
        }
      />,
    );
    expect(screen.getByText('KEEP10')).toBeInTheDocument();
    expect(screen.queryByText('OLD')).not.toBeInTheDocument();
  });
});
