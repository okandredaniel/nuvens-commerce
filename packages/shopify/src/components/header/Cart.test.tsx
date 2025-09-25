import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CartButton } from './Cart';

const hoisted = vi.hoisted(() => ({
  returnCart: null as any,
  openSpy: vi.fn(),
  publishSpy: vi.fn(),
}));

vi.mock('../../adapter', () => ({
  useShopifyAdapter: () => ({
    useCartMaybe: () => hoisted.returnCart,
  }),
}));

vi.mock('@nuvens/ui', () => {
  const Badge = ({ children, ...rest }: any) => (
    <span data-testid="badge" {...rest}>
      {children}
    </span>
  );
  const Button = ({ children, onClick, ...rest }: any) => (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  );
  const TooltipRoot = ({ children }: any) => <div>{children}</div>;
  const TooltipTrigger = ({ asChild, children }: any) =>
    asChild ? children : <div>{children}</div>;
  const TooltipContent = ({ children, ...rest }: any) => (
    <div role="tooltip" {...rest}>
      {children}
    </div>
  );
  const TooltipArrow = () => <span data-testid="tooltip-arrow" />;
  return {
    Badge,
    Button,
    Tooltip: {
      Root: TooltipRoot,
      Trigger: TooltipTrigger,
      Content: TooltipContent,
      Arrow: TooltipArrow,
    },
    useAside: () => ({ open: hoisted.openSpy }),
  };
});

vi.mock('@shopify/hydrogen', () => ({
  useAnalytics: () => ({
    publish: hoisted.publishSpy,
    shop: { id: 'shop' },
    cart: { id: 'cart' },
    prevCart: { id: 'prev' },
  }),
}));

vi.mock('lucide-react', () => ({
  ShoppingCart: (p: any) => <span data-testid="icon-cart" {...p} />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

describe('CartButton', () => {
  beforeEach(() => {
    hoisted.returnCart = null;
    hoisted.openSpy.mockReset();
    hoisted.publishSpy.mockReset();
  });

  it('renders button with aria-label, tooltip and icon', () => {
    render(<CartButton />);
    const btn = screen.getByRole('button', { name: 'nav.openCart' });
    expect(btn).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('nav.cart');
    expect(screen.getByTestId('icon-cart')).toBeInTheDocument();
  });

  it('shows quantity badge when cart has totalQuantity', () => {
    hoisted.returnCart = { totalQuantity: 3 };
    render(<CartButton />);
    expect(screen.getByTestId('badge')).toHaveTextContent('3');
  });

  it('resolves quantity when useCartMaybe returns a promise', async () => {
    hoisted.returnCart = Promise.resolve({ totalQuantity: 2 });
    render(<CartButton />);
    expect(screen.queryByTestId('badge')).toBeNull();
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByTestId('badge')).toHaveTextContent('2');
  });

  it('opens aside and publishes analytics on click', () => {
    hoisted.returnCart = { totalQuantity: 1 };
    render(<CartButton />);
    const btn = screen.getByRole('button', { name: 'nav.openCart' });
    fireEvent.click(btn);
    expect(hoisted.openSpy).toHaveBeenCalledWith('cart');
    expect(hoisted.publishSpy).toHaveBeenCalledTimes(1);
    const [eventName, payload] = hoisted.publishSpy.mock.calls[0];
    expect(eventName).toBe('cart_viewed');
    expect(payload).toMatchObject({
      shop: { id: 'shop' },
      cart: { id: 'cart' },
      prevCart: { id: 'prev' },
    });
    expect(typeof payload.url).toBe('string');
  });

  it('does not render badge when quantity is zero or cart missing', () => {
    hoisted.returnCart = { totalQuantity: 0 };
    render(<CartButton />);
    expect(screen.queryByTestId('badge')).toBeNull();
  });
});
