import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  aside: { open: vi.fn() },
}));

vi.mock('@nuvens/ui', () => {
  const Stepper = (p: any) => (
    <div data-testid="stepper">
      <button
        data-testid="dec"
        disabled={p.decDisabled}
        onClick={() => p.onChange?.(p.value - 1)}
      />
      <span data-testid="qty">{p.value}</span>
      <button
        data-testid="inc"
        disabled={p.incDisabled}
        onClick={() => p.onChange?.(p.value + 1)}
      />
    </div>
  );
  const Button = (p: any) => {
    if (p.asChild) return <>{p.children}</>;
    return (
      <button
        data-testid="btn"
        type={p.type || 'button'}
        aria-pressed={p['aria-pressed']}
        disabled={p.disabled}
        onClick={p.onClick}
      >
        {p.children}
      </button>
    );
  };
  const useAside = () => hoisted.aside;
  return { Stepper, Button, useAside, __aside: hoisted.aside };
});

vi.mock('./cart', () => ({
  AddToCartButton: ({ onClick, children, disabled, ariaLabel }: any) => (
    <button data-testid="add" onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}));

vi.mock('./LocalizedLink', () => ({
  LocalizedLink: (p: any) => (
    <a
      data-testid="ll"
      href={typeof p.to === 'string' ? p.to : String(p.to)}
      aria-current={p['aria-current']}
    >
      {p.children}
    </a>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: (ns?: string) => ({
    t: (k: string) => {
      const key = ns ? `${ns}:${k}` : k;
      if (key === 'product:addToCart') return 'Add to cart';
      if (key === 'product:soldOut') return 'Sold out';
      if (key === 'product:decrease') return 'Decrease';
      if (key === 'product:increase') return 'Increase';
      return k;
    },
  }),
}));

const navigateMock = vi.fn();
vi.mock('react-router', async () => {
  const mod: any = await vi.importActual('react-router');
  return { ...mod, useNavigate: () => navigateMock };
});

async function load() {
  const mod = await import('./ProductForm');
  return mod.ProductForm;
}

function makeValue(over: Partial<any> = {}) {
  return {
    name: 'Red',
    handle: 'prod-handle',
    variantUriQuery: 'Color=Red',
    selected: false,
    available: true,
    exists: true,
    isDifferentProduct: false,
    swatch: undefined,
    ...over,
  };
}

function makeOption(over: Partial<any> = {}) {
  return {
    name: 'Color',
    optionValues: [makeValue(), makeValue({ name: 'Blue', variantUriQuery: 'Color=Blue' })],
    ...over,
  };
}

const variantAvail = { id: 'gid://shopify/ProductVariant/1', availableForSale: true } as any;
const variantOOS = { id: 'gid://shopify/ProductVariant/2', availableForSale: false } as any;

describe('ProductForm', () => {
  it('skips options with a single value', async () => {
    const ProductForm = await load();
    const single = {
      name: 'Size',
      optionValues: [makeValue({ name: 'One', variantUriQuery: 'Size=One' })],
    };
    const { container } = render(
      <ProductForm productOptions={[single as any]} selectedVariant={variantAvail} />,
    );
    expect(container.querySelector('fieldset')).toBeNull();
  });

  it('navigates to variant query on same-product option click when not selected', async () => {
    navigateMock.mockReset();
    const ProductForm = await load();
    const opts = [makeOption()];
    render(<ProductForm productOptions={opts as any} selectedVariant={variantAvail} />);
    const buttons = screen.getAllByTestId('btn');
    fireEvent.click(buttons[0]);
    expect(navigateMock).toHaveBeenCalledWith('?Color=Red', {
      replace: true,
      preventScrollReset: true,
    });
  });

  it('renders LocalizedLink for different-product options with aria-current when selected', async () => {
    const ProductForm = await load();
    const diff = makeValue({
      isDifferentProduct: true,
      selected: true,
      handle: 'other',
      variantUriQuery: 'Color=Green',
      name: 'Green',
    });
    const filler = makeValue({ name: 'Gray', variantUriQuery: 'Color=Gray' });
    const opts = [{ name: 'Color', optionValues: [diff, filler] }];
    render(<ProductForm productOptions={opts as any} selectedVariant={variantAvail} />);
    const link = screen.getByTestId('ll') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/products/other?Color=Green');
    expect(link.getAttribute('aria-current')).toBe('true');
  });

  it('disables option when not exists or not available', async () => {
    const ProductForm = await load();
    const v1 = makeValue({ exists: false });
    const v2 = makeValue({ available: false, name: 'Blue', variantUriQuery: 'Color=Blue' });
    const opts = [{ name: 'Color', optionValues: [v1, v2] }];
    render(<ProductForm productOptions={opts as any} selectedVariant={variantAvail} />);
    const buttons = screen.getAllByTestId('btn');
    expect((buttons[0] as HTMLButtonElement).disabled).toBe(true);
    expect((buttons[1] as HTMLButtonElement).disabled).toBe(true);
  });

  it('increments quantity with Stepper and dispatches analytics + opens cart on add', async () => {
    const ProductForm = await load();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    hoisted.aside.open.mockReset();
    render(
      <ProductForm
        productOptions={[makeOption() as any]}
        selectedVariant={variantAvail}
        maxQty={5}
      />,
    );
    const inc = screen.getByTestId('inc');
    fireEvent.click(inc);
    fireEvent.click(inc);
    expect(screen.getByTestId('qty')).toHaveTextContent('3');
    const add = screen.getByTestId('add');
    fireEvent.click(add);
    const evt = dispatchSpy.mock.calls[0]?.[0] as CustomEvent;
    expect(evt.type).toBe('analytics:add_to_cart');
    expect((evt as any).detail).toEqual({ variantId: variantAvail.id, quantity: 3 });
    expect(hoisted.aside.open).toHaveBeenCalledWith('cart');
    dispatchSpy.mockRestore();
  });

  it('disables AddToCart and shows Sold out label when variant not available', async () => {
    const ProductForm = await load();
    render(<ProductForm productOptions={[makeOption() as any]} selectedVariant={variantOOS} />);
    const add = screen.getByTestId('add');
    expect(add).toBeDisabled();
    expect(add).toHaveTextContent('Sold out');
  });

  it('ProductOptionSwatch renders color and image variants', async () => {
    const ProductForm = await load();
    const valueWithColor = makeValue({ swatch: { color: '#ff0000' } });
    const valueWithImage = makeValue({
      name: 'Img',
      variantUriQuery: 'Style=Img',
      swatch: { image: { previewImage: { url: 'https://x/img.jpg' } } },
    });
    const opts = [{ name: 'Style', optionValues: [valueWithColor, valueWithImage] }];
    const { container } = render(
      <ProductForm productOptions={opts as any} selectedVariant={variantAvail} />,
    );
    const swatches = container.querySelectorAll('span[aria-hidden="true"]');
    expect(swatches.length).toBe(2);
    const style = (swatches[0] as HTMLElement).getAttribute('style') || '';
    expect(style).toMatch(/background-color:\s*(rgb\(255,\s*0,\s*0\)|#ff0000);?/i);
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toBe('https://x/img.jpg');
  });
});
