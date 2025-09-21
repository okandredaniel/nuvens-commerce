import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

export function guardedLoader(loader: (args: LoaderFunctionArgs) => Promise<any>) {
  return async (args: LoaderFunctionArgs) => {
    const mod = await import('../../server/routing/guard');
    return mod.guardedLoader(loader)(args);
  };
}
