import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  path: '/',
  adapterDefault: 'en-US',
  i18nMock: {
    getResource: vi.fn(() => undefined),
    getFixedT: vi.fn((_lng: string, _ns: string) => (key: string, opts?: any) => {
      if (key === 'nav.switchTo') return `Switch to ${opts?.value}`;
      return key;
    }),
    hasResourceBundle: vi.fn(() => true),
    addResourceBundle: vi.fn(),
    resolvedLanguage: 'en',
  },
}));

vi.mock('@nuvens/ui', () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="btn" {...rest}>
      {children}
    </button>
  ),
  DropdownMenu: {
    Root: ({ children }: any) => <div data-testid="dm-root">{children}</div>,
    Trigger: ({ children, asChild }: any) =>
      asChild ? <>{children}</> : <button data-testid="dm-trigger">{children}</button>,
    Content: ({ children, sideOffset }: any) => (
      <div data-testid="dm-content" data-side-offset={sideOffset}>
        {children}
      </div>
    ),
    Item: ({ children, asChild }: any) =>
      asChild ? <>{children}</> : <div data-testid="dm-item">{children}</div>,
    Portal: ({ children }: any) => <div data-testid="dm-portal">{children}</div>,
  },
  Tooltip: {
    Root: ({ children }: any) => <div data-testid="tt-root">{children}</div>,
    Trigger: ({ children, asChild }: any) =>
      asChild ? <>{children}</> : <button data-testid="tt-trigger">{children}</button>,
    Content: ({ children, sideOffset }: any) => (
      <div data-testid="tt-content" data-side-offset={sideOffset}>
        {children}
      </div>
    ),
    Portal: ({ children }: any) => <div data-testid="tt-portal">{children}</div>,
    Arrow: () => <div data-testid="tt-arrow" />,
  },
}));

vi.mock('react-router', () => ({
  NavLink: ({ to, children, ...rest }: any) => (
    <a href={typeof to === 'string' ? to : String((to as any)?.pathname ?? to)} {...rest}>
      {children}
    </a>
  ),
  useLocation: () => ({ pathname: hoisted.path }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => {
      if (k === 'nav.changeLanguage') return 'Change language';
      if (k === 'nav.language') return 'Language';
      if (k === 'a11y.current') return 'a11y.current';
      return k;
    },
    i18n: hoisted.i18nMock,
  }),
}));

vi.mock('../../adapter', () => ({
  useShopifyAdapter: () => ({ defaultLocale: hoisted.adapterDefault }),
}));

type LanguageOption = { isoCode: string; href: string; label?: string };

async function fresh() {
  vi.resetModules();
  return await import('./LanguageSwitcher');
}

beforeEach(() => {
  hoisted.path = '/';
  hoisted.adapterDefault = 'en-US';
  hoisted.i18nMock.getResource.mockClear();
  hoisted.i18nMock.getFixedT.mockClear();
  hoisted.i18nMock.hasResourceBundle.mockClear();
  hoisted.i18nMock.addResourceBundle.mockClear();
  hoisted.i18nMock.resolvedLanguage = 'en';
  (Intl as any).DisplayNames = class {
    of(code: string) {
      if (code === 'fr') return 'French';
      if (code === 'es') return 'Spanish';
      if (code === 'pt') return 'Portuguese';
      return code.toUpperCase();
    }
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('LanguageSwitcher', () => {
  it('returns null when options is empty or missing', async () => {
    const { LanguageSwitcher } = await fresh();
    const { container, rerender } = render(<LanguageSwitcher options={[]} current="en" />);
    expect(container.firstChild).toBeNull();
    rerender(<LanguageSwitcher options={undefined as any} current="en" />);
    expect(container.firstChild).toBeNull();
  });

  it('shows active language from current prop and renders other options as menu items', async () => {
    const { LanguageSwitcher } = await fresh();
    const options: LanguageOption[] = [
      { isoCode: 'en', href: '/en' },
      { isoCode: 'fr', href: '/fr' },
      { isoCode: 'es', href: '/es' },
    ];
    render(<LanguageSwitcher options={options} current="en" />);

    const btn = screen.getByTestId('btn');
    expect(btn).toHaveAttribute('aria-label', 'a11y.current');
    expect(btn).toHaveTextContent('EN');

    expect(screen.getByTestId('tt-content')).toHaveTextContent('Change language');

    const fr = screen.getByRole('link', { name: 'Passer en French' }) as HTMLAnchorElement;
    const es = screen.getByRole('link', { name: 'Cambiar a Spanish' }) as HTMLAnchorElement;
    expect(fr).toHaveAttribute('href', '/fr');
    expect(es).toHaveAttribute('href', '/es');
  });

  it('uses language from URL prefix when current is missing', async () => {
    const { LanguageSwitcher } = await fresh();
    hoisted.path = '/fr/products/hat';
    const options: LanguageOption[] = [
      { isoCode: 'en', href: '/en' },
      { isoCode: 'fr', href: '/fr' },
    ];
    render(<LanguageSwitcher options={options} />);

    const btn = screen.getByTestId('btn');
    expect(btn).toHaveTextContent('FR');

    const en = screen.getByRole('link', { name: 'Switch to ENGLISH' }) as HTMLAnchorElement;
    expect(en).toHaveAttribute('href', '/en');
  });

  it('falls back to adapter defaultLocale when no current, no path lang, and no resolvedLanguage', async () => {
    const { LanguageSwitcher } = await fresh();
    hoisted.path = '/';
    hoisted.adapterDefault = 'pt-BR';
    hoisted.i18nMock.resolvedLanguage = '' as any;

    const options: LanguageOption[] = [
      { isoCode: 'pt', href: '/pt' },
      { isoCode: 'en', href: '/en' },
    ];
    render(<LanguageSwitcher options={options} />);

    const btn = screen.getByTestId('btn');
    expect(btn).toHaveTextContent('PT');

    const en = screen.getByRole('link', { name: 'Switch to ENGLISH' }) as HTMLAnchorElement;
    expect(en).toHaveAttribute('href', '/en');
  });

  it('does not render dropdown content when there are no other languages', async () => {
    const { LanguageSwitcher } = await fresh();
    const options: LanguageOption[] = [{ isoCode: 'en', href: '/en' }];
    render(<LanguageSwitcher options={options} current="en" />);
    expect(screen.queryByTestId('dm-content')).toBeNull();
  });

  it('menu items are keyboard-activatable and keep aria-labels', async () => {
    const user = userEvent.setup();
    const { LanguageSwitcher } = await fresh();
    const options: LanguageOption[] = [
      { isoCode: 'en', href: '/en' },
      { isoCode: 'fr', href: '/fr' },
    ];
    render(<LanguageSwitcher options={options} current="en" />);
    const fr = screen.getByRole('link', { name: 'Passer en French' }) as HTMLAnchorElement;
    expect(fr).toHaveAttribute('href', '/fr');
    await user.type(fr, '{enter}');
    expect(fr).toBeInTheDocument();
  });
});
