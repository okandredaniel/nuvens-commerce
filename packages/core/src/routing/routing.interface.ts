export type RestrictedResponse = { type: 'not_found' } | { type: 'redirect'; to: string };

export type RouteAccessPolicy = {
  default: 'allow' | 'deny';
  expose?: string[];
  restrict?: string[];
  restrictedResponse: RestrictedResponse;
};
