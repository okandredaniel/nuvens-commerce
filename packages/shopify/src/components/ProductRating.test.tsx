import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductRating } from './ProductRating';

vi.mock('@nuvens/ui', () => ({
  RatingStars: (p: any) => <div data-testid="stars" data-value={p.value} />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => {
      if (key === 'product:rating.aria' || key === 'rating.aria') {
        return `Rated ${opts?.value} out of 5`;
      }
      if (key === 'product:rating.see_all' || key === 'rating.see_all') {
        return 'See all';
      }
      return key;
    },
  }),
}));

describe('ProductRating', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders clamped rating with one decimal and ARIA label', () => {
    render(<ProductRating rating={5.7} />);
    const stars = screen.getByTestId('stars');
    expect(stars).toHaveAttribute('data-value', '5');
    expect(screen.getByText('5.0')).toBeInTheDocument();
    const root = screen.getByLabelText('Rated 5.0 out of 5');
    expect(root).toBeInTheDocument();
  });

  it('handles invalid rating as 0.0', () => {
    render(<ProductRating rating={NaN} />);
    const stars = screen.getByTestId('stars');
    expect(stars).toHaveAttribute('data-value', '0');
    expect(screen.getByText('0.0')).toBeInTheDocument();
    expect(screen.getByLabelText('Rated 0.0 out of 5')).toBeInTheDocument();
  });

  it('shows count when provided and hides when not provided', () => {
    const { rerender } = render(<ProductRating rating={3.25} count={42} />);
    expect(screen.getByText('(42)')).toBeInTheDocument();

    rerender(<ProductRating rating={3.25} count={null} />);
    expect(screen.queryByText(/\(\d+\)/)).toBeNull();

    rerender(<ProductRating rating={3.25} />);
    expect(screen.queryByText(/\(\d+\)/)).toBeNull();
  });

  it('renders "See all" link when hrefAllReviews is provided', () => {
    render(<ProductRating rating={4.2} hrefAllReviews="/reviews" />);
    const link = screen.getByRole('link', { name: 'See all' }) as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/reviews');
    expect(link).toHaveAttribute('title', 'See all');
  });

  it('passes the clamped safe value to RatingStars', () => {
    const { rerender } = render(<ProductRating rating={-3} />);
    const stars = screen.getByTestId('stars');
    expect(stars).toHaveAttribute('data-value', '0');

    rerender(<ProductRating rating={10} />);
    const stars2 = screen.getByTestId('stars');
    expect(stars2).toHaveAttribute('data-value', '5');
  });
});
