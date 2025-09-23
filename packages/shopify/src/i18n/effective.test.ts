import { Language } from '@nuvens/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const defaultLocale = Language.English;

const { toLangMock } = vi.hoisted(() => ({
  toLangMock: vi.fn((v: any) => (v ? String(v).toLowerCase() : 'en')),
}));

vi.mock('@nuvens/brand-ui', () => ({
  get brandDefaultLocale() {
    return (globalThis as any).__brandModule?.brandDefaultLocale;
  },
}));

vi.mock('./localize', () => ({ toLang: toLangMock }));

async function importEffective() {
  vi.resetModules();
  return await import('./effective');
}

describe('getEffectiveLang', () => {
  beforeEach(() => {
    toLangMock.mockClear();
    (globalThis as any).__brandModule = { brandDefaultLocale: 'en' };
  });

  it('prefers data.i18n.locale over others', async () => {
    (globalThis as any).__brandModule = { brandDefaultLocale: 'pt-BR' };
    const { getEffectiveLang } = await importEffective();
    const out = getEffectiveLang(defaultLocale, { i18n: { locale: 'ES-es' } });
    expect(out).toBe('es-es');
    expect(toLangMock).toHaveBeenCalledWith('ES-es');
  });

  it('falls back to data.consent.language when i18n is missing', async () => {
    (globalThis as any).__brandModule = { brandDefaultLocale: 'fr' };
    const { getEffectiveLang } = await importEffective();
    const out = getEffectiveLang(defaultLocale, { consent: { language: 'DE' } });
    expect(out).toBe('de');
    expect(toLangMock).toHaveBeenCalledWith('DE');
  });

  it('uses brandDefaultLocale when data does not provide language', async () => {
    (globalThis as any).__brandModule = { brandDefaultLocale: 'pt-BR' };
    const { getEffectiveLang } = await importEffective();
    const out = getEffectiveLang(defaultLocale, undefined);
    expect(out).toBe('pt-br');
    expect(toLangMock).toHaveBeenCalledWith('pt-BR');
  });

  it('returns fallback when brandDefaultLocale is not a string', async () => {
    (globalThis as any).__brandModule = { brandDefaultLocale: 123 as any };
    const { getEffectiveLang } = await importEffective();
    const out = getEffectiveLang(defaultLocale, undefined);
    expect(out).toBe('en');
    expect(toLangMock).toHaveBeenCalledWith(false);
  });
});
