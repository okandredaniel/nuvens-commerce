import { brandDefaultLocale } from '@nuvens/brand-ui';
import { toLang } from './localize';

type Dict = Record<string, any>;
type NsFirst = Record<string, Record<string, Dict>>;

const isObj = (v: unknown): v is Record<string, any> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);
const isLang = (k: string) => /^[a-z]{2}$/i.test(k);

export function normalizeResources(input: unknown): NsFirst {
  const out: NsFirst = {};
  if (!isObj(input)) return out;
  const entries = Object.entries(input);
  const langFirst = entries.every(([k, v]) => isLang(k) && isObj(v));
  if (langFirst) {
    for (const [langKey, nsBag] of entries) {
      const l = toLang(langKey);
      if (!isObj(nsBag)) continue;
      for (const [ns, bundle] of Object.entries(nsBag)) {
        if (!isObj(bundle)) continue;
        (out[ns] ||= {})[l] = bundle;
      }
    }
    return out;
  }
  for (const [ns, byLangOrBundle] of entries) {
    if (!isObj(byLangOrBundle)) continue;
    const hasLangNested = Object.keys(byLangOrBundle).some(isLang);
    if (hasLangNested) {
      for (const [lKey, bundle] of Object.entries(byLangOrBundle)) {
        if (!isLang(lKey) || !isObj(bundle)) continue;
        (out[ns] ||= {})[toLang(lKey)] = bundle;
      }
    } else {
      const def = toLang(String(brandDefaultLocale) || 'en');
      (out[ns] ||= {})[def] = byLangOrBundle as Dict;
    }
  }
  return out;
}

export function mergeResources(lang: string, ...inputs: Array<unknown>) {
  const l = toLang(lang || String(brandDefaultLocale) || 'en');
  const nsFirst: NsFirst = {};
  for (const res of inputs) {
    const n = normalizeResources(res);
    for (const [ns, byLang] of Object.entries(n)) {
      const src = byLang[l] ?? byLang[toLang(String(brandDefaultLocale) || 'en')];
      if (!isObj(src)) continue;
      nsFirst[ns] ||= {};
      nsFirst[ns][l] = { ...(nsFirst[ns][l] || {}), ...src };
    }
  }
  const out: Record<string, Dict> = {};
  for (const [ns, byLang] of Object.entries(nsFirst)) {
    const bundle = byLang[l];
    if (isObj(bundle)) out[ns] = bundle;
  }
  return out;
}
