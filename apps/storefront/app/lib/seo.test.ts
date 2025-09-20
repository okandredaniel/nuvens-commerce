import { buildCanonical, buildHreflangs } from '@/lib/seo';
import { brandDefaultLocale, brandLocales } from '@nuvens/brand-ui';
import { expect, test } from 'vitest';

const base = 'https://example.com';

test('canonical removes default-locale prefix and strips utm', () => {
  const c1 = buildCanonical(base, `/${brandDefaultLocale}/page`, '?utm_source=x&a=1');
  expect(c1).toBe('https://example.com/page?a=1');
  const c2 = buildCanonical(base, '/fr', '?utm_medium=y');
  expect(c2).toBe('https://example.com/fr');
});

test('hreflangs include default without prefix and others with prefix', () => {
  const alts = buildHreflangs(base, '/es', '?utm_campaign=z');
  const langs = new Set(alts.map((a) => a.hrefLang));
  expect(langs.has('x-default')).toBe(true);
  expect(langs.has(brandDefaultLocale)).toBe(true);
  for (const l of brandLocales) expect(langs.has(l)).toBe(true);
  const def = alts.find((a) => a.hrefLang === brandDefaultLocale)!;
  const es = alts.find((a) => a.hrefLang === 'es')!;
  expect(def.href).toBe('https://example.com');
  expect(es.href).toBe('https://example.com/es');
});
