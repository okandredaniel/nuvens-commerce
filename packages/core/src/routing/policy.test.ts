import { describe, expect, test } from 'vitest';
import { buildRestrictedResponse, evaluateRouteAccess, prefixLocale, stripLocale } from './policy';
import type { RouteAccessPolicy } from './routing.interface';

describe('stripLocale', () => {
  test('root without locale', () => {
    expect(stripLocale('/')).toEqual({ path: '/' });
  });
  test('extracts locale from "/fr"', () => {
    expect(stripLocale('/fr')).toEqual({ locale: 'fr', path: '/' });
  });
  test('extracts locale from "/fr/avis"', () => {
    expect(stripLocale('/fr/avis')).toEqual({ locale: 'fr', path: '/avis' });
  });
  test('no locale when segment is longer', () => {
    expect(stripLocale('/free')).toEqual({ path: '/free' });
  });
});

describe('prefixLocale', () => {
  test('adds locale to absolute path', () => {
    expect(prefixLocale('/avis', 'fr')).toBe('/fr/avis');
  });
  test('skips when no locale', () => {
    expect(prefixLocale('/avis')).toBe('/avis');
  });
  test('keeps external urls untouched', () => {
    expect(prefixLocale('https://example.com/x', 'fr')).toBe('https://example.com/x');
  });
});

describe('evaluateRouteAccess with .data expansion', () => {
  test('restrict "/" also restricts "/_root.data"', () => {
    const policy: RouteAccessPolicy = {
      default: 'allow',
      restrict: ['/'],
      expose: [],
      restrictedResponse: { type: 'not_found' },
    };
    expect(evaluateRouteAccess(policy, '/').allowed).toBe(false);
    expect(evaluateRouteAccess(policy, '/_root.data').allowed).toBe(false);
  });

  test('restrict "/cart.data" also restricts "/cart"', () => {
    const policy: RouteAccessPolicy = {
      default: 'allow',
      restrict: ['/cart.data'],
      expose: [],
      restrictedResponse: { type: 'not_found' },
    };
    expect(evaluateRouteAccess(policy, '/cart').allowed).toBe(false);
    expect(evaluateRouteAccess(policy, '/cart.data').allowed).toBe(false);
  });

  test('expose "/policy" also exposes "/policy.data" when default deny', () => {
    const policy: RouteAccessPolicy = {
      default: 'deny',
      restrict: [],
      expose: ['/policy'],
      restrictedResponse: { type: 'not_found' },
    };
    expect(evaluateRouteAccess(policy, '/policy').allowed).toBe(true);
    expect(evaluateRouteAccess(policy, '/policy.data').allowed).toBe(true);
  });

  test('restrict wins over expose', () => {
    const policy: RouteAccessPolicy = {
      default: 'allow',
      restrict: ['/pages/:slug'],
      expose: ['/pages/help'],
      restrictedResponse: { type: 'not_found' },
    };
    expect(evaluateRouteAccess(policy, '/pages/help').allowed).toBe(false);
  });
});

describe('buildRestrictedResponse', () => {
  test('returns 404 on not_found', () => {
    const policy: RouteAccessPolicy = {
      default: 'deny',
      restrict: ['/'],
      expose: [],
      restrictedResponse: { type: 'not_found' },
    };
    const res = buildRestrictedResponse(policy, 'fr');
    expect(res.status).toBe(404);
  });

  test('redirects with locale prefix when redirect', () => {
    const policy: RouteAccessPolicy = {
      default: 'deny',
      restrict: ['/'],
      expose: [],
      restrictedResponse: { type: 'redirect', to: '/login' },
    };
    const res = buildRestrictedResponse(policy, 'fr');
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/fr/login');
  });
});
