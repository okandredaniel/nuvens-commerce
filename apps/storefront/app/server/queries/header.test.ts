import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/fragments', () => ({
  HEADER_QUERY: '__HEADER_QUERY__',
}));

import { queryHeader } from './header';

describe('queryHeader', () => {
  it('calls storefront.query with HEADER_QUERY, main-menu handle and uppercased locale', async () => {
    const storefrontQuery = vi.fn().mockResolvedValue({ ok: true });
    const args = { context: { storefront: { query: storefrontQuery } } } as any;

    const result = await queryHeader(args, 'pt', 'br');

    expect(storefrontQuery).toHaveBeenCalledTimes(1);
    expect(storefrontQuery).toHaveBeenCalledWith('__HEADER_QUERY__', {
      variables: {
        headerMenuHandle: 'main-menu',
        language: 'PT',
        country: 'BR',
      },
    });
    expect(result).toEqual({ ok: true });
  });

  it('keeps uppercase values and constant handle', async () => {
    const storefrontQuery = vi.fn().mockResolvedValue('result');
    const args = { context: { storefront: { query: storefrontQuery } } } as any;

    await queryHeader(args, 'EN', 'US');

    expect(storefrontQuery).toHaveBeenCalledWith('__HEADER_QUERY__', {
      variables: {
        headerMenuHandle: 'main-menu',
        language: 'EN',
        country: 'US',
      },
    });
  });
});
