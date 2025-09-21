import { brandDefaultLocale } from '@nuvens/brand-ui';
import { expect, test } from 'vitest';
import { loadAppDictionaries, loadBrandDictionaries } from './resources';

function rec(pairs: Array<[string, any]>) {
  const o: Record<string, any> = {};
  for (const [k, v] of pairs) o[k] = v;
  return o;
}

test('loadAppDictionaries merges only matching locale and namespaces', () => {
  const frOutside = { default: { common: { hello: 'Bonjour' }, nav: { home: 'Accueil' } } };
  const frInside = {
    default: { common: { welcome: 'Bienvenue' }, footer: { contact: 'Contact' } },
  };

  const mods = rec([
    ['/abs/outside/locales/fr/index.ts', frOutside],
    ['/abs/inside/locales/fr/index.ts', frInside],
    ['/abs/outside/locales/en/index.ts', { default: { common: { hello: 'Hello' } } }],
  ]);

  const out = loadAppDictionaries('fr', mods);
  expect(out.common.hello).toBe('Bonjour');
  expect(out.common.welcome).toBe('Bienvenue');
  expect(out.nav.home).toBe('Accueil');
  expect(out.footer.contact).toBe('Contact');
  expect(out.common.hello).not.toBe('Hello');
});

test('loadBrandDictionaries picks requested locale or falls back to brand default', () => {
  const bundleA = {
    default: {
      ns: 'common',
      resources: {
        en: { ok: 'OK', yes: 'Yes' },
        fr: { ok: "D'accord" },
      },
    },
  };
  const bundleB = {
    default: {
      ns: 'header',
      resources: {
        en: { title: 'Shop' },
        fr: { title: 'Boutique' },
      },
    },
  };

  const brandMods = rec([
    ['/brand/a/common.i18n.ts', bundleA],
    ['/brand/b/header.i18n.ts', bundleB],
  ]);

  const fr = loadBrandDictionaries('fr', brandMods);
  expect(fr.common.ok).toBe("D'accord");
  expect(fr.header.title).toBe('Boutique');

  const es = loadBrandDictionaries('es', brandMods);
  expect(brandDefaultLocale).toBe('en');
  expect(es.common.ok).toBe('OK');
  expect(es.header.title).toBe('Shop');
});
