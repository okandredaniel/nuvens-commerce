export type RoutingPolicy = {
  isAllowed?: (path: string) => boolean;
  resolvePolicyPath?: (path: string) => string;
  recommendedFallback?: string;
  candidates?: string[];
};

export type StoreCtx<Header, Footer> = {
  publicStoreDomain?: string;
  primaryDomainUrl?: string;
  header?: Header;
  footer?: Promise<Footer>;
  routing?: RoutingPolicy;
};

export type UserCtx = {
  isLoggedIn: boolean;
};

export type BrandCtx = {
  brandId?: string;
  cssVars?: string;
};
