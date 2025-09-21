import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/brand-ui', () => ({
  brandDefaultLocale: 'en',
}));

vi.mock('@nuvens/core', () => {
  function stripLocale(p: string) {
    const m = /^\/([a-z]{2}(?:-[a-z]{2})?)(?=\/|$)/i.exec(p || '/');
    if (!m) return { path: p || '/' };
    const re = new RegExp(`^/${m[1]}(?=/|$)`, 'i');
    const path = (p || '/').replace(re, '') || '/';
    return { lang: m[1].toLowerCase(), path };
  }
  return { stripLocale };
});

async function importModule() {
  return await import('./paths');
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('resolvePolicyPath', () => {
  it('removes .data suffix', async () => {
    const { resolvePolicyPath } = await importModule();
    expect(resolvePolicyPath('/privacy-policy.data')).toBe('/privacy-policy');
  });

  it('strips default locale prefix', async () => {
    const { resolvePolicyPath } = await importModule();
    expect(resolvePolicyPath('/en/privacy-policy')).toBe('/privacy-policy');
    expect(resolvePolicyPath('/en')).toBe('/');
  });

  it('strips non-default locale via stripLocale', async () => {
    const { resolvePolicyPath } = await importModule();
    expect(resolvePolicyPath('/fr/terms-of-service')).toBe('/terms-of-service');
    expect(resolvePolicyPath('/pt-br/refund-policy')).toBe('/refund-policy');
  });

  it('normalizes root aliases to "/"', async () => {
    const { resolvePolicyPath } = await importModule();
    expect(resolvePolicyPath('/_root')).toBe('/');
    expect(resolvePolicyPath('/index')).toBe('/');
    expect(resolvePolicyPath('/.')).toBe('/');
  });

  it('handles empty and base paths', async () => {
    const { resolvePolicyPath } = await importModule();
    expect(resolvePolicyPath('')).toBe('/');
    expect(resolvePolicyPath('/')).toBe('/');
  });

  it('leaves non-localized paths unchanged', async () => {
    const { resolvePolicyPath } = await importModule();
    expect(resolvePolicyPath('/shipping-policy')).toBe('/shipping-policy');
  });
});
