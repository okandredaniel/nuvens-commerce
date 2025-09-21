import { resolvePolicyPath } from '@/lib/routing/paths';
import { createAppLoadContext } from '@/server/context';
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
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify(body, null, 2), { status: 500, headers });
}

function cloneRequestWithUrl(request: Request, url: string) {
  const init: RequestInit = { method: request.method, headers: request.headers };
  if (request.method !== 'GET' && request.method !== 'HEAD') init.body = request.body as any;
  return new Request(url, init);
}

function normalizeRemixRequestForHomeDefault(request: Request): Request {
  const url = new URL(request.url);
  const isData = url.pathname.endsWith('.data') || url.searchParams.has('_data');
  if (!isData) return request;
  if (url.pathname === '/.data') {
    url.pathname = '/_root.data';
    url.searchParams.delete('_data');
    return cloneRequestWithUrl(request, url.toString());
  }
  return request;
}

export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext): Promise<Response> {
    let appLoadContext: Awaited<ReturnType<typeof createAppLoadContext>>;
    try {
      appLoadContext = await createAppLoadContext(request, env as any, executionContext);
    } catch (err) {
      return errorResponse('context', err);
    }

    const url = new URL(request.url);
    const isData = isDataRequest(request, url);

    if (isData) {
      try {
        const { policy } = await getBrandContext({ BRAND_ID: (env as any).BRAND_ID });
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
      const mod = await import('virtual:react-router/server-build');
      build = ((mod as any).default ?? mod) as ServerBuild;
    } catch {
      build = {} as any;
    }

    let handleRequest: (req: Request) => Promise<Response>;
    try {
      handleRequest = createRequestHandler({
        build,
        mode: process.env.NODE_ENV,
        getLoadContext: () => appLoadContext,
      });
    } catch (err) {
      return errorResponse('handle', err);
    }

    try {
      const requestForRemix = normalizeRemixRequestForHomeDefault(request);
      const response = await handleRequest(requestForRemix);

      if ((appLoadContext as any).session?.isPending) {
        const cookie = await (appLoadContext as any).session.commit();
        if (cookie) response.headers.append('Set-Cookie', cookie);
      }

      if (response.status === 404 && !isData) {
        return storefrontRedirect({
          request,
          response,
          storefront: (appLoadContext as any).storefront,
        });
      }

      return response;
    } catch (err) {
      return errorResponse('handle', err);
    }
  },
};
