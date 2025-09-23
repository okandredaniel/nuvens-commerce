import { expect, test } from 'vitest';
import { localizeTo, toLang } from './localize';

const defaultLocale = 'en';

test('toLang normalizes tags', () => {
  expect(toLang('fr-FR')).toBe('fr');
  expect(toLang('es')).toBe('es');
  expect(toLang(undefined)).toBe(defaultLocale);
});

test('localizeTo keeps default locale without prefix', () => {
  expect(localizeTo('/')).toBe('/');
  expect(localizeTo('/collections', defaultLocale)).toBe('/collections');
});

test('localizeTo prefixes non-default locale', () => {
  expect(localizeTo('/', 'fr')).toBe('/fr');
  expect(localizeTo('/collections', 'fr')).toBe('/fr/collections');
});

test('localizeTo strips duplicate prefix and preserves query/hash', () => {
  expect(localizeTo('/fr/avis?x=1#y', 'fr')).toBe('/fr/avis?x=1#y');
  expect(localizeTo('/fr', defaultLocale)).toBe('/');
});
