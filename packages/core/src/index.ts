// adapters
export type { CoreAdapter, CoreLinkProps, CoreNavLinkProps } from './adapters/adapters.interface';
export * from './adapters/core-adapter';

// i18n
export * from './i18n/config';
export * from './i18n/core';
export { Language } from './i18n/i18n.interface';
export type { BundleResources, CountryMap, I18nBundle, Resources } from './i18n/i18n.interface';

// routing
export * from './routing/policy';
export type { RestrictedResponse, RouteAccessPolicy } from './routing/routing.interface';

// interfaces
export type { ImageProps, ProductTemplateProps, ProductTemplateSlots } from './types/product';

// mock
export * from './mocks/pdp';
