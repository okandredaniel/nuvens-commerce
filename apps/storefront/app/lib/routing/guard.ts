import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

export function guardedLoader<L extends (args: LoaderFunctionArgs) => Promise<any>>(loader: L): L {
  return (async (args: LoaderFunctionArgs) => {
    const mod = await import('../../server/routing/guard');
    return mod.guardedLoader(loader)(args);
  }) as L;
}
