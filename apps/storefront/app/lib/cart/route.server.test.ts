import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/routing/guard', () => ({
  guardedLoader: (fn: any) => fn,
}));

vi.mock('@shopify/hydrogen', async () => {
  const ACTIONS = {
    LinesAdd: 'LinesAdd',
    LinesUpdate: 'LinesUpdate',
    LinesRemove: 'LinesRemove',
    DiscountCodesUpdate: 'DiscountCodesUpdate',
    GiftCardCodesUpdate: 'GiftCardCodesUpdate',
    BuyerIdentityUpdate: 'BuyerIdentityUpdate',
  } as const;

  function getFormInput(fd: FormData) {
    const action = fd.get('action') as string | null;
    const parse = (k: string) => {
      const v = fd.get(k);
      if (typeof v === 'string') {
        try {
          return JSON.parse(v);
        } catch {
          return v;
        }
      }
      return v;
    };
    return {
      action,
      inputs: {
        lines: parse('lines'),
        lineIds: parse('lineIds'),
        discountCode: fd.get('discountCode'),
        discountCodes: parse('discountCodes'),
        giftCardCode: fd.get('giftCardCode'),
        giftCardCodes: parse('giftCardCodes'),
        buyerIdentity: parse('buyerIdentity') || {},
      },
    };
  }

  return {
    CartForm: { ACTIONS, getFormInput },
  };
});

vi.mock('@shopify/remix-oxygen', async (orig) => {
  const actual: any = await (orig as any)();
  return {
    ...actual,
    data: (body: any, init?: ResponseInit) =>
      new Response(JSON.stringify(body), {
        status: init?.status ?? 200,
        headers: init?.headers,
      }),
  };
});

import { cartAction, cartLoader } from './route.server';

type CartResult = {
  cart: { id: string };
  errors: any[];
  warnings: any[];
};

function makeContext(overrides: Partial<Record<string, any>> = {}) {
  const baseResult: CartResult = { cart: { id: 'C1' }, errors: [], warnings: [] };
  const cart = {
    addLines: vi.fn(async () => baseResult),
    updateLines: vi.fn(async () => baseResult),
    removeLines: vi.fn(async () => baseResult),
    updateDiscountCodes: vi.fn(async () => baseResult),
    updateGiftCardCodes: vi.fn(async () => baseResult),
    updateBuyerIdentity: vi.fn(async () => baseResult),
    get: vi.fn(async () => baseResult),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    setCartId: vi.fn(() => new Headers({ 'Set-Cookie': 'cart=C1' })),
    ...overrides,
  };
  return { cart };
}

describe('cartAction', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles LinesAdd and sets headers', async () => {
    const form = new FormData();
    form.set('action', 'LinesAdd');
    form.set('lines', JSON.stringify([{ merchandiseId: 'm1', quantity: 1 }]));
    const res: any = await cartAction({
      request: new Request('http://x/cart', { method: 'POST', body: form }),
      context: makeContext(),
      params: {},
    } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.cart.id).toBe('C1');
    expect(json.errors).toEqual([]);
    expect(json.warnings).toEqual([]);
    const cache = res.headers.get('Cache-Control');
    const vary = res.headers.get('Vary');
    expect(cache).toBe('no-store');
    expect(vary).toContain('Cookie');
    expect(res.headers.get('Set-Cookie')).toContain('cart=C1');
  });

  it('handles DiscountCodesUpdate merging inputs', async () => {
    const ctx = makeContext();
    const form = new FormData();
    form.set('action', 'DiscountCodesUpdate');
    form.set('discountCode', 'ONE');
    form.set('discountCodes', JSON.stringify(['TWO', 3, 'THREE']));
    const res: any = await cartAction({
      request: new Request('http://x/cart', { method: 'POST', body: form }),
      context: ctx,
      params: {},
    } as any);
    expect(res.status).toBe(200);
    expect(ctx.cart.updateDiscountCodes).toHaveBeenCalledWith(['ONE', 'TWO', 'THREE']);
  });

  it('handles GiftCardCodesUpdate merging inputs', async () => {
    const ctx = makeContext();
    const form = new FormData();
    form.set('action', 'GiftCardCodesUpdate');
    form.set('giftCardCode', 'G1');
    form.set('giftCardCodes', JSON.stringify(['G2', null, 'G3']));
    const res: any = await cartAction({
      request: new Request('http://x/cart', { method: 'POST', body: form }),
      context: ctx,
      params: {},
    } as any);
    expect(res.status).toBe(200);
    expect(ctx.cart.updateGiftCardCodes).toHaveBeenCalledWith(['G1', 'G2', 'G3']);
  });

  it('handles BuyerIdentityUpdate', async () => {
    const ctx = makeContext();
    const form = new FormData();
    form.set('action', 'BuyerIdentityUpdate');
    form.set('buyerIdentity', JSON.stringify({ email: 'a@b.com' }));
    const res: any = await cartAction({
      request: new Request('http://x/cart', { method: 'POST', body: form }),
      context: ctx,
      params: {},
    } as any);
    expect(res.status).toBe(200);
    expect(ctx.cart.updateBuyerIdentity).toHaveBeenCalledWith({ email: 'a@b.com' });
  });

  it('redirects when redirectTo is provided', async () => {
    const ctx = makeContext();
    const form = new FormData();
    form.set('action', 'LinesRemove');
    form.set('lineIds', JSON.stringify(['l1']));
    form.set('redirectTo', '/thanks');
    const res: any = await cartAction({
      request: new Request('http://x/cart', { method: 'POST', body: form }),
      context: ctx,
      params: {},
    } as any);
    expect(res.status).toBe(303);
    expect(res.headers.get('Location')).toBe('/thanks');
  });
});

describe('cartLoader', () => {
  it('returns cart from context and sets no-store headers', async () => {
    const ctx = makeContext();
    const res: any = await cartLoader({
      request: new Request('http://x/cart'),
      context: ctx,
      params: {},
    } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.cart.id).toBe('C1');
    expect(res.headers.get('Cache-Control')).toBe('no-store');
    expect(res.headers.get('Vary')).toContain('Cookie');
  });
});
