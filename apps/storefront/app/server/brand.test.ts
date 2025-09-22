import { beforeEach, describe, expect, it, vi } from 'vitest';

const importBrand = async () => (await import('./brand')).getBrandContext;

describe('getBrandContext', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns null brand/i18n/policy when @nuvens/brand-ui is absent', async () => {
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
});
