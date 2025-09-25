import { beforeEach, expect, test } from 'vitest';
import { setShopifyAdapter } from '../adapter';
import { loadAppDictionaries, loadBrandDictionaries } from './resources';

function rec(pairs: Array<[string, any]>) {
  const o: Record<string, any> = {};
  for (const [k, v] of pairs) o[k] = v;
  return o;
}

beforeEach(() => {
  setShopifyAdapter({ defaultLocale: 'en' });
});

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

test('loadBrandDictionaries uses requested locale when available', () => {
  const brandMods = rec([
    [
      '/brand/a/common.i18n.ts',
      { default: { ns: 'common', resources: { en: { ok: 'OK' }, fr: { ok: "D'accord" } } } },
    ],
    [
      '/brand/b/header.i18n.ts',
      {
        default: { ns: 'header', resources: { en: { title: 'Shop' }, fr: { title: 'Boutique' } } },
      },
    ],
  ]);
  setShopifyAdapter({ defaultLocale: 'en' });
  const fr = loadBrandDictionaries('fr', brandMods);
  expect(fr.common.ok).toBe("D'accord");
  expect(fr.header.title).toBe('Boutique');
});

test('loadBrandDictionaries falls back to brand defaultLocale (full and base)', () => {
  const brandMods = rec([
    [
      '/brand/a/common.i18n.ts',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { default: { ns: 'common', resources: { pt: { ok: 'OK-PT' }, 'pt-br': { ok: 'OK-PTBR' } } } },
    ],
    [
      '/brand/b/header.i18n.ts',
      { default: { ns: 'header', resources: { pt: { title: 'Loja' } } } },
    ],
  ]);
  setShopifyAdapter({ defaultLocale: 'pt-BR' });
  const es = loadBrandDictionaries('es', brandMods);
  expect(es.common.ok === 'OK-PTBR' || es.common.ok === 'OK-PT').toBe(true);
  expect(es.header.title).toBe('Loja');
});

test('loadBrandDictionaries returns empty when neither requested nor brand default exist', () => {
  const brandMods = rec([
    ['/brand/a/common.i18n.ts', { default: { ns: 'common', resources: { de: { ok: 'OK' } } } }],
  ]);
  setShopifyAdapter({ defaultLocale: 'it' });
  const es = loadBrandDictionaries('es', brandMods);
  expect(es.common).toBeUndefined();
});
