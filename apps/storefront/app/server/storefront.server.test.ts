import { beforeEach, describe, expect, it, vi } from 'vitest';

const hoistedBrand = vi.hoisted(() => ({
  brandDefaultLocale: 'en-US',
  brandCountryOverrides: {} as Record<string, string>,
}));

vi.mock('@nuvens/brand-ui', () => hoistedBrand);

const coreMocks = vi.hoisted(() => ({
  toLanguage: vi.fn((input?: string, fallback?: string) => {
    const src = input && input.trim() ? input : fallback || 'en';
    const head = String(src).trim().split(/[,; ]/)[0] || 'en';
    const base = head.split(/[-_]/)[0];
    return base.toLowerCase();
  }),
  countryForLanguage: vi.fn((lang?: string, overrides?: Record<string, string>) => {
    const base = String(lang || '')
      .toLowerCase()
      .split('-')[0];
    const map: Record<string, string> = { en: 'US', fr: 'FR', es: 'ES', pt: 'PT', de: 'DE' };
    return (overrides && overrides[base]) || map[base] || 'US';
  }),
}));

vi.mock('@nuvens/core', () => coreMocks);

vi.mock('@/i18n/localize', () => {
  const toLang = vi.fn((s: any) =>
    String(s || 'en')
      .trim()
      .toLowerCase()
      .replace('_', '-'),
  );
  (globalThis as any).__toLang = toLang;
  return { toLang };
});

async function importModule() {
  vi.resetModules();
  return await import('./storefront.server');
}

function req(u: string, al?: string) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return new Request(u, { headers: al ? { 'accept-language': al } : undefined });
}

beforeEach(() => {
  vi.clearAllMocks();
  hoistedBrand.brandDefaultLocale = 'en-US';
  hoistedBrand.brandCountryOverrides = {};
});

describe('getLocaleFromRequest', () => {
  it('locale from pathname dominates accept-language', async () => {
    const { getLocaleFromRequest } = await importModule();
    const r = getLocaleFromRequest(req('http://localhost:3000/fr', 'es-ES,es;q=0.9'));
    expect(r.language).toBe('FR');
    expect(r.country).toBe('FR');
  });

  it('falls back to accept-language when no path locale', async () => {
    const { getLocaleFromRequest } = await importModule();
    const r = getLocaleFromRequest(req('http://localhost:3000/', 'es-ES,es;q=0.9'));
    expect(r.language).toBe('ES');
    expect(['ES', 'US', 'MX', 'AR', 'PT']).toContain(r.country);
  });

  it('uses brand defaults when neither path nor header provide language', async () => {
    hoistedBrand.brandDefaultLocale = 'pt-BR';
    const { getLocaleFromRequest } = await importModule();
    const r = getLocaleFromRequest(req('http://localhost:3000/'));
    expect(r.language).toBe('PT');
    expect(r.country).toBe('PT');
  });
});

describe('getActiveLocale', () => {
  it('uses path language when present', async () => {
    const { getActiveLocale } = await importModule();
    const args: any = {
      request: req('http://localhost:3000/pt'),
      context: { storefront: { i18n: { language: 'en', country: '' } } },
    };
    const out = getActiveLocale(args);
    expect(out.language).toBe('PT');
    expect(out.country).toBe('PT');
    expect(out.lang).toBe('pt');
  });

  it('uses accept-language when path missing', async () => {
    const { getActiveLocale } = await importModule();
    const args: any = {
      request: req('http://localhost:3000/', 'de-DE,de;q=0.9'),
      context: { storefront: { i18n: { language: 'fr', country: '' } } },
    };
    const out = getActiveLocale(args);
    expect(out.language).toBe('DE');
    expect(out.country).toBe('DE');
    expect(out.lang).toBe('de');
  });

  it('falls back to storefront i18n when header missing', async () => {
    const { getActiveLocale } = await importModule();
    const args: any = {
      request: req('http://localhost:3000/'),
      context: { storefront: { i18n: { language: 'fr', country: 'FR' } } },
    };
    const out = getActiveLocale(args);
    expect(out.language).toBe('FR');
    expect(out.country).toBe('FR');
    expect(out.lang).toBe('fr');
  });

  it('prefers storefront country over derived country', async () => {
    const { getActiveLocale } = await importModule();
    const args: any = {
      request: req('http://localhost:3000/en'),
      context: { storefront: { i18n: { language: 'es', country: 'CA' } } },
    };
    const out = getActiveLocale(args);
    expect(out.language).toBe('EN');
    expect(out.country).toBe('CA');
    expect(out.lang).toBe('en');
  });
});

describe('sfQuery', () => {
  it('calls storefront.query with merged vars and default cache', async () => {
    const { sfQuery } = await importModule();
    const query = vi.fn().mockResolvedValue({ ok: true });
    const CacheShort = vi.fn(() => 'CACHE_SHORT');
    const args: any = {
      request: req('http://localhost:3000/en'),
      context: { storefront: { i18n: { language: 'en', country: 'US' }, query, CacheShort } },
    };
    const doc = 'query Q { x }';
    const vars = { a: 1 };
    await sfQuery(args, doc, vars);
    expect(query).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledWith(doc, {
      variables: { language: 'EN', country: 'US', a: 1 },
      cache: 'CACHE_SHORT',
    });
  });

  it('uses provided cache when given', async () => {
    const { sfQuery } = await importModule();
    const query = vi.fn().mockResolvedValue({ ok: true });
    const CacheShort = vi.fn(() => 'IGNORED');
    const args: any = {
      request: req('http://localhost:3000/fr'),
      context: { storefront: { i18n: { language: 'fr', country: 'FR' }, query, CacheShort } },
    };
    const doc = 'query Q { y }';
    const vars = { b: 2 };
    await sfQuery(args, doc, vars, 'CUSTOM_CACHE');
    expect(query).toHaveBeenCalledWith(doc, {
      variables: { language: 'FR', country: 'FR', b: 2 },
      cache: 'CUSTOM_CACHE',
    });
  });
});
