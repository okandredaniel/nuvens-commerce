import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./localize', () => {
  const fn = vi.fn((s: any) => (s ? String(s).trim().toLowerCase().replace('_', '-') : ''));
  return { toLang: fn };
});

async function fresh() {
  vi.resetModules();
  const normalize = await import('./normalize');
  const adapter = await import('../adapter');
  return { normalize, adapter };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('normalizeResources', () => {
  it('converts lang-first input to ns-first with normalized language codes', async () => {
    const { normalize } = await fresh();
    const input = { EN: { common: { a: 1 }, home: { b: 2 } }, Fr: { common: { a: 9 } } };
    const out = normalize.normalizeResources(input as any);
    expect(out).toStrictEqual({
      common: { en: { a: 1 }, fr: { a: 9 } },
      home: { en: { b: 2 } },
    });
  });

  it('handles ns-first input with language keys', async () => {
    const { normalize } = await fresh();
    const input = { common: { en: { a: 1 }, pt: { a: 2 } }, home: { fr: { b: 3 } } };
    const out = normalize.normalizeResources(input as any);
    expect(out).toStrictEqual({
      common: { en: { a: 1 }, pt: { a: 2 } },
      home: { fr: { b: 3 } },
    });
  });

  it('uses adapter defaultLocale for ns-first bundles without language keys', async () => {
    const { normalize, adapter } = await fresh();
    adapter.setShopifyAdapter({ defaultLocale: 'pt-BR' });
    const input = { common: { a: 1 }, home: { b: 2 } };
    const out = normalize.normalizeResources(input as any);
    const lang = 'pt-br';
    expect(out).toStrictEqual({
      common: { [lang]: { a: 1 } },
      home: { [lang]: { b: 2 } },
    });
  });

  it('returns empty object for non-object input', async () => {
    const { normalize } = await fresh();
    expect(normalize.normalizeResources(null as any)).toStrictEqual({});
    expect(normalize.normalizeResources(undefined as any)).toStrictEqual({});
    expect(normalize.normalizeResources(123 as any)).toStrictEqual({});
    expect(normalize.normalizeResources('x' as any)).toStrictEqual({});
    expect(normalize.normalizeResources([] as any)).toStrictEqual({});
  });
});

describe('mergeResources', () => {
  it('selects bundles for the requested language across inputs and merges by namespace', async () => {
    const { normalize, adapter } = await fresh();
    adapter.setShopifyAdapter({ defaultLocale: 'en-US' });
    const input1 = { common: { en: { a: 1, x: 1 }, fr: { a: 9 } }, home: { en: { b: 2 } } };
    const input2 = { EN: { header: { t: 'Top' } }, fr: { header: { t: 'Haut' } } };
    const input3 = { common: { EN: { x: 2, y: 3 } } };
    const out = normalize.mergeResources('en', input1, input2, input3);
    expect(out).toStrictEqual({
      common: { a: 1, x: 2, y: 3 },
      home: { b: 2 },
      header: { t: 'Top' },
    });
  });

  it('falls back to adapter defaultLocale when namespace lacks requested language', async () => {
    const { normalize, adapter } = await fresh();
    adapter.setShopifyAdapter({ defaultLocale: 'pt-BR' });
    const input = { common: { pt: { a: 1 } }, home: { es: { b: 2 } }, extra: { pt: { z: 9 } } };
    const out = normalize.mergeResources('es', input);
    expect(out).toStrictEqual({ common: { a: 1 }, home: { b: 2 }, extra: { z: 9 } });
  });

  it('ignores non-object inputs and returns empty when nothing matches', async () => {
    const { normalize, adapter } = await fresh();
    adapter.setShopifyAdapter({ defaultLocale: 'en-US' });
    const out = normalize.mergeResources('de', null as any, 1 as any, 'x' as any, []);
    expect(out).toStrictEqual({});
  });

  it('prefers exact language over fallback when both exist', async () => {
    const { normalize, adapter } = await fresh();
    adapter.setShopifyAdapter({ defaultLocale: 'en-US' });
    const input = { common: { en: { a: 1 }, de: { a: 2 } } };
    const out = normalize.mergeResources('de', input);
    expect(out).toStrictEqual({ common: { a: 2 } });
  });
});
