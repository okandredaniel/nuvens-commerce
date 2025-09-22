import { describe, expect, it } from 'vitest';
import { shouldRevalidate } from './shouldRevalidate';

type Args = Parameters<typeof shouldRevalidate>[0];

const url = (s: string) => new URL(s);

function makeArgs(overrides: Partial<Args> = {}): Args {
  return {
    formMethod: overrides.formMethod,
    currentUrl: overrides.currentUrl ?? url('https://app.test/products?sort=asc#top'),
    nextUrl: overrides.nextUrl ?? url('https://app.test/products?sort=asc#top'),
    currentParams: overrides.currentParams ?? {},
    nextParams: overrides.nextParams ?? {},
    defaultShouldRevalidate: overrides.defaultShouldRevalidate ?? true,
  };
}

describe('shouldRevalidate', () => {
  it.each(['POST', 'PUT', 'PATCH', 'DELETE'] as const)(
    'returns true for non-GET form submissions (%s)',
    (method) => {
      const res = shouldRevalidate(makeArgs({ formMethod: method }));
      expect(res).toBe(true);
    },
  );

  it('returns false for GET form submissions when pathname is unchanged', () => {
    const res = shouldRevalidate(
      makeArgs({
        formMethod: 'GET',
        currentUrl: url('https://app.test/products?sort=asc'),
        nextUrl: url('https://app.test/products?sort=desc'),
      }),
    );
    expect(res).toBe(false);
  });

  it('returns true when pathname changes (regardless of method)', () => {
    const res1 = shouldRevalidate(
      makeArgs({
        currentUrl: url('https://app.test/products'),
        nextUrl: url('https://app.test/products/123'),
      }),
    );
    const res2 = shouldRevalidate(
      makeArgs({
        formMethod: 'GET',
        currentUrl: url('https://app.test/a'),
        nextUrl: url('https://app.test/b'),
      }),
    );
    expect(res1).toBe(true);
    expect(res2).toBe(true);
  });

  it('returns false when only search changes and method is not a mutation', () => {
    const res = shouldRevalidate(
      makeArgs({
        currentUrl: url('https://app.test/products?sort=asc'),
        nextUrl: url('https://app.test/products?sort=desc'),
      }),
    );
    expect(res).toBe(false);
  });

  it('returns false when only hash changes and method is not a mutation', () => {
    const res = shouldRevalidate(
      makeArgs({
        currentUrl: url('https://app.test/products#top'),
        nextUrl: url('https://app.test/products#bottom'),
      }),
    );
    expect(res).toBe(false);
  });

  it('treats undefined formMethod as non-mutation and relies on pathname comparison', () => {
    const samePath = shouldRevalidate(
      makeArgs({
        formMethod: undefined,
        currentUrl: url('https://app.test/products'),
        nextUrl: url('https://app.test/products'),
      }),
    );
    const differentPath = shouldRevalidate(
      makeArgs({
        formMethod: undefined,
        currentUrl: url('https://app.test/products'),
        nextUrl: url('https://app.test/products/1'),
      }),
    );
    expect(samePath).toBe(false);
    expect(differentPath).toBe(true);
  });

  it('considers trailing slash a pathname change', () => {
    const res = shouldRevalidate(
      makeArgs({
        currentUrl: url('https://app.test/products'),
        nextUrl: url('https://app.test/products/'),
      }),
    );
    expect(res).toBe(true);
  });
});
