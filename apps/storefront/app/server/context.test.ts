import { CART_QUERY_FRAGMENT } from '@/lib/fragments';
import { AppSession } from '@/lib/session';
import { createHydrogenContext } from '@shopify/hydrogen';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAppLoadContext } from './context';
import { getLocaleFromRequest } from './storefront.server';

vi.mock('@/lib/fragments', () => ({
  CART_QUERY_FRAGMENT: 'fragment CartFields on Cart { id }',
}));

vi.mock('./storefront.server', () => ({
  getLocaleFromRequest: vi.fn(() => ({ language: 'EN', country: 'US' })),
}));

vi.mock('@/lib/session', () => ({
  AppSession: { init: vi.fn(async () => ({ id: 'session' })) },
}));

vi.mock('@shopify/hydrogen', () => ({
  createHydrogenContext: vi.fn((opts: any) => ({ ...opts, __tag: 'ctx' })),
}));

describe('createAppLoadContext', () => {
  let cachesOpenMock: any;
  let cacheObj: any;

  beforeAll(() => {
    cacheObj = { name: 'hydrogen-cache' };
    cachesOpenMock = vi.fn(async () => cacheObj);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    globalThis.caches = { open: cachesOpenMock };
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws if SESSION_SECRET is missing', async () => {
    const req = new Request('https://example.com/');
    const env: any = {};
    const ec: any = { waitUntil: vi.fn() };
    await expect(createAppLoadContext(req, env, ec)).rejects.toThrow(
      'SESSION_SECRET environment variable is not set',
    );
  });

  it('initializes cache, session, i18n and builds Hydrogen context', async () => {
    const req = new Request('https://example.com/');
    const env: any = { SESSION_SECRET: 'secret' };
    const ec: any = { waitUntil: vi.fn() };

    const ctx: any = await createAppLoadContext(req, env, ec);

    expect(cachesOpenMock).toHaveBeenCalledWith('hydrogen');
    expect(AppSession.init).toHaveBeenCalledWith(req, [env.SESSION_SECRET]);
    expect(getLocaleFromRequest).toHaveBeenCalledWith(req);

    expect(createHydrogenContext).toHaveBeenCalledTimes(1);
    const passed = vi.mocked(createHydrogenContext).mock.calls[0][0];
    expect(passed.request).toBe(req);
    expect(passed.env).toBe(env);
    expect(passed.cache).toBe(cacheObj);
    expect(typeof passed.waitUntil).toBe('function');
    expect(passed.session).toEqual({ id: 'session' });
    expect(passed.i18n).toEqual({ language: 'EN', country: 'US' });
    expect(passed.cart?.queryFragment).toBe(CART_QUERY_FRAGMENT);

    const p = Promise.resolve();
    ctx.waitUntil(p);
    expect(ec.waitUntil).toHaveBeenCalledWith(p);
  });
});
