import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReviewCard } from './ReviewCard';

function TestImage(props: any) {
  return <img alt="alt" {...props} />;
}

describe('ReviewCard', () => {
  it('renders name, text, logo image and rating block', () => {
    render(
      <ReviewCard
        name="Alice"
        text="Great mattress"
        rating={4.5}
        ratingLabel="Overall rating"
        Image={TestImage as any}
        logoSrc="/trustpilot.svg"
      />,
    );
    expect(screen.getByRole('heading', { name: 'Alice' })).toBeInTheDocument();
    expect(screen.getByText('Great mattress')).toBeInTheDocument();
    const logo = screen.getByRole('img', { name: 'Trustpilot' }) as HTMLImageElement;
    expect(logo).toHaveAttribute('src', '/trustpilot.svg');
    expect(logo).toHaveAttribute(
      'sizes',
      '(min-width:1024px) 560px, (min-width:768px) 50vw, 100vw',
    );
    const ratingBlock = screen.getByLabelText('Overall rating');
    expect(ratingBlock).toBeInTheDocument();
    expect(screen.getByText('4.5/5')).toBeInTheDocument();
  });

  it('renders verified badge and date when provided', () => {
    render(
      <ReviewCard
        name="Bob"
        text="Very comfy"
        rating={5}
        ratingLabel="Rating"
        Image={TestImage as any}
        logoSrc="/trustpilot.svg"
        verified
        verifiedLabel="Verified purchase"
        date="2025-08-01"
      />,
    );
    expect(screen.getByText('Verified purchase')).toBeInTheDocument();
    expect(screen.getByText('2025-08-01')).toBeInTheDocument();
  });

  it('does not render meta row when neither verified nor date', () => {
    render(
      <ReviewCard
        name="Carol"
        text="Nice support"
        rating={4}
        ratingLabel="Rating"
        Image={TestImage as any}
        logoSrc="/trustpilot.svg"
      />,
    );
    expect(screen.queryByText('Verified purchase')).toBeNull();
    expect(screen.queryByText('2025-08-01')).toBeNull();
  });

  it('uses custom rating label for accessibility', () => {
    render(
      <ReviewCard
        name="Dave"
        text="Good value"
        rating={3}
        ratingLabel="Customer score"
        Image={TestImage as any}
        logoSrc="/trustpilot.svg"
      />,
    );
    expect(screen.getByLabelText('Customer score')).toBeInTheDocument();
  });

  it('renders title as h3', () => {
    render(
      <ReviewCard
        name="Erin"
        text="Solid build"
        rating={4}
        ratingLabel="Rating"
        Image={TestImage as any}
        logoSrc="/trustpilot.svg"
      />,
    );
    const h = screen.getByRole('heading', { name: 'Erin', level: 3 });
    expect(h.tagName).toBe('H3');
  });
});
