/* @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./logger', () => {
  const attachI18nDiagnostics = vi.fn();
  const createI18nextLogger = () => ({
    type: 'logger',
    log() {},
    warn() {},
    error() {},
  });
  return { attachI18nDiagnostics, createI18nextLogger };
});

async function loadI18n() {
  vi.resetModules();
  delete (globalThis as any).__i18nSingleton__;
  delete (globalThis as any).__i18n;
  return await import('./createInstance');
}

describe('createI18n', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with given locale/resources and attaches diagnostics', async () => {
    const { createI18n } = await loadI18n();
    const logger = await import('./logger');
    const i = createI18n('en', { common: { hello: 'Hello' } });
    await new Promise((r) => setTimeout(r, 0));
    expect(i.isInitialized).toBe(true);
    expect(i.language).toBe('en');
    expect(i.t('hello')).toBe('Hello');
    expect(i.t('missing.key')).toBe('⟦MISSING:missing.key⟧');
    expect((logger as any).attachI18nDiagnostics).toHaveBeenCalledTimes(1);
    expect((globalThis as any).__i18n).toBe(i);
  });

  it('reuses singleton and updates language/resources on subsequent calls', async () => {
    const { createI18n } = await loadI18n();
    const logger = await import('./logger');
    const i1 = createI18n('en', { common: { hello: 'Hello' } });
    await new Promise((r) => setTimeout(r, 0));
    const i2 = createI18n('pt', { common: { hello: 'Olá' }, other: { foo: 'bar' } });
    await new Promise((r) => setTimeout(r, 0));
    expect(i2).toBe(i1);
    expect(i2.language).toBe('pt');
    expect(i2.t('hello')).toBe('Olá');
    expect((logger as any).attachI18nDiagnostics).toHaveBeenCalledTimes(2);
  });

  it('sets defaultNS to common when present, otherwise first namespace', async () => {
    const { createI18n } = await loadI18n();
    const i1 = createI18n('en', { common: { k: 'v' }, a: { x: 'y' } });
    await new Promise((r) => setTimeout(r, 0));
    expect(i1.options?.defaultNS).toBe('common');
    const i2 = createI18n('fr', { alpha: { a: 'A' }, zed: { z: 'Z' } });
    await new Promise((r) => setTimeout(r, 0));
    expect(i2.options?.defaultNS).toBe('alpha');
    expect(i2.t('a')).toBe('A');
  });

  it('adds bundles when already initialized and switches language if needed', async () => {
    const { createI18n } = await loadI18n();
    const i = createI18n('en', { common: { hello: 'Hello' } });
    await new Promise((r) => setTimeout(r, 0));
    const same = createI18n('de', { common: { hello: 'Hallo' }, extra: { e: 'E' } });
    await new Promise((r) => setTimeout(r, 0));
    expect(same.language).toBe('de');
    expect(same.t('hello')).toBe('Hallo');
    expect(same.hasResourceBundle('de', 'extra')).toBe(true);
  });
});
