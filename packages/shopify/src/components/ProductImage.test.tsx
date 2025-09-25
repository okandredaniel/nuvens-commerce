import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProductImage } from './ProductImage';

vi.mock('@shopify/hydrogen', () => ({
  Image: (p: any) => (
    <img
      data-testid="img"
      alt={p.alt}
      src={p.data?.url || ''}
      data-aspect={p.aspectRatio}
      data-sizes={p.sizes}
    />
  ),
}));

describe('ProductImage', () => {
  it('renders placeholder div when image is missing', () => {
    const { container } = render(<ProductImage image={null as any} />);
    const root = container.querySelector('.product-image');
    expect(root).toBeInTheDocument();
    expect(screen.queryByTestId('img')).toBeNull();
  });

  it('renders Hydrogen Image with expected props and wrapper', () => {
    const image = { id: 'gid://x/1', altText: 'Nice pic', url: 'https://x/img.jpg' } as any;
    const { container } = render(<ProductImage image={image} />);
    const root = container.querySelector('.product-image');
    expect(root).toBeInTheDocument();
    const img = screen.getByTestId('img');
    expect(img).toHaveAttribute('alt', 'Nice pic');
    expect(img).toHaveAttribute('src', 'https://x/img.jpg');
    expect(img).toHaveAttribute('data-aspect', '1/1');
    expect(img).toHaveAttribute('data-sizes', '(min-width: 45em) 50vw, 100vw');
  });

  it('falls back to default alt when altText is empty', () => {
    const image = { id: 'gid://x/2', altText: '', url: 'https://x/alt.jpg' } as any;
    render(<ProductImage image={image} />);
    const img = screen.getByTestId('img');
    expect(img).toHaveAttribute('alt', 'Product Image');
  });
});
