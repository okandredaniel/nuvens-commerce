import { resolvePathname } from '@/server/routing/resolvePathname';
import { expect, test } from 'vitest';

function req(u: string) {
  return new Request(u);
}

test('maps .data root variants to /', () => {
  expect(resolvePathname(req('http://localhost:3000/.data'))).toBe('/');
  expect(resolvePathname(req('http://localhost:3000/_root.data'))).toBe('/');
  expect(resolvePathname(req('http://localhost:3000/index.data'))).toBe('/');
});

test('strips .data and preserves locale segments', () => {
  expect(resolvePathname(req('http://localhost:3000/fr.data'))).toBe('/fr');
  expect(resolvePathname(req('http://localhost:3000/fr/avis.data'))).toBe('/fr/avis');
});
