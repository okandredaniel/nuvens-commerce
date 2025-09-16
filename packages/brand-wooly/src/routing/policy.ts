import type { RouteAccessPolicy } from '@nuvens/core';

export const routeAccessPolicy: RouteAccessPolicy = {
  default: 'allow',
  restrict: [],
  restrictedResponse: { type: 'not_found' },
};
