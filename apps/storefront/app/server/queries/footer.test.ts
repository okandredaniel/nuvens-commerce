import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/fragments', () => ({
  FOOTER_QUERY: '__FOOTER_QUERY__',
}));

import { queryFooter } from './footer';

describe('queryFooter', () => {
  it('calls storefront.query with FOOTER_QUERY and uppercased locale', async () => {
    const env = { FOOTER_MENU_HANDLE: 'main-footer' } as any;
    const storefrontQuery = vi.fn().mockResolvedValue({ ok: true });
    const args = { context: { env, storefront: { query: storefrontQuery } } } as any;

    const result = await queryFooter(args, 'pt', 'br');

    expect(storefrontQuery).toHaveBeenCalledTimes(1);
    expect(storefrontQuery).toHaveBeenCalledWith('__FOOTER_QUERY__', {
      variables: {
        footerMenuHandle: 'main-footer',
        language: 'PT',
        country: 'BR',
      },
    });
    expect(result).toEqual({ ok: true });
  });

  it('passes through handle from env and keeps uppercase values', async () => {
    const env = { FOOTER_MENU_HANDLE: 'footer-handle' } as any;
    const storefrontQuery = vi.fn().mockResolvedValue('result');
    const args = { context: { env, storefront: { query: storefrontQuery } } } as any;

    await queryFooter(args, 'EN', 'US');

    expect(storefrontQuery).toHaveBeenCalledWith('__FOOTER_QUERY__', {
      variables: {
        footerMenuHandle: 'footer-handle',
        language: 'EN',
        country: 'US',
      },
    });
  });
});
