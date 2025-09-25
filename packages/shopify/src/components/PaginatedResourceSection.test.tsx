import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/ui', () => ({
  Button: ({ asChild, variant, size, className, children, ...rest }: any) => (
    <button
      data-testid="btn"
      data-variant={variant}
      data-size={size}
      className={className}
      {...rest}
    >
      {asChild ? children : <span data-testid="btn-child">{children}</span>}
    </button>
  ),
}));

vi.mock('@shopify/hydrogen', () => ({
  Pagination: ({ connection, children }: any) => {
    const nodes = connection?.nodes ?? [];
    const isLoading = !!connection?.isLoading;
    const Link = ({ children, ...rest }: any) => <a {...rest}>{children}</a>;
    const PreviousLink = ({ children }: any) => <Link data-testid="prev">{children}</Link>;
    const NextLink = ({ children }: any) => <Link data-testid="next">{children}</Link>;
    return (
      <div data-testid="pagination">{children({ nodes, isLoading, PreviousLink, NextLink })}</div>
    );
  },
}));

const i18nMock = vi.hoisted(() => {
  const map: Record<string, string> = {};
  map['common:pagination.loadPrevious'] = 'Load previous';
  map['common:pagination.loadMore'] = 'Load more';
  map['common:status.loading'] = 'Loading…';
  map['common:status.idle'] = 'Idle';
  return { map };
});
vi.mock('react-i18next', () => ({
  useTranslation: (ns?: string) => ({
    t: (k: string) => i18nMock.map[`${ns}:${k}`] ?? k,
  }),
}));

async function load() {
  const mod = await import('./PaginatedResourceSection');
  return mod.PaginatedResourceSection<any>;
}

const renderWith = async (conn: any, extraProps: any = {}) => {
  const PaginatedResourceSection = await load();
  return render(
    <PaginatedResourceSection connection={conn} {...extraProps}>
      {({ node, index }: any) => <div data-testid="item">{`${node}-${index}`}</div>}
    </PaginatedResourceSection>,
  );
};

describe('PaginatedResourceSection', () => {
  it('renders items in default grid and wires Previous/Next with idle texts', async () => {
    await renderWith({ nodes: ['a', 'b'], isLoading: false });
    const items = screen.getAllByTestId('item').map((el) => el.textContent);
    expect(items).toEqual(['a-0', 'b-1']);
    expect(screen.getByTestId('prev')).toHaveTextContent('Load previous');
    expect(screen.getByTestId('next')).toHaveTextContent('Load more');
    expect(screen.getByRole('status')).toHaveTextContent('Idle');
  });

  it('applies resourcesClassName instead of default grid container', async () => {
    await renderWith({ nodes: ['x'], isLoading: false }, { resourcesClassName: 'custom-grid' });
    const container = screen.getByText('x-0').parentElement as HTMLElement;
    expect(container.className).toContain('custom-grid');
  });

  it('shows loading texts and sets aria-busy when isLoading=true', async () => {
    await renderWith({ nodes: ['n1'], isLoading: true });
    const section = screen.getByRole('status').parentElement as HTMLElement;
    expect(section.getAttribute('aria-busy')).toBe('true');
    expect(screen.getByTestId('prev')).toHaveTextContent('Loading…');
    expect(screen.getByTestId('next')).toHaveTextContent('Loading…');
    expect(screen.getByRole('status')).toHaveTextContent('Loading…');
  });

  it('wraps links with Button asChild and keeps outline/sm variants', async () => {
    await renderWith({ nodes: [], isLoading: false });
    const btns = screen.getAllByTestId('btn');
    expect(btns).toHaveLength(2);
    for (const b of btns) {
      expect(b.getAttribute('data-variant')).toBe('outline');
      expect(b.getAttribute('data-size')).toBe('sm');
    }
    expect(screen.getByTestId('prev').tagName).toBe('A');
    expect(screen.getByTestId('next').tagName).toBe('A');
  });
});
