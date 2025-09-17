import { coreI18n } from '@nuvens/core';

type I18nNamespaces = Record<string, unknown>;
type I18nResources = Record<string, I18nNamespaces>;

function asResources(x: unknown): I18nResources {
  if (!x || typeof x !== 'object') return {};
  return x as I18nResources;
}

export function mergeI18nResources(
  lang: string,
  brandI18n: any,
  brandBundleRes: Record<string, any>,
  appRes: Record<string, any>,
) {
  const coreRes = asResources((coreI18n as any)?.resources)?.[lang] ?? {};
  const brandStaticRes = asResources(brandI18n?.resources)?.[lang] ?? {};
  const nsSet = new Set([
    ...Object.keys(coreRes),
    ...Object.keys(brandStaticRes),
    ...Object.keys(brandBundleRes),
    ...Object.keys(appRes),
  ]);
  const resources: Record<string, any> = {};
  for (const ns of nsSet) {
    resources[ns] = {
      ...(coreRes as any)[ns],
      ...(brandStaticRes as any)[ns],
      ...(brandBundleRes as any)[ns],
      ...(appRes as any)[ns],
    };
  }
  return resources;
}
