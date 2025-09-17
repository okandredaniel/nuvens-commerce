import { createContentSecurityPolicy } from '@shopify/hydrogen';
import { buildCspSources } from './domains';

export function createHydrogenCSP(context: any) {
  const sources = buildCspSources(context.env || {});
  return createContentSecurityPolicy(sources as any);
}
