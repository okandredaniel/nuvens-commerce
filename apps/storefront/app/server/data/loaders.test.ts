import { describe, expect, it, vi } from 'vitest';
import { loadCriticalData, loadDeferredData } from './loaders';

const qHeader = vi.fn(async (..._args: any[]) => 'HEADER_OK');
const qFooter = vi.fn(async (..._args: any[]) => 'FOOTER_OK');

vi.mock('../queries/header', () => ({
  queryHeader: (...args: any[]) => qHeader(...args),
}));
vi.mock('../queries/footer', () => ({
  queryFooter: (...args: any[]) => qFooter(...args),
}));

function mkArgs() {
  return {
    context: {
      env: {},
      storefront: {},
    },
  } as any;
}

describe('loaders module', () => {
  it('loadCriticalData returns header and calls queryHeader with uppercase i18n', async () => {
    const args = mkArgs();
    const res = await loadCriticalData(args, 'en', 'us');
    expect(res).toEqual({ header: 'HEADER_OK' });
    expect(qHeader).toHaveBeenCalledTimes(1);
    const call = qHeader.mock.calls[0];
    expect(call[0]).toBe(args);
    expect(call[1]).toBe('en');
    expect(call[2]).toBe('us');
  });

  it('loadDeferredData returns footer/cart/isLoggedIn (functions present)', async () => {
    const args = mkArgs();
    args.context.cart = { get: vi.fn(async () => 'CART_OK') };
    args.context.customerAccount = { isLoggedIn: vi.fn(() => true) };

    const res = loadDeferredData(args, 'pt', 'br');
    expect(qFooter).toHaveBeenCalledTimes(1);
    const call = qFooter.mock.calls[0];
    expect(call[0]).toBe(args);
    expect(call[1]).toBe('pt');
    expect(call[2]).toBe('br');

    await expect(res.footer).resolves.toBe('FOOTER_OK');
    await expect(res.cart).resolves.toBe('CART_OK');
    expect(res.isLoggedIn).toBe(true);
  });

  it('loadDeferredData falls back when cart/isLoggedIn not available', async () => {
    const args = mkArgs();

    const res = loadDeferredData(args, 'en', 'gb');
    await expect(res.footer).resolves.toBe('FOOTER_OK');
    await expect(res.cart).resolves.toBeNull();
    expect(res.isLoggedIn).toBe(false);
  });
});
