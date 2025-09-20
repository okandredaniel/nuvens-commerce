import { getLocaleFromRequest } from '@/i18n/storefront.server';
import { expect, test } from 'vitest';

function req(u: string, al?: string) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return new Request(u, { headers: al ? { 'accept-language': al } : undefined });
}

test('locale from pathname dominates accept-language', () => {
  const r = getLocaleFromRequest(req('http://localhost:3000/fr', 'es-ES,es;q=0.9'));
  expect(r.language).toBe('FR');
  expect(r.country).toBe('FR');
});

test('falls back to accept-language when no path locale', () => {
  const r = getLocaleFromRequest(req('http://localhost:3000/', 'es-ES,es;q=0.9'));
  expect(r.language).toBe('ES');
  expect(['ES', 'US', 'MX', 'AR']).toContain(r.country);
});
