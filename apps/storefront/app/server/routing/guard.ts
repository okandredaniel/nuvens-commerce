import { evaluateRouteAccess } from '@nuvens/core';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { resolvePolicyPath } from '../../lib/routing/paths';
import { getBrandContext } from '../brand';

async function assertRouteAllowed(request: Request) {
  const policyPath = resolvePolicyPath(new URL(request.url).pathname);
  const { policy } = await getBrandContext();
  const allowed = !policy || evaluateRouteAccess(policy, policyPath).allowed !== false;
  if (!allowed) throw new Response('Not Found', { status: 404 });
}

export function guardedLoader<L extends (args: LoaderFunctionArgs) => Promise<any>>(loader: L): L {
  return (async (args: LoaderFunctionArgs) => {
    await assertRouteAllowed(args.request);
    return loader(args);
  }) as L;
}
