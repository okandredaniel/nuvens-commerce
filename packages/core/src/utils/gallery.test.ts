import { describe, expect, it } from 'vitest';
import { ensureVariantFirst, isValidImage, uniqueBy } from './gallery';

describe('isValidImage', () => {
  it('returns true for object with non-empty string url', () => {
    expect(isValidImage({ id: 1, url: 'https://x/img.jpg' })).toBe(true);
  });

  it('returns false for undefined or null', () => {
    expect(isValidImage(undefined)).toBe(false);
    expect(isValidImage(null)).toBe(false);
  });

  it('returns false for empty url', () => {
    expect(isValidImage({ id: 1, url: '' })).toBe(false);
  });

  it('returns false for non-string url', () => {
    expect(isValidImage({ id: 1, url: 123 as unknown as string })).toBe(false);
  });

  it('returns true for whitespace url since length > 0', () => {
    expect(isValidImage({ url: ' ' })).toBe(true);
  });
});

describe('uniqueBy', () => {
  it('keeps first occurrence and preserves order', () => {
    const arr = [
      { id: 'a', v: 1 },
      { id: 'b', v: 2 },
      { id: 'a', v: 3 },
      { id: 'c', v: 4 },
      { id: 'b', v: 5 },
    ];
    const res = uniqueBy(arr, (x) => x.id);
    expect(res).toEqual([
      { id: 'a', v: 1 },
      { id: 'b', v: 2 },
      { id: 'c', v: 4 },
    ]);
  });

  it('returns empty array for empty input', () => {
    expect(uniqueBy([], () => '')).toEqual([]);
  });

  it('works with primitive-derived keys', () => {
    const arr = [{ v: 1 }, { v: 2 }, { v: 1 }, { v: 3 }];
    const res = uniqueBy(arr, (x) => String(x.v));
    expect(res.map((x) => x.v)).toEqual([1, 2, 3]);
  });
});

describe('ensureVariantFirst', () => {
  const base = [
    { id: 1, url: 'u1' },
    { id: 2, url: 'u2' },
    { id: 3, url: 'u3' },
  ];

  it('returns base when variant is invalid', () => {
    const res1 = ensureVariantFirst(base, null);
    const res2 = ensureVariantFirst(base, { id: 9, url: '' });
    expect(res1).toBe(base);
    expect(res2).toBe(base);
  });

  it('returns base when variant already exists by id', () => {
    const variant = { id: 2, url: 'different' };
    const res = ensureVariantFirst(base, variant);
    expect(res).toBe(base);
  });

  it('returns base when variant already exists by url', () => {
    const variant = { id: 999, url: 'u1' };
    const res = ensureVariantFirst(base, variant);
    expect(res).toBe(base);
  });

  it('prepends variant when not present', () => {
    const variant = { id: 99, url: 'u99' };
    const res = ensureVariantFirst(base, variant);
    expect(res[0]).toEqual(variant);
    expect(res.slice(1)).toEqual(base);
    expect(res).not.toBe(base);
  });

  it('dedupes using id then url when prepending', () => {
    const withDupes = [
      { id: 1, url: 'u1' },
      { id: 2, url: 'u2' },
      { id: 1, url: 'u1' },
      { url: 'u4' },
      { url: 'u4' },
    ];
    const variant = { id: 42, url: 'u42' };
    const res = ensureVariantFirst(withDupes, variant);
    expect(res).toEqual([
      { id: 42, url: 'u42' },
      { id: 1, url: 'u1' },
      { id: 2, url: 'u2' },
      { url: 'u4' },
    ]);
  });

  it('does not mutate base array', () => {
    const copy = [...base];
    ensureVariantFirst(base, { id: 77, url: 'u77' });
    expect(base).toEqual(copy);
  });
});
