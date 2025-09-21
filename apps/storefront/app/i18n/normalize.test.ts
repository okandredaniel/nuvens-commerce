import { beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  brandDefaultLocale: 'en-US',
}));

vi.mock('@nuvens/brand-ui', () => hoisted);

vi.mock('./localize', () => {
  const fn = vi.fn((s: any) => {
    if (!s) return 'en';
    return String(s).trim().toLowerCase().replace('_', '-');
  });
  return { toLang: fn };
});

async function importNormalize() {
  vi.resetModules();
  return await import('./normalize');
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('normalizeResources', () => {
  it('converts lang-first input to ns-first with normalized language codes', async () => {
    const { normalizeResources } = await importNormalize();
    const input = {
      EN: { common: { a: 1 }, home: { b: 2 } },
      Fr: { common: { a: 9 } },
    };
    const out = normalizeResources(input as any);
    expect(out).toStrictEqual({
      common: { en: { a: 1 }, fr: { a: 9 } },
      home: { en: { b: 2 } },
    });
  });

  it('handles ns-first input with language keys', async () => {
    const { normalizeResources } = await importNormalize();
    const input = {
      common: { en: { a: 1 }, pt: { a: 2 } },
      home: { fr: { b: 3 } },
    };
    const out = normalizeResources(input as any);
    expect(out).toStrictEqual({
      common: { en: { a: 1 }, pt: { a: 2 } },
      home: { fr: { b: 3 } },
    });
  });

  it('uses brandDefaultLocale for ns-first bundles without language keys', async () => {
    hoisted.brandDefaultLocale = 'pt-BR';
    const { normalizeResources } = await importNormalize();
    const input = {
      common: { a: 1 },
      home: { b: 2 },
    };
    const out = normalizeResources(input as any);
    const lang = 'pt-br';
    expect(out).toStrictEqual({
      common: { [lang]: { a: 1 } },
      home: { [lang]: { b: 2 } },
    });
  });

  it('returns empty object for non-object input', async () => {
    const { normalizeResources } = await importNormalize();
    expect(normalizeResources(null as any)).toStrictEqual({});
    expect(normalizeResources(undefined as any)).toStrictEqual({});
    expect(normalizeResources(123 as any)).toStrictEqual({});
    expect(normalizeResources('x' as any)).toStrictEqual({});
    expect(normalizeResources([] as any)).toStrictEqual({});
  });
});

describe('mergeResources', () => {
  it('selects bundles for the requested language across inputs and merges by namespace', async () => {
    hoisted.brandDefaultLocale = 'en-US';
    const { mergeResources } = await importNormalize();
    const input1 = {
      common: { en: { a: 1, x: 1 }, fr: { a: 9 } },
      home: { en: { b: 2 } },
    };
    const input2 = {
      EN: { header: { t: 'Top' } },
      fr: { header: { t: 'Haut' } },
    };
    const input3 = {
      common: { EN: { x: 2, y: 3 } },
    };
    const out = mergeResources('en', input1, input2, input3);
    expect(out).toStrictEqual({
      common: { a: 1, x: 2, y: 3 },
      home: { b: 2 },
      header: { t: 'Top' },
    });
  });

  it('falls back to brandDefaultLocale when namespace lacks requested language', async () => {
    hoisted.brandDefaultLocale = 'pt-BR';
    const { mergeResources } = await importNormalize();
    const input = {
      common: { pt: { a: 1 } },
      home: { es: { b: 2 } },
      extra: { pt: { z: 9 } },
    };
    const out = mergeResources('es', input);
    expect(out).toStrictEqual({
      common: { a: 1 },
      home: { b: 2 },
      extra: { z: 9 },
    });
  });

  it('ignores non-object inputs and returns empty when nothing matches', async () => {
    hoisted.brandDefaultLocale = 'en-US';
    const { mergeResources } = await importNormalize();
    const out = mergeResources('de', null as any, 1 as any, 'x' as any, []);
    expect(out).toStrictEqual({});
  });

  it('prefers exact language over fallback when both exist', async () => {
    hoisted.brandDefaultLocale = 'en-US';
    const { mergeResources } = await importNormalize();
    const input = {
      common: { en: { a: 1 }, de: { a: 2 } },
    };
    const out = mergeResources('de', input);
    expect(out).toStrictEqual({ common: { a: 2 } });
  });
});
