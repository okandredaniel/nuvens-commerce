import { match } from 'path-to-regexp';
import type { RouteAccessPolicy } from './routing.interface';

export function stripLocale(pathname: string): { locale?: string; path: string } {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return { path: '/' };
  const first = parts[0];
  if (/^[a-z]{2}$/i.test(first)) {
    const rest = '/' + parts.slice(1).join('/');
    return {
      locale: first.toLowerCase(),
      path: rest === '/' ? '/' : rest,
    };
  }
  return { path: pathname || '/' };
}

export function prefixLocale(path: string, locale?: string): string {
  if (!locale) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}

function ensureSlash(p: string) {
  return p.startsWith('/') ? p : `/${p}`;
}

function dedupe<T>(arr: readonly T[] | undefined): T[] {
  return Array.from(new Set(arr ?? []));
}

function expandDataVariantsOne(p: string): string[] {
  const path = ensureSlash(p);
  if (path === '/') return ['/', '/_root.data'];
  if (path.endsWith('.data')) return [path, path.slice(0, -5)];
  return [path, `${path}.data`];
}

function expandDataVariants(list: readonly string[] | undefined): string[] {
  if (!list || list.length === 0) return [];
  const out: string[] = [];
  for (const p of list) out.push(...expandDataVariantsOne(p));
  return dedupe(out);
}

type NormalizedPolicy = {
  default: RouteAccessPolicy['default'];
  expose: string[];
  restrict: string[];
  restrictedResponse: RouteAccessPolicy['restrictedResponse'];
};

const cache = new WeakMap<RouteAccessPolicy, NormalizedPolicy>();

function getNormalizedPolicy(policy: RouteAccessPolicy): NormalizedPolicy {
  const hit = cache.get(policy);
  if (hit) return hit;
  const norm: NormalizedPolicy = {
    default: policy.default,
    expose: expandDataVariants(policy.expose),
    restrict: expandDataVariants(policy.restrict),
    restrictedResponse: policy.restrictedResponse,
  };
  cache.set(policy, norm);
  return norm;
}

function someMatch(path: string, patterns: readonly string[] | undefined): boolean {
  if (!patterns || patterns.length === 0) return false;
  for (const p of patterns) {
    try {
      const fn = match(p, { decode: decodeURIComponent });
      if (fn(path)) return true;
    } catch {
      /* empty */
    }
  }
  return false;
}

export function evaluateRouteAccess(
  policy: RouteAccessPolicy,
  pathWithoutLocale: string,
): { allowed: boolean } {
  const norm = getNormalizedPolicy(policy);
  if (someMatch(pathWithoutLocale, norm.restrict)) return { allowed: false };
  if (someMatch(pathWithoutLocale, norm.expose)) return { allowed: true };
  return { allowed: norm.default === 'allow' };
}

export function buildRestrictedResponse(policy: RouteAccessPolicy, locale?: string): Response {
  const r = policy.restrictedResponse;
  if (r.type === 'not_found') return new Response('Not Found', { status: 404 });
  const location = prefixLocale(r.to, locale);
  if (/^https?:\/\//i.test(location)) return Response.redirect(location, 302);
  const headers = new Headers();
  headers.set('Location', location);
  return new Response(null, { status: 302, headers });
}
