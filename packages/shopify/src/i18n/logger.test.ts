import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.useFakeTimers();

const hoisted = vi.hoisted(() => ({
  brandDefaultLocale: 'en-US',
}));

vi.mock('@nuvens/brand-ui', () => hoisted);

type MissingKeyHandler = (lngs: string[] | string | undefined, ns: string, key: string) => void;

function createFakeI18n(language?: string) {
  const listeners: Record<string, MissingKeyHandler[]> = {};
  return {
    language,
    on(event: string, cb: MissingKeyHandler) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    },
    emitMissingKey(lngs?: string[] | string, ns = 'common', key = 'key') {
      (listeners['missingKey'] || []).forEach((cb) => cb(lngs, ns, key));
    },
  } as any;
}

async function importLogger() {
  vi.resetModules();
  return await import('./logger');
}

let warnSpy: ReturnType<typeof vi.spyOn>;
let logSpy: ReturnType<typeof vi.spyOn>;
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllTimers();
  vi.clearAllMocks();
});

describe('attachI18nDiagnostics', () => {
  it('batches repeated missingKey within window and logs once with count', async () => {
    const { attachI18nDiagnostics } = await importLogger();
    const inst = createFakeI18n('fr');
    attachI18nDiagnostics(inst, 200);
    inst.emitMissingKey(['fr'], 'ns', 'hello');
    inst.emitMissingKey(['fr'], 'ns', 'hello');
    inst.emitMissingKey(['fr'], 'ns', 'hello');
    vi.advanceTimersByTime(199);
    expect(warnSpy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const msg = String(warnSpy.mock.calls[0][0]);
    expect(msg).toContain('[i18n] Missing: ns:hello (fr) ×3');
  });

  it('uses instance.language or brandDefaultLocale when lngs are missing', async () => {
    vi.resetModules();
    const { setShopifyAdapter } = await import('../adapter');
    setShopifyAdapter({ defaultLocale: 'en-US' });
    const { attachI18nDiagnostics } = await import('./logger');

    const inst = createFakeI18n(undefined);
    attachI18nDiagnostics(inst, 100);
    inst.emitMissingKey(undefined, 'ns', 'keyX');
    vi.advanceTimersByTime(100);
    const msg = String(warnSpy.mock.calls[0][0]);
    expect(msg).toContain('(en-US)');
    expect(msg).toContain('ns:keyX');
  });

  it('is idempotent and does not add duplicate listeners when called twice', async () => {
    const { attachI18nDiagnostics } = await importLogger();
    const inst = createFakeI18n('en');
    attachI18nDiagnostics(inst, 100);
    attachI18nDiagnostics(inst, 100);
    inst.emitMissingKey(['en'], 'ns', 'onlyOnce');
    vi.advanceTimersByTime(100);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
});

describe('createI18nextLogger', () => {
  it('deduplicates logs within TTL and allows after TTL', async () => {
    const { createI18nextLogger } = await importLogger();
    const l = createI18nextLogger();
    l.warn('A');
    l.warn('A');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1499);
    l.warn('A');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(2);
    l.warn('A');
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });

  it('filters i18next missingKey logs', async () => {
    const { createI18nextLogger } = await importLogger();
    const l = createI18nextLogger();
    l.log('i18next::translator: missingKey en ns key');
    l.warn('i18next::translator: missingKey en ns key2');
    l.error('i18next::translator: missingKey en ns key3');
    expect(logSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('routes to proper console level', async () => {
    const { createI18nextLogger } = await importLogger();
    const l = createI18nextLogger();
    l.log('L1');
    l.warn('W1');
    l.error('E1');
    expect(logSpy).toHaveBeenCalledWith('L1');
    expect(warnSpy).toHaveBeenCalledWith('W1');
    expect(errorSpy).toHaveBeenCalledWith('E1');
  });
});
