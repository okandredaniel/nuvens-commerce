import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/ui', () => ({ cn: (...a: any[]) => a.filter(Boolean).join(' ') }));

const rr = vi.hoisted(() => ({
  lastProps: {} as any,
  NavLink: ({ to, children, className, ...rest }: any) => {
    rr.lastProps = { to, className, ...rest };
    const href =
      typeof to === 'string'
        ? to
        : String(to?.pathname || '/') + String(to?.search || '') + String(to?.hash || '');
    return (
      <a data-testid="link" href={href} className={className} {...rest}>
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
  const mod = await import('./LocalizedNavLink');
  return mod.LocalizedNavLink;
}

describe('LocalizedNavLink', () => {
  it('localizes string paths and passes suppressHydrationWarning to NavLink', async () => {
    const LocalizedNavLink = await load();
    render(<LocalizedNavLink to="/p">go</LocalizedNavLink>);
    const a = screen.getByTestId('link');
    expect(a.getAttribute('href')).toBe('/fr/p');
    expect(rr.lastProps.suppressHydrationWarning).toBe(true);
  });

  it('merges className using cn and forwards props', async () => {
    const LocalizedNavLink = await load();
    render(
      <LocalizedNavLink to="/x" className="c" aria-label="l">
        child
      </LocalizedNavLink>,
    );
    const a = screen.getByTestId('link');
    expect(a.textContent).toBe('child');
    expect(a.getAttribute('class')).toContain('inline-block');
    expect(a.getAttribute('class')).toContain('c');
    expect(a.getAttribute('aria-label')).toBe('l');
  });

  it('localizes To objects and preserves search/hash', async () => {
    const LocalizedNavLink = await load();
    render(
      <LocalizedNavLink to={{ pathname: '/q', search: '?a=1', hash: '#h' }}>q</LocalizedNavLink>,
    );
    const a = screen.getByTestId('link');
    expect(a.getAttribute('href')).toBe('/fr/q?a=1#h');
  });

  it('calls adapter localizer once with provided "to"', async () => {
    adapterMock.localize.mockClear();
    const LocalizedNavLink = await load();
    const to = { pathname: '/z' };
    render(<LocalizedNavLink to={to}>z</LocalizedNavLink>);
    expect(adapterMock.localize).toHaveBeenCalledTimes(1);
    expect(adapterMock.localize).toHaveBeenCalledWith(to);
  });
});
