import { CART_QUERY_FRAGMENT } from '@/lib/fragments';
import { AppSession } from '@/lib/session';
import { createHydrogenContext, type I18nBase } from '@shopify/hydrogen';

export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const { getLocaleFromRequest } = await import('./storefront.server');

  return createHydrogenContext<AppSession, {}, I18nBase, Env>({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: getLocaleFromRequest(request),
    cart: { queryFragment: CART_QUERY_FRAGMENT },
  });
}
