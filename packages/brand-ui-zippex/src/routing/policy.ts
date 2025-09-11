import type { RouteAccessPolicy } from '@nuvens/ui-core';

export const routeAccessPolicy: RouteAccessPolicy = {
  default: 'deny',
  expose: [
    '/',
    '/product/:handle',
    '/cart',
    '/pages',
    '/pages/:handle',
    '/policies',
    '/policies/:handle',
  ],
  restrictedResponse: { type: 'not_found' },
};
