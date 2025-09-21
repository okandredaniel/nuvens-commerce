import { describe, expect, it } from 'vitest';

async function importUtils() {
  return await import('./search');
}

describe('getEmptyPredictiveSearchResult', () => {
  it('returns zero totals and empty arrays', async () => {
    const { getEmptyPredictiveSearchResult } = await importUtils();
    const res = getEmptyPredictiveSearchResult();
    expect(res.total).toBe(0);
    expect(res.items.articles).toEqual([]);
    expect(res.items.collections).toEqual([]);
    expect(res.items.products).toEqual([]);
    expect(res.items.pages).toEqual([]);
    expect(res.items.queries).toEqual([]);
  });
});

describe('urlWithTrackingParams', () => {
  it('builds url with params, q and tracking', async () => {
    const { urlWithTrackingParams } = await importUtils();
    const url = urlWithTrackingParams({
      baseUrl: 'https://www.example.com',
      trackingParams: 'utm_source=x&utm_medium=y',
      params: { foo: 'bar' },
      term: 'hello world',
    });
    expect(url).toBe('https://www.example.com?foo=bar&q=hello%2520world&utm_source=x&utm_medium=y');
  });

  it('omits tracking when not provided', async () => {
    const { urlWithTrackingParams } = await importUtils();
    const url = urlWithTrackingParams({
      baseUrl: 'https://shop.test/path',
      params: { a: '1' },
      term: 't',
    });
    expect(url).toBe('https://shop.test/path?a=1&q=t');
  });

  it('overrides provided q param with term and keeps alphabetical order', async () => {
    const { urlWithTrackingParams } = await importUtils();
    const url = urlWithTrackingParams({
      baseUrl: 'https://x.test',
      params: { q: 'zzz', a: 'b' },
      term: 'c d',
      trackingParams: null,
    });
    expect(url).toBe('https://x.test?a=b&q=c%2520d');
  });

  it('works with empty extra params', async () => {
    const { urlWithTrackingParams } = await importUtils();
    const url = urlWithTrackingParams({
      baseUrl: 'https://x.test',
      term: 'k',
    });
    expect(url).toBe('https://x.test?q=k');
  });
});
