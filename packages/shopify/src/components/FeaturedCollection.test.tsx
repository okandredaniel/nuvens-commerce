import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@shopify/hydrogen', () => ({
  Image: ({ alt }: any) => <img data-testid="img" alt={alt} />,
}));

const linkMock = vi.hoisted(() => ({
  lastProps: {} as any,
}));
vi.mock('./LocalizedLink', () => ({
  LocalizedLink: (props: any) => {
    linkMock.lastProps = props;
    return (
      <a
        data-testid="link"
        href={typeof props.to === 'string' ? props.to : String(props.to)}
        aria-label={props['aria-label']}
        className={props.className}
      >
        {props.children}
      </a>
    );
  },
}));

async function load() {
  const mod = await import('./FeaturedCollection');
  return mod.FeaturedCollection;
}

const makeCollection = (over: Partial<any> = {}) =>
  ({
    handle: 'featured',
    title: 'Featured',
    image: { altText: 'Alt text' },
    ...over,
  }) as any;

describe('FeaturedCollection', () => {
  it('returns null when collection is falsy', async () => {
    const FeaturedCollection = await load();
    const { container } = render(<FeaturedCollection collection={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders LocalizedLink to collection handle with aria-label and title', async () => {
    const FeaturedCollection = await load();
    render(<FeaturedCollection collection={makeCollection()} />);
    const link = screen.getByTestId('link') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/collections/featured');
    expect(link.getAttribute('aria-label')).toBe('Featured');
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('renders Image when collection.image exists and uses image.altText', async () => {
    const FeaturedCollection = await load();
    render(<FeaturedCollection collection={makeCollection()} />);
    const img = screen.getByTestId('img');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('alt')).toBe('Alt text');
  });

  it('falls back to collection.title as alt when image.altText is missing', async () => {
    const FeaturedCollection = await load();
    render(<FeaturedCollection collection={makeCollection({ image: {} })} />);
    const img = screen.getByTestId('img');
    expect(img.getAttribute('alt')).toBe('Featured');
  });

  it('renders placeholder block and no img when image is null', async () => {
    const FeaturedCollection = await load();
    render(<FeaturedCollection collection={makeCollection({ image: null })} />);
    expect(screen.queryByTestId('img')).toBeNull();
    const link = screen.getByTestId('link');
    expect(link.querySelector('div[class*="aspect-[16/9]"]')).toBeTruthy();
  });

  it('passes className to LocalizedLink and keeps group hover styles', async () => {
    const FeaturedCollection = await load();
    render(<FeaturedCollection collection={makeCollection()} />);
    const cls = String((linkMock.lastProps || {}).className || '');
    expect(cls).toContain('group');
    expect(cls).toContain('rounded-xl');
  });
});
