import { Language } from '@nuvens/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const defaultLocale = Language.English;

const { toLangMock } = vi.hoisted(() => ({
  toLangMock: vi.fn((v: any) => (v ? String(v).toLowerCase() : 'en')),
}));

vi.mock('./localize', () => ({ toLang: toLangMock }));

async function loadWithAdapter(locale: any) {
  vi.resetModules();
  const { setShopifyAdapter } = await import('../adapter');
  setShopifyAdapter({ defaultLocale: locale });
  const { getEffectiveLang } = await import('./effective');
  return getEffectiveLang;
}

describe('getEffectiveLang', () => {
  beforeEach(() => {
    toLangMock.mockClear();
  });

  it('prefers data.i18n.locale over others', async () => {
    const getEffectiveLang = await loadWithAdapter('pt-BR');
    const out = getEffectiveLang(defaultLocale, { i18n: { locale: 'ES-es' } });
    expect(out).toBe('es-es');
    expect(toLangMock).toHaveBeenCalledWith('ES-es');
  });

  it('falls back to data.consent.language when i18n is missing', async () => {
    const getEffectiveLang = await loadWithAdapter('fr');
    const out = getEffectiveLang(defaultLocale, { consent: { language: 'DE' } });
    expect(out).toBe('de');
    expect(toLangMock).toHaveBeenCalledWith('DE');
  });

  it('uses adapter defaultLocale when data does not provide language', async () => {
    const getEffectiveLang = await loadWithAdapter('pt-BR');
    const out = getEffectiveLang(defaultLocale, undefined);
    expect(out).toBe('pt-br');
    expect(toLangMock).toHaveBeenCalledWith('pt-BR');
  });

  it('returns fallback when adapter defaultLocale is not a string', async () => {
    const getEffectiveLang = await loadWithAdapter(123 as any);
    const out = getEffectiveLang(defaultLocale, undefined);
    expect(out).toBe('en');
    expect(toLangMock).toHaveBeenCalledWith('en');
  });
});
