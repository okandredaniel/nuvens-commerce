import type { I18nBundle } from '@nuvens/ui-core';
import type { i18n as I18nInstance } from 'i18next';

const localBundles = import.meta.glob<I18nBundle>('../../../**/*.i18n.{ts,js}', { eager: true });
const brandBundles = import.meta.glob<I18nBundle>(
  '../../../../../packages/brand-ui-*/src/**/*.i18n.{ts,js}',
  { eager: true },
);

function toBundle(mod: unknown): I18nBundle | null {
  const b = (mod as any)?.default ?? mod;
  return b && typeof b.ns === 'string' && b.resources ? (b as I18nBundle) : null;
}

export function registerI18nBundles(i18n: I18nInstance) {
  const entries = Object.entries({ ...localBundles, ...brandBundles });
  for (const [, mod] of entries) {
    const bundle = toBundle(mod);
    if (!bundle) continue;
    const { ns, resources } = bundle;
    for (const [lng, dict] of Object.entries(resources)) {
      i18n.addResourceBundle(lng, ns, dict as Record<string, string>, true, true);
    }
  }
}
