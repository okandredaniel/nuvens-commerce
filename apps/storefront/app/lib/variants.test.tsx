import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it } from 'vitest';
import { getVariantUrl, useVariantUrl } from './variants';

describe('getVariantUrl', () => {
  it('builds path without locale and no options', () => {
    const out = getVariantUrl({
      handle: 'cool-shirt',
      pathname: '/products',
      searchParams: new URLSearchParams(),
      selectedOptions: undefined,
    });
    expect(out).toBe('/products/cool-shirt');
  });

  it('builds path with locale and selected options', () => {
    const opts: SelectedOption[] = [
      { name: 'Color', value: 'Red' },
      { name: 'Size', value: 'M' },
    ];
    const out = getVariantUrl({
      handle: 'cool-shirt',
      pathname: '/en-US/collections/sale',
      searchParams: new URLSearchParams(),
      selectedOptions: opts,
    });
    expect(out).toBe('/en-US/products/cool-shirt?Color=Red&Size=M');
  });

  it('preserves existing params and overrides with selected options', () => {
    const opts: SelectedOption[] = [
      { name: 'q', value: 'X' },
      { name: 'Color', value: 'Blue' },
    ];
    const out = getVariantUrl({
      handle: 'cool-shirt',
      pathname: '/en-US/',
      searchParams: new URLSearchParams('a=b&q=old'),
      selectedOptions: opts,
    });
    expect(out).toBe('/en-US/products/cool-shirt?a=b&q=X&Color=Blue');
  });
});

function HookProbe({ handle, options }: { handle: string; options?: SelectedOption[] }) {
  const url = useVariantUrl(handle, options);
  return <div data-testid="url">{url}</div>;
}

describe('useVariantUrl', () => {
  it('uses current pathname and builds URL with locale', () => {
    const opts: SelectedOption[] = [{ name: 'Color', value: 'Green' }];
    render(
      <MemoryRouter initialEntries={['/en-GB/some/path']}>
        <Routes>
          <Route path="*" element={<HookProbe handle="hoodie" options={opts} />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('url').textContent).toBe('/en-GB/products/hoodie?Color=Green');
  });

  it('uses current pathname and builds URL without locale', () => {
    render(
      <MemoryRouter initialEntries={['/some/path']}>
        <Routes>
          <Route path="*" element={<HookProbe handle="cap" />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('url').textContent).toBe('/products/cap');
  });
});
