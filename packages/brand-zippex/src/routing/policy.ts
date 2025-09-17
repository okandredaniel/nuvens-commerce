import type { RouteAccessPolicy } from '@nuvens/core';

export const routeAccessPolicy: RouteAccessPolicy = {
  default: 'deny',
  expose: [
    '/',
    '/products/:handle',
    '/cart',
    '/cart.data',
    '/pages',
    '/pages/:handle',
    '/policies',
    '/policies/:handle',
    '/collections.data',
    '/collections/all.data',
    '/collections/:handle.data',
  ],
  restrictedResponse: { type: 'not_found' },
};
