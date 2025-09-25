import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FooterPayments } from './FooterPayments';

describe('FooterPayments', () => {
  it('renders heading and payment method badges', () => {
    render(<FooterPayments />);
    expect(screen.getByRole('heading', { level: 3, name: 'Payment Methods' })).toBeInTheDocument();
    expect(screen.getByText('VISA')).toBeInTheDocument();
    expect(screen.getByText('PayPal')).toBeInTheDocument();
    expect(screen.getByText('Maestro')).toBeInTheDocument();
    expect(screen.getByText('Mastercard')).toBeInTheDocument();
    expect(screen.getByText('Discover')).toBeInTheDocument();
    const badges = screen.getAllByText(/^(VISA|PayPal|Maestro|Mastercard|Discover)$/);
    expect(badges).toHaveLength(5);
  });
});
