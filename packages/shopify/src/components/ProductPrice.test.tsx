import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductPrice } from './ProductPrice';

vi.mock('@shopify/hydrogen', () => ({
  Money: (p: any) => (
    <span data-testid="money">
      {p.data?.amount} {p.data?.currencyCode}
    </span>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => {
      if (key === 'price.save_percent') return `Save ${opts?.value}%`;
      if (key === 'price.from') return 'From';
      return key;
    },
    i18n: { exists: () => true },
  }),
}));

const mkMoney = (
  amount: string,
  currencyCode: MoneyV2['currencyCode'] = 'USD' as unknown as MoneyV2['currencyCode'],
): MoneyV2 => ({ amount, currencyCode }) as MoneyV2;

describe('ProductPrice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders blank placeholder when price is missing', () => {
    const { container } = render(<ProductPrice />);
    const root = container.querySelector('.product-price') as HTMLElement;
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute('aria-hidden', 'true');
    const span = root.querySelector('span') as HTMLSpanElement;
    expect(span).toBeInTheDocument();
  });

  it('renders single price when not on sale', () => {
    render(<ProductPrice price={mkMoney('19.90')} compareAtPrice={mkMoney('19.90')} />);
    const price = screen.getByTestId('money');
    expect(price).toHaveTextContent('19.90 USD');
    expect(screen.queryByText('From')).toBeNull();
    expect(screen.queryByRole('s')).toBeNull();

    const metaCurrency = screen.getByText(
      (_, el) => el?.tagName === 'META' && el.getAttribute('itemprop') === 'priceCurrency',
    ) as HTMLElement;
    const metaAmount = screen.getByText(
      (_, el) => el?.tagName === 'META' && el.getAttribute('itemprop') === 'price',
    ) as HTMLElement;

    expect(metaCurrency).toHaveAttribute('content', 'USD');
    expect(metaAmount).toHaveAttribute('content', '19.90');
  });

  it('renders compare-at, current price, "From" label and discount badge when on sale', () => {
    render(<ProductPrice price={mkMoney('75.00')} compareAtPrice={mkMoney('100.00')} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    const allMoney = screen.getAllByTestId('money');
    expect(allMoney[0]).toHaveTextContent('100.00 USD');
    expect(allMoney[1]).toHaveTextContent('75.00 USD');
    const badge = screen.getByText('Save 25%');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('aria-label', 'Save 25%');

    const metaCurrency = screen.getByText(
      (_, el) => el?.tagName === 'META' && el.getAttribute('itemprop') === 'priceCurrency',
    ) as HTMLElement;
    const metaAmount = screen.getByText(
      (_, el) => el?.tagName === 'META' && el.getAttribute('itemprop') === 'price',
    ) as HTMLElement;

    expect(metaCurrency).toHaveAttribute('content', 'USD');
    expect(metaAmount).toHaveAttribute('content', '75.00');
  });

  it('does not render discount badge when computed percent rounds to 0', () => {
    render(<ProductPrice price={mkMoney('9.96')} compareAtPrice={mkMoney('10.00')} />);
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.queryByText(/Save \d+%/)).toBeNull();
  });
});
