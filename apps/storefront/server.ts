import { createAppLoadContext } from '@/lib/context';
import { resolvePolicyPath } from '@/lib/routing/paths';
import { evaluateRouteAccess } from '@nuvens/core';
import { storefrontRedirect } from '@shopify/hydrogen';
import { createRequestHandler, type ServerBuild } from '@shopify/remix-oxygen';
import { getBrandContext } from './app/server/brand';

function isDataRequest(req: Request, url: URL) {
  if (url.pathname.endsWith('.data')) return true;
  if (url.searchParams.has('_data')) return true;
  const h = req.headers;
  if ((h.get('x-remix-data') || '').toLowerCase() === 'yes') return true;
  if ((h.get('Purpose') || '').toLowerCase() === 'prefetch') return true;
  if ((h.get('Sec-Purpose') || '').toLowerCase().includes('prefetch')) return true;
  return false;
}

function errorResponse(stage: string, err: unknown) {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) return new Response('An unexpected error occurred', { status: 500 });
  const e = err as any;
  const body = { stage, name: e?.name, message: e?.message, stack: e?.stack };
  return new Response(JSON.stringify(body, null, 2), {
    status: 500,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { 'Content-Type': 'application/json' },
  });
}

function normalizeRemixRequestForHomeDefault(request: Request): Request {
  const url = new URL(request.url);
  const isData = url.pathname.endsWith('.data') || url.searchParams.has('_data');
  if (!isData) return request;
  if (url.pathname === '/.data') {
    url.pathname = '/_root.data';
    url.searchParams.delete('_data');
    return new Request(url.toString(), request);
  }
  return request;
}

export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext): Promise<Response> {
    let appLoadContext: Awaited<ReturnType<typeof createAppLoadContext>>;
    try {
      appLoadContext = await createAppLoadContext(request, env, executionContext);
    } catch (err) {
      return errorResponse('context', err);
    }

    const url = new URL(request.url);
    const isData = isDataRequest(request, url);

    if (isData) {
      try {
        const { policy } = await getBrandContext({ BRAND_ID: env.BRAND_ID });
        if (policy) {
          const policyPath = resolvePolicyPath(url.pathname);
          const allowed = evaluateRouteAccess(policy, policyPath).allowed !== false;
          if (!allowed) return new Response('Not Found', { status: 404 });
        }
      } catch (err) {
        return errorResponse('policy', err);
      }
    }

    let build: ServerBuild;
    try {
      build = (await import('virtual:react-router/server-build')) as unknown as ServerBuild;
    } catch (err) {
      return errorResponse('build', err);
    }

    try {
      const handleRequest = createRequestHandler({
        build,
        mode: process.env.NODE_ENV,
        getLoadContext: () => appLoadContext,
      });

      const requestForRemix = normalizeRemixRequestForHomeDefault(request);
      const response = await handleRequest(requestForRemix);

      if (appLoadContext.session?.isPending) {
        const cookie = await appLoadContext.session.commit();
        if (cookie) response.headers.append('Set-Cookie', cookie);
      }

      if (response.status === 404 && !isData) {
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
        });
      }

      return response;
    } catch (err) {
      return errorResponse('handle', err);
    }
  },
};
