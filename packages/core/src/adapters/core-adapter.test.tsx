/* @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

async function loadAdapters() {
  vi.resetModules();
  return await import('./core-adapter');
}

describe('core adapters', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('provides default Link and NavLink when no adapter is set', async () => {
    const m = await loadAdapters();
    function Sample() {
      const { Link, NavLink } = m.useCoreAdapter();
      return (
        <div>
          <Link to="/x">X</Link>
          <NavLink to="/y" end prefetch="intent">
            Y
          </NavLink>
        </div>
      );
    }
    render(<Sample />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/x');
    expect(links[1]).toHaveAttribute('href', '/y');
  });

  it('setCoreAdapter overrides global Link', async () => {
    const m = await loadAdapters();
    const CustomLink = ({ to, children, ...rest }: any) => (
      <a data-testid="custom-link" href={`#${to}`} {...rest}>
        {children}
      </a>
    );
    m.setCoreAdapter({ Link: CustomLink });
    function Sample() {
      const { Link, NavLink } = m.useCoreAdapter();
      return (
        <div>
          <Link to="/x">X</Link>
          <NavLink to="/y">Y</NavLink>
        </div>
      );
    }
    render(<Sample />);
    const custom = screen.getByTestId('custom-link');
    expect(custom).toHaveAttribute('href', '#/x');
    const links = screen.getAllByRole('link');
    expect(links[1]).toHaveAttribute('href', '/y');
  });

  it('CoreAdapterProvider merges with global and overrides provided keys', async () => {
    const m = await loadAdapters();
    const GlobalLink = ({ to, children, ...rest }: any) => (
      <a data-testid="global-link" href={`/${String(to)}`} {...rest}>
        {children}
      </a>
    );
    const ProviderNavLink = ({ to, children, ...rest }: any) => (
      <a data-testid="provider-nav-link" href={`?to=${String(to)}`} {...rest}>
        {children}
      </a>
    );
    m.setCoreAdapter({ Link: GlobalLink });
    function Sample() {
      const { Link, NavLink } = m.useCoreAdapter();
      return (
        <div>
          <Link to="alpha">A</Link>
          <NavLink to="beta">B</NavLink>
        </div>
      );
    }
    render(
      <m.CoreAdapterProvider value={{ NavLink: ProviderNavLink }}>
        <Sample />
      </m.CoreAdapterProvider>,
    );
    expect(screen.getByTestId('global-link')).toHaveAttribute('href', '/alpha');
    expect(screen.getByTestId('provider-nav-link')).toHaveAttribute('href', '?to=beta');
  });

  it('DefaultNavLink forwards to DefaultLink and ignores extra props', async () => {
    const m = await loadAdapters();
    function Sample() {
      const { NavLink } = m.useCoreAdapter();
      return (
        <div>
          <NavLink to="/z" end prefetch="intent">
            Z
          </NavLink>
        </div>
      );
    }
    render(<Sample />);
    const link = screen.getByRole('link', { name: 'Z' });
    expect(link).toHaveAttribute('href', '/z');
  });

  it('getCoreAdapter reflects values set via setCoreAdapter', async () => {
    const m = await loadAdapters();
    const L = ({ to, children, ...rest }: any) => (
      <a data-testid="L" href={String(to)} {...rest}>
        {children}
      </a>
    );
    const N = ({ to, children, ...rest }: any) => (
      <a data-testid="N" href={String(to)} {...rest}>
        {children}
      </a>
    );
    m.setCoreAdapter({ Link: L });
    m.setCoreAdapter({ NavLink: N });
    const reg = m.getCoreAdapter();
    expect(reg.Link).toBe(L);
    expect(reg.NavLink).toBe(N);
  });

  it('provider without keys falls back to defaults when global is empty', async () => {
    const m = await loadAdapters();
    function Sample() {
      const { Link, NavLink } = m.useCoreAdapter();
      return (
        <div>
          <Link to="/d1">D1</Link>
          <NavLink to="/d2">D2</NavLink>
        </div>
      );
    }
    render(
      <m.CoreAdapterProvider value={{}}>
        <Sample />
      </m.CoreAdapterProvider>,
    );
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/d1');
    expect(links[1]).toHaveAttribute('href', '/d2');
  });
});
