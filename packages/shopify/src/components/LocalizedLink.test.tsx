import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const rr = vi.hoisted(() => ({
  lastProps: {} as any,
  NavLink: ({ to, children, ...rest }: any) => {
    rr.lastProps = { to, ...rest };
    const href =
      typeof to === 'string'
        ? to
        : String(to?.pathname || '/') + String(to?.search || '') + String(to?.hash || '');
    return (
      <a data-testid="link" href={href} {...rest}>
        {children}
      </a>
    );
  },
}));
vi.mock('react-router', () => ({ NavLink: rr.NavLink }));

const adapterMock = vi.hoisted(() => ({
  localize: vi.fn((to: any) => {
    if (typeof to === 'string') return to.startsWith('/fr') ? to : `/fr${to}`;
    const pathname = to?.pathname || '/';
    return { ...to, pathname: pathname.startsWith('/fr') ? pathname : `/fr${pathname}` };
  }),
}));
vi.mock('../adapter', () => ({
  useShopifyAdapter: () => ({ useLocalizedHref: () => adapterMock.localize }),
}));

async function load() {
  const mod = await import('./LocalizedLink');
  return mod.LocalizedLink;
}

describe('LocalizedLink', () => {
  it('localizes string paths and passes suppressHydrationWarning to NavLink', async () => {
    const LocalizedLink = await load();
    render(<LocalizedLink to="/p">go</LocalizedLink>);
    const a = screen.getByTestId('link');
    expect(a.getAttribute('href')).toBe('/fr/p');
    expect(rr.lastProps.suppressHydrationWarning).toBe(true);
  });

  it('forwards props and children', async () => {
    const LocalizedLink = await load();
    render(
      <LocalizedLink to="/x" className="c" aria-label="l">
        child
      </LocalizedLink>,
    );
    const a = screen.getByTestId('link');
    expect(a.textContent).toBe('child');
    expect(a.getAttribute('class')).toBe('c');
    expect(a.getAttribute('aria-label')).toBe('l');
  });

  it('localizes To objects and preserves search/hash', async () => {
    const LocalizedLink = await load();
    render(<LocalizedLink to={{ pathname: '/q', search: '?a=1', hash: '#h' }}>q</LocalizedLink>);
    const a = screen.getByTestId('link');
    expect(a.getAttribute('href')).toBe('/fr/q?a=1#h');
  });

  it('calls adapter localizer once with provided "to"', async () => {
    adapterMock.localize.mockClear();
    const LocalizedLink = await load();
    const to = { pathname: '/z' };
    render(<LocalizedLink to={to}>z</LocalizedLink>);
    expect(adapterMock.localize).toHaveBeenCalledTimes(1);
    expect(adapterMock.localize).toHaveBeenCalledWith(to);
  });
});
