import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  path: '/',
  closeSpy: vi.fn(),
}));

vi.mock('@nuvens/ui', () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="btn" {...rest}>
      {children}
    </button>
  ),
  useAside: () => ({ close: hoisted.closeSpy }),
}));

vi.mock('lucide-react', () => ({
  ShoppingCart: (props: any) => <span data-testid="icon-cart" {...props} />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => {
      if (k === 'cart:empty.title' || k === 'empty.title') return 'Your cart is empty';
      if (k === 'cart:empty.body' || k === 'empty.body') return 'Add some products to get started.';
      if (k === 'cart:empty.benefit_easy_returns' || k === 'empty.benefit_easy_returns')
        return 'Easy returns';
      if (k === 'cart:empty.benefit_secure_checkout' || k === 'empty.benefit_secure_checkout')
        return 'Secure checkout';
      if (k === 'cart:empty.cta' || k === 'empty.cta') return 'Start shopping';
      return k;
    },
  }),
}));

vi.mock('react-router', () => ({
  Link: ({ to, onClick, children, prefetch, ...rest }: any) => (
    <a
      href={typeof to === 'string' ? to : String((to as any)?.pathname ?? to)}
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: hoisted.path }),
}));

import { CartEmpty } from './CartEmpty';

beforeEach(() => {
  hoisted.path = '/';
  hoisted.closeSpy.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CartEmpty', () => {
  it('renders icon, title, body, benefits and CTA', () => {
    render(<CartEmpty fallback="/collections/all" />);
    expect(screen.getByTestId('icon-cart')).toBeInTheDocument();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Add some products to get started.')).toBeInTheDocument();
    expect(screen.getByText('Easy returns')).toBeInTheDocument();
    expect(screen.getByText('Secure checkout')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Start shopping' }) as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
  });

  it('uses fallback as-is when no locale prefix is present in the path', () => {
    hoisted.path = '/cart';
    render(<CartEmpty fallback="/collections/all" />);
    const link = screen.getByRole('link', { name: 'Start shopping' }) as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/collections/all');
  });

  it('prefixes the fallback with lowercased locale when path starts with xx-YY', () => {
    hoisted.path = '/EN-us/cart';
    render(<CartEmpty fallback="/collections/all" />);
    const link = screen.getByRole('link', { name: 'Start shopping' }) as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/en-us/collections/all');
  });

  it('calls close() when CTA is clicked', async () => {
    const user = userEvent.setup();
    render(<CartEmpty fallback="/collections/all" />);
    const link = screen.getByRole('link', { name: 'Start shopping' });
    await user.click(link);
    expect(hoisted.closeSpy).toHaveBeenCalledTimes(1);
  });
});
