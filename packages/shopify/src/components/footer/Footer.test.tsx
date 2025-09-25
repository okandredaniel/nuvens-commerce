import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';

const hoisted = vi.hoisted(() => ({
  t: (k: string, opts?: any) => {
    if (k === 'copyright') return `© ${opts?.year} ${opts?.brand}`;
    return k;
  },
}));

vi.mock('@nuvens/ui', () => ({
  Container: ({ children, className }: any) => (
    <div data-testid="container" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: hoisted.t }),
}));

vi.mock('../LocalizedNavLink', () => ({
  LocalizedNavLink: ({ to, children, ...rest }: any) => (
    <a href={typeof to === 'string' ? to : String((to as any)?.pathname ?? to)} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('../Newsletter', () => ({
  Newsletter: () => <div data-testid="newsletter" />,
}));

vi.mock('./FooterMenuColumns', () => ({
  FooterMenuColumns: ({ menu, primaryDomainUrl, publicStoreDomain }: any) => (
    <div
      data-testid="columns"
      data-count={menu?.items?.length ?? 0}
      data-primary={primaryDomainUrl ?? ''}
      data-public={publicStoreDomain ?? ''}
    />
  ),
}));

vi.mock('./FooterPayments', () => ({
  FooterPayments: () => <div data-testid="payments" />,
}));

function Brand() {
  return <span data-testid="brand">BRAND</span>;
}

describe('Footer', () => {
  it('renders newsletter, brand link, copyright text, and payments', () => {
    render(
      <Footer
        Brand={Brand}
        brandName="Acme"
        year={2025}
        menu={null}
        primaryDomainUrl="https://primary.example"
        publicStoreDomain="example.myshopify.com"
      />,
    );
    expect(screen.getByTestId('newsletter')).toBeInTheDocument();
    const brandLink = screen.getByRole('link', { name: 'Home' }) as HTMLAnchorElement;
    expect(brandLink).toHaveAttribute('href', '/');
    expect(screen.getByTestId('brand')).toBeInTheDocument();
    expect(screen.getByText('© 2025 Acme')).toBeInTheDocument();
    expect(screen.getByTestId('payments')).toBeInTheDocument();
    expect(screen.queryByTestId('columns')).toBeNull();
  });

  it('renders FooterMenuColumns when menu has items and forwards domain props', () => {
    const menu = { items: [{ id: '1', title: 'A', url: 'https://x' }] };
    render(
      <Footer
        Brand={Brand}
        brandName="Acme"
        year={2025}
        menu={menu}
        primaryDomainUrl="https://primary.example"
        publicStoreDomain="example.myshopify.com"
      />,
    );
    const cols = screen.getByTestId('columns');
    expect(cols).toHaveAttribute('data-count', '1');
    expect(cols).toHaveAttribute('data-primary', 'https://primary.example');
    expect(cols).toHaveAttribute('data-public', 'example.myshopify.com');
  });

  it('omits FooterMenuColumns when menu.items is empty', () => {
    const menu = { items: [] };
    render(
      <Footer
        Brand={Brand}
        brandName="Acme"
        year={2025}
        menu={menu}
        primaryDomainUrl="https://primary.example"
        publicStoreDomain="example.myshopify.com"
      />,
    );
    expect(screen.queryByTestId('columns')).toBeNull();
  });
});
