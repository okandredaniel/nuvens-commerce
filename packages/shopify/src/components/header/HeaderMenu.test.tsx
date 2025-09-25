import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HeaderMenu } from './HeaderMenu';

const hoisted = vi.hoisted(() => ({
  closeSpy: vi.fn(),
}));

vi.mock('@nuvens/ui', () => ({
  useAside: () => ({ close: hoisted.closeSpy }),
}));

vi.mock('../LocalizedNavLink', () => ({
  LocalizedNavLink: ({ to, children, className, onClick, ...rest }: any) => (
    <a
      href={typeof to === 'string' ? to : String((to as any)?.pathname ?? to)}
      className={className}
      data-testid="lnl"
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  ),
}));

type MenuItem = { id?: string | null; title?: string | null; url?: string | null };
type Menu = { items?: MenuItem[] | null } | null | undefined;

function setup(menu: Menu, opts?: { primary?: string; publicDomain?: string }) {
  const primaryDomainUrl = opts?.primary ?? 'https://store.example.com';
  const publicStoreDomain = opts?.publicDomain ?? 'example.myshopify.com';
  return render(
    <HeaderMenu
      menu={menu as any}
      primaryDomainUrl={primaryDomainUrl as any}
      publicStoreDomain={publicStoreDomain}
    />,
  );
}

describe('HeaderMenu', () => {
  beforeEach(() => {
    hoisted.closeSpy.mockReset();
  });

  it('returns null when menu has no items', () => {
    const { container } = setup({ items: [] });
    expect(container.firstChild).toBeNull();
    const r = setup(null);
    expect(r.container.firstChild).toBeNull();
  });

  it('renders internal items via LocalizedNavLink for primary domain and calls close on click', async () => {
    setup(
      {
        items: [
          {
            id: '1',
            title: 'Collections',
            url: 'https://store.example.com/collections/men',
          },
        ],
      },
      { primary: 'https://store.example.com' },
    );
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Collections' }) as HTMLAnchorElement;
    expect(link).toHaveAttribute('href', '/collections/men');
    await userEvent.click(link);
    expect(hoisted.closeSpy).toHaveBeenCalledTimes(1);
  });

  it('renders internal items via LocalizedNavLink for public myshopify domain', () => {
    setup(
      {
        items: [
          {
            id: '2',
            title: 'Product',
            url: 'https://example.myshopify.com/products/hat',
          },
        ],
      },
      { publicDomain: 'example.myshopify.com' },
    );
    const link = screen.getByRole('link', { name: 'Product' }) as HTMLAnchorElement;
    expect(link).toHaveAttribute('href', '/products/hat');
  });

  it('renders external items as <a> with rel noopener noreferrer and does not close aside', async () => {
    setup({
      items: [{ id: '3', title: 'Blog', url: 'https://blog.example.com' }],
    });
    const link = screen.getByRole('link', { name: 'Blog' }) as HTMLAnchorElement;
    expect(link).toHaveAttribute('href', 'https://blog.example.com');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    await userEvent.click(link);
    expect(hoisted.closeSpy).not.toHaveBeenCalled();
  });

  it('ignores items missing id, title, or url', () => {
    setup({
      items: [
        { id: null, title: 'A', url: 'https://store.example.com/a' },
        { id: 'x', title: null, url: 'https://store.example.com/b' },
        { id: 'y', title: 'B', url: null },
      ],
    });
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav.querySelectorAll('a').length).toBe(0);
  });
});
