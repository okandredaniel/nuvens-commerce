import { beforeEach, describe, expect, it, vi } from 'vitest';

const importBrand = async () => (await import('./brand')).getBrandContext;

describe('getBrandContext', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  it('returns null brand/i18n/policy when @nuvens/brand-ui is absent', async () => {
    vi.doMock('@nuvens/brand-ui', () => {
      const err: any = new Error('MODULE_NOT_FOUND');
      err.code = 'MODULE_NOT_FOUND';
      throw err;
    });

    const getBrandContext = await importBrand();
    const ctx = await getBrandContext();
    expect(ctx.brand).toBeNull();
    expect(ctx.brandI18n).toBeNull();
    expect(ctx.policy).toBeNull();
  });

  it('exposes brand id from env and passes-through policy & i18n when present', async () => {
    vi.doMock('@nuvens/brand-ui', () => ({
      routeAccessPolicy: { allow: ['*'] },
      brandI18n: { en: { foo: 'bar' } },
    }));

    const getBrandContext = await importBrand();
    const ctx = await getBrandContext({ BRAND_ID: 'zippex' } as any);
    expect(ctx.brand).toEqual({ id: 'zippex' });
    expect(ctx.policy).toEqual({ allow: ['*'] });
    expect(ctx.brandI18n).toEqual({ en: { foo: 'bar' } });
  });

  it('falls back to process.env when env param is omitted', async () => {
    vi.stubEnv('BRAND_ID', 'wooly');
    vi.doMock('@nuvens/brand-ui', () => ({
      routeAccessPolicy: {},
      brandI18n: {},
    }));

    const getBrandContext = await importBrand();
    const ctx = await getBrandContext();
    expect(ctx.brand).toEqual({ id: 'wooly' });
  });

  it('caches the result across calls', async () => {
    vi.doMock('@nuvens/brand-ui', () => ({
      routeAccessPolicy: { allow: ['x'] },
      brandI18n: { fr: {} },
    }));

    const getBrandContext = await importBrand();
    const first = await getBrandContext({ BRAND_ID: 'brand' } as any);
    const second = await getBrandContext({ BRAND_ID: 'other' } as any);
    expect(second).toBe(first);
  });
});
