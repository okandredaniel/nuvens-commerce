import { describe, expect, it } from 'vitest';
import { countryForLanguage, toLanguage } from './helpers';
import { Language } from './i18n.interface';

describe('helpers', () => {
  describe('toLanguage', () => {
    it('returns enum when enum is passed', () => {
      expect(toLanguage(Language.English)).toBe(Language.English);
    });

    it('parses BCP-47 strings and normalizes case', () => {
      expect(toLanguage('en-US')).toBe(Language.English);
      expect(toLanguage('EN-gb')).toBe(Language.English);
      expect(toLanguage('en')).toBe(Language.English);
    });

    it('falls back when input is unknown or undefined', () => {
      expect(toLanguage('xx' as any, Language.English)).toBe(Language.English);
      expect(toLanguage(undefined)).toBe(Language.English);
    });
  });

  describe('countryForLanguage', () => {
    it('uses override when valid and uppercases it', () => {
      const overrides = { [Language.English]: 'gb' } as Partial<Record<Language, string>>;
      const defaults = { [Language.English]: 'us' } as any;
      expect(countryForLanguage(Language.English, overrides, defaults)).toBe('GB');
      expect(countryForLanguage(Language.English, { [Language.English]: 'Br' }, defaults)).toBe(
        'BR',
      );
    });

    it('ignores invalid override and uses defaults', () => {
      const overrides = { [Language.English]: 'gbr' } as Partial<Record<Language, string>>;
      const defaults = { [Language.English]: 'us' } as any;
      expect(countryForLanguage(Language.English, overrides, defaults)).toBe('US');
    });

    it('uppercases from defaults when present', () => {
      const defaults = { [Language.English]: 'gb' } as any;
      expect(countryForLanguage(Language.English, undefined, defaults)).toBe('GB');
    });

    it('falls back to US when mapping is missing', () => {
      const defaults = {} as any;
      expect(countryForLanguage(Language.English, undefined, defaults)).toBe('US');
    });
  });
});
