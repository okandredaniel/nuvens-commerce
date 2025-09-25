import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

const hoisted = vi.hoisted(() => ({
  languageReturn: { options: [{ isoCode: 'en', href: '/', label: 'EN' }], current: 'en' },
  asideOpenSpy: vi.fn(),
}));

vi.mock('@nuvens/ui', () => ({
  Container: ({ children, className }: any) => (
    <div data-testid="container" className={className}>
      {children}
    </div>
  ),
  Button: ({ children, className, ...rest }: any) => (
    <button className={className} {...rest}>
      {children}
    </button>
  ),
  useAside: () => ({ open: hoisted.asideOpenSpy }),
  Tooltip: {
    Root: ({ children }: any) => <div data-testid="tooltip-root">{children}</div>,
    Trigger: ({ children, asChild }: any) =>
      asChild ? <>{children}</> : <button data-testid="tooltip-trigger">{children}</button>,
    Content: ({ children }: any) => <div data-testid="tooltip-content">{children}</div>,
    Arrow: () => <div data-testid="tooltip-arrow" />,
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('../LocalizedNavLink', () => ({
  LocalizedNavLink: ({ to, children, className, ...rest }: any) => (
    <a
      href={typeof to === 'string' ? to : String((to as any)?.pathname ?? to)}
      className={className}
      data-testid="lnl"
      {...rest}
    >
      {children}
    </a>
  ),
}));

vi.mock('./Cart', () => ({
  CartButton: () => <button data-testid="cart">cart</button>,
}));

vi.mock('./HeaderMenu', () => ({
  HeaderMenu: () => <nav data-testid="menu">menu</nav>,
}));

vi.mock('./LanguageSwitcher', () => ({
  LanguageSwitcher: ({ options, current }: any) => (
    <div data-testid="lang">
      {String(options?.length)}:{String(current)}
    </div>
  ),
}));

vi.mock('../../i18n/useLanguageOptions', () => ({
  useLanguageOptions: () => hoisted.languageReturn,
}));

function Brand() {
  return <span data-testid="brand">B</span>;
}

function setup(extra?: Partial<React.ComponentProps<typeof Header>>) {
  const props: React.ComponentProps<typeof Header> = {
    Brand,
    pref: 'transparent',
    menu: {} as any,
    primaryDomainUrl: 'https://primary.example',
    publicStoreDomain: 'example.myshopify.com',
    ...extra,
  };
  return render(<Header {...props} />);
}

let originalRAF: typeof window.requestAnimationFrame;
let originalAdd: typeof window.addEventListener;
let originalRemove: typeof window.removeEventListener;
let scrollHandler: ((e?: any) => void) | null = null;

function setScroll(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true });
  scrollHandler?.();
}

async function flush() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe('Header', () => {
  beforeEach(() => {
    cleanup();
    hoisted.languageReturn = {
      options: [{ isoCode: 'en', href: '/', label: 'EN' }],
      current: 'en',
    };
    hoisted.asideOpenSpy.mockReset();
    scrollHandler = null;

    originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = ((cb: any) => {
      cb(0);
      return 1 as any;
    }) as any;

    originalAdd = window.addEventListener;
    window.addEventListener = ((type: any, fn: any) => {
      if (type === 'scroll') scrollHandler = fn;
      return undefined as any;
    }) as any;

    originalRemove = window.removeEventListener;
    window.removeEventListener = ((type: any, fn: any) => {
      if (type === 'scroll' && scrollHandler === fn) scrollHandler = null;
      return undefined as any;
    }) as any;

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRAF;
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  it('renders brand link, menu, cart button, and language switcher', () => {
    setup();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    const brandLink = screen.getAllByTestId('lnl')[0] as HTMLAnchorElement;
    expect(brandLink).toHaveAttribute('href', '/');
    expect(screen.getByTestId('brand')).toBeInTheDocument();
    expect(screen.getByTestId('menu')).toBeInTheDocument();
    expect(screen.getByTestId('cart')).toBeInTheDocument();
    expect(screen.getByTestId('lang')).toHaveTextContent('1:en');
  });

  it('does not render LanguageSwitcher when there are no language options', () => {
    hoisted.languageReturn = { options: [], current: 'en' };
    setup();
    expect(screen.queryByTestId('lang')).toBeNull();
  });

  it('uses transparent background when pref is transparent and not scrolled, switches to solid when scrolled', async () => {
    setup({ pref: 'transparent' });
    await flush();
    const header = screen.getByRole('banner');
    expect(header.className).toContain('bg-transparent');
    await act(async () => {
      setScroll(150);
      await Promise.resolve();
    });
    expect(header.className).toContain('bg-primary-600');
  });

  it('always uses solid background when pref is solid', async () => {
    setup({ pref: 'solid' });
    await flush();
    const header = screen.getByRole('banner');
    expect(header.className).toContain('bg-primary-600');
  });

  it('hides on scroll down past threshold and shows on scroll up', async () => {
    setup({ pref: 'transparent' });
    await flush();
    const header = screen.getByRole('banner');
    expect(header.className).toContain('translate-y-0');
    await act(async () => {
      setScroll(200);
      await Promise.resolve();
    });
    expect(header.className).toContain('-translate-y-full');
    await act(async () => {
      setScroll(50);
      await Promise.resolve();
    });
    expect(header.className).toContain('translate-y-0');
  });
});
