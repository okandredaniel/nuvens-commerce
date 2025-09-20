import { brandDefaultLocale } from '@nuvens/brand-ui';
import { stripLocale } from '@nuvens/core';

const stripDefaultLocalePrefix = (p: string) =>
  p.replace(new RegExp(`^\\/(${brandDefaultLocale})(?=\\/|$)`, 'i'), '') || '/';

function normalizeRootAliases(p: string) {
  if (p === '/_root' || p === '/index' || p === '/.') return '/';
  return p || '/';
}

export function resolvePolicyPath(pathname: string): string {
  const base = (pathname || '/').replace(/\.data$/, '');
  const noDefaultPrefix = stripDefaultLocalePrefix(base);
  const { path } = stripLocale(noDefaultPrefix);
  return normalizeRootAliases(path);
}
