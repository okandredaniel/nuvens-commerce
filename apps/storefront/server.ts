import { storefrontRedirect } from '@shopify/hydrogen';
import { createRequestHandler } from '@shopify/remix-oxygen';
import { createAppLoadContext } from '~/lib/context';

function isDataRequest(req: Request, url: URL) {
  if (url.pathname.endsWith('.data')) return true;
  if (url.searchParams.has('_data')) return true;
  const h = req.headers;
  if (h.get('x-remix-data') === 'yes') return true;
  if ((h.get('Purpose') || '').toLowerCase() === 'prefetch') return true;
  if ((h.get('Sec-Purpose') || '').toLowerCase().includes('prefetch')) return true;
  return false;
}

export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext): Promise<Response> {
    try {
      const appLoadContext = await createAppLoadContext(request, env, executionContext);

      const handleRequest = createRequestHandler({
        build: await import('virtual:react-router/server-build'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => appLoadContext,
      });

      const response = await handleRequest(request);

      if (appLoadContext.session?.isPending) {
        const cookie = await appLoadContext.session.commit();
        if (cookie) response.headers.append('Set-Cookie', cookie);
      }

      const url = new URL(request.url);
      const isData = isDataRequest(request, url);

      if (response.status === 404 && !isData) {
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
        });
      }

      return response;
    } catch {
      return new Response('An unexpected error occurred', { status: 500 });
    }
  },
};
