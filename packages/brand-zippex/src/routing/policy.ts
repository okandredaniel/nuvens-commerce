import type { RouteAccessPolicy } from '@nuvens/core';

export const routeAccessPolicy: RouteAccessPolicy = {
  default: 'deny',
  expose: [
    '/',
    '/cart',
    '/pages',
    '/pages/:handle',
    '/products/:handle',
    '/policies',
    '/policies/:handle',
  ],
  restrictedResponse: { type: 'not_found' },
};
