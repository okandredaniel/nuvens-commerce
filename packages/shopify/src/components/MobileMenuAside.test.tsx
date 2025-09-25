import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const ui = vi.hoisted(() => ({
  lastAsideProps: {} as any,
}));
vi.mock('@nuvens/ui', () => ({
  Aside: (p: any) => {
    ui.lastAsideProps = p;
    return (
      <aside data-testid="aside" data-type={p.type} data-heading={p.heading}>
        {p.children}
      </aside>
    );
  },
}));

const headerMock = vi.hoisted(() => ({
  lastProps: {} as any,
}));
vi.mock('./header', () => ({
  HeaderMenu: (p: any) => {
    headerMock.lastProps = p;
    return <div data-testid="header-menu" />;
  },
}));

const adapter = vi.hoisted(() => ({
  useStoreImpl: vi.fn(() => ({})),
}));
vi.mock('../adapter', () => ({
  useShopifyAdapter: () => ({ useStore: adapter.useStoreImpl }),
}));

async function load() {
  const mod = await import('./MobileMenuAside');
  return mod.MobileMenuAside;
}

const mkStore = (over: Partial<any> = {}) => ({
  header: {
    menu: [{ title: 'A' }],
    shop: { primaryDomain: { url: 'https://x' } },
  },
  publicStoreDomain: 'x.myshopify.com',
  ...over,
});

describe('MobileMenuAside', () => {
  it('returns null when header.menu is missing', async () => {
    const MobileMenuAside = await load();
    adapter.useStoreImpl.mockReturnValueOnce(
      mkStore({ header: { shop: { primaryDomain: { url: 'https://x' } } } }),
    );
    const { container } = render(<MobileMenuAside />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when primaryDomain url is missing', async () => {
    const MobileMenuAside = await load();
    adapter.useStoreImpl.mockReturnValueOnce(
      mkStore({ header: { menu: [{}], shop: { primaryDomain: {} } } }),
    );
    const { container } = render(<MobileMenuAside />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when publicStoreDomain is missing', async () => {
    const MobileMenuAside = await load();
    adapter.useStoreImpl.mockReturnValueOnce(mkStore({ publicStoreDomain: undefined }));
    const { container } = render(<MobileMenuAside />);
    expect(container.firstChild).toBeNull();
  });

  it('renders Aside and HeaderMenu with expected props', async () => {
    const MobileMenuAside = await load();
    const store = mkStore();
    adapter.useStoreImpl.mockReturnValueOnce(store);
    render(<MobileMenuAside />);

    const aside = screen.getByTestId('aside');
    expect(aside).toBeInTheDocument();
    expect(aside.getAttribute('data-type')).toBe('mobile');
    expect(aside.getAttribute('data-heading')).toBe('MENU');

    expect(screen.getByTestId('header-menu')).toBeInTheDocument();
    expect(headerMock.lastProps.menu).toBe(store.header.menu);
    expect(headerMock.lastProps.primaryDomainUrl).toBe(store.header.shop.primaryDomain.url);
    expect(headerMock.lastProps.publicStoreDomain).toBe(store.publicStoreDomain);
  });
});
