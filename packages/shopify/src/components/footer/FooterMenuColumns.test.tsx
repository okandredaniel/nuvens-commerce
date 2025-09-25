import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FooterMenuColumns } from './FooterMenuColumns';

vi.mock('@nuvens/ui', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

vi.mock('../../i18n/localize', () => ({
  isExternal: (href: string) => /^https?:\/\//i.test(href),
}));

vi.mock('../LocalizedNavLink', () => ({
  LocalizedNavLink: ({ to, children, className, ...rest }: any) => (
    <a
      data-testid="lnl"
      href={typeof to === 'string' ? to : String(to)}
      className={className}
      {...rest}
    >
      {children}
    </a>
  ),
}));

function makeMenu() {
  return {
    items: [
      {
        id: 'g1',
        title: 'Shop',
        items: [
          { id: '1', title: 'All', url: 'https://example.myshopify.com/collections/all?sort=1' },
          { id: '2', title: 'Contact', url: 'https://shop.mydomain.com/pages/contact' },
          { id: '3', title: 'About', url: 'https://foo.myshopify.com/pages/about' },
          { id: '4', title: 'Help', url: 'https://docs.example.com/help' },
          null,
        ],
      },
      {
        id: 'g2',
        title: 'Company',
        items: [{ id: '5', title: 'Blog', url: 'https://blog.other.com' }],
      },
      null,
    ],
  } as any;
}

describe('FooterMenuColumns', () => {
  it('renders groups and titles', () => {
    const menu = makeMenu();
    render(
      <FooterMenuColumns
        menu={menu}
        primaryDomainUrl="https://shop.mydomain.com"
        publicStoreDomain="example.myshopify.com"
      />,
    );
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('renders internal links as LocalizedNavLink with relative paths', () => {
    const menu = makeMenu();
    render(
      <FooterMenuColumns
        menu={menu}
        primaryDomainUrl="https://shop.mydomain.com"
        publicStoreDomain="example.myshopify.com"
      />,
    );
    const lnls = screen.getAllByTestId('lnl') as HTMLAnchorElement[];
    const hrefs = lnls.map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/collections/all?sort=1');
    expect(hrefs).toContain('/pages/contact');
    expect(hrefs).toContain('/pages/about');
    expect(lnls[0].className).toMatch(/transition-colors/);
    expect(lnls[0]).toHaveAttribute('prefetch', 'intent');
  });

  it('renders external links with target and rel', () => {
    const menu = makeMenu();
    render(
      <FooterMenuColumns
        menu={menu}
        primaryDomainUrl="https://shop.mydomain.com"
        publicStoreDomain="example.myshopify.com"
      />,
    );
    const help = screen.getByRole('link', { name: 'Help' }) as HTMLAnchorElement;
    const blog = screen.getByRole('link', { name: 'Blog' }) as HTMLAnchorElement;
    expect(help).toHaveAttribute('href', 'https://docs.example.com/help');
    expect(help).toHaveAttribute('target', '_blank');
    expect(help.getAttribute('rel') || '').toContain('noopener');
    expect(help.getAttribute('rel') || '').toContain('noreferrer');
    expect(blog).toHaveAttribute('href', 'https://blog.other.com');
    expect(blog).toHaveAttribute('target', '_blank');
  });

  it('omits falsy groups and items', () => {
    const menu = { items: [null, { id: 'only', title: 'Only', items: [null] }] } as any;
    render(<FooterMenuColumns menu={menu} />);
    expect(screen.getByText('Only')).toBeInTheDocument();
    expect(screen.queryByTestId('lnl')).toBeNull();
  });
});
