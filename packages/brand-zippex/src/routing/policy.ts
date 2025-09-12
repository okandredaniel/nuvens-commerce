import type { RouteAccessPolicy } from '@nuvens/core';

export const routeAccessPolicy: RouteAccessPolicy = {
  default: 'deny',
  expose: [
    '/',
    '/products/:handle',
    '/cart',
    '/pages',
    '/pages/:handle',
    '/policies',
    '/policies/:handle',
  ],
  restrictedResponse: { type: 'not_found' },
};
