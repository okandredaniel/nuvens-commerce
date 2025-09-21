import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { toLangMock } = vi.hoisted(() => ({
  toLangMock: vi.fn((v: any) => (v ? String(v).toLowerCase() : '')),
}));

vi.mock('./localize', () => ({ toLang: toLangMock }));

async function importModule() {
  vi.resetModules();
  return await import('./languageLabel');
}

let originalDisplayNames: any;

beforeEach(() => {
  toLangMock.mockClear();
  originalDisplayNames = (globalThis as any).Intl?.DisplayNames;
  (globalThis as any).__displayNamesMap = undefined;
  (globalThis as any).__displayNamesValue = undefined;
  (globalThis as any).Intl = {
    ...(globalThis as any).Intl,
    DisplayNames: class {
      locales: any;
      options: any;
      constructor(locales: any, options: any) {
        this.locales = locales;
        this.options = options;
      }
      of(code: string) {
        if ((globalThis as any).__displayNamesMap) {
          return (globalThis as any).__displayNamesMap[code];
        }
        return (globalThis as any).__displayNamesValue;
      }
    },
  };
});

afterEach(() => {
  (globalThis as any).Intl.DisplayNames = originalDisplayNames;
});

describe('languageInfo/languageLabel', () => {
  it('uses explicit label when it does not look like a code', async () => {
    const { languageInfo, languageLabel } = await importModule();
    const info = languageInfo('ES', 'en', 'Spanish (LatAm)');
    expect(info).toEqual({ code: 'es', label: 'Spanish (LatAm)' });
    expect(toLangMock).toHaveBeenCalledWith('ES');
    const label = languageLabel('ES', 'en', 'Spanish (LatAm)');
    expect(label).toBe('Spanish (LatAm)');
  });

  it('uses Intl.DisplayNames when explicit is absent', async () => {
    (globalThis as any).__displayNamesMap = { de: 'Deutsch' };
    const { languageInfo } = await importModule();
    const info = languageInfo('DE', 'en');
    expect(info).toEqual({ code: 'de', label: 'Deutsch' });
    expect(toLangMock).toHaveBeenCalledWith('DE');
  });

  it('ignores explicit when it looks like a code and uses Intl fallback', async () => {
    const langLowerCase = 'pt-br';
    (globalThis as any).__displayNamesMap = { [langLowerCase]: 'Brazilian Portuguese' };
    const { languageInfo } = await importModule();
    const info = languageInfo('pt-BR', 'en', 'PT-BR');
    expect(info).toEqual({ code: langLowerCase, label: 'Brazilian Portuguese' });
    expect(toLangMock).toHaveBeenCalledWith('pt-BR');
  });

  it('falls back to AUTONYMS when Intl returns undefined', async () => {
    (globalThis as any).__displayNamesValue = undefined;
    const { languageInfo } = await importModule();
    const info = languageInfo('pt', 'en');
    expect(info).toEqual({ code: 'pt', label: 'Português' });
    expect(toLangMock).toHaveBeenCalledWith('pt');
  });

  it('falls back to uppercase code when not in AUTONYMS', async () => {
    (globalThis as any).__displayNamesValue = undefined;
    const { languageInfo } = await importModule();
    const info = languageInfo('ru', 'en');
    expect(info).toEqual({ code: 'ru', label: 'RU' });
    expect(toLangMock).toHaveBeenCalledWith('ru');
  });

  it('handles Intl.DisplayNames throwing and still returns fallback', async () => {
    (globalThis as any).Intl.DisplayNames = class {
      constructor() {
        throw new Error('boom');
      }
    } as any;
    const { languageInfo } = await importModule();
    const info = languageInfo('it', 'en');
    expect(info).toEqual({ code: 'it', label: 'Italiano' });
    expect(toLangMock).toHaveBeenCalledWith('it');
  });
});
