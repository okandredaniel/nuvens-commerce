import { storefrontRedirect } from '@shopify/hydrogen';
import { createRequestHandler } from '@shopify/remix-oxygen';
import { createAppLoadContext } from '~/lib/context';

function ensureDirective(csp: string, directive: string, values: string[]) {
  const re = new RegExp(`(?:^|;)\\s*${directive}\\s+([^;]+)`, 'i');
  if (re.test(csp)) {
    return csp.replace(re, (_, current: string) => {
      const set = new Set(current.trim().split(/\s+/).concat(values));
      return `${directive} ${Array.from(set).join(' ')}`;
    });
  }
  return (csp ? `${csp}; ` : '') + `${directive} ${values.join(' ')}`;
}

function withYouTubeCSPHeaders(response: Response) {
  let csp = response.headers.get('Content-Security-Policy') ?? '';
  csp = ensureDirective(csp, 'frame-src', [
    `'self'`,
    'https://www.youtube.com',
    'https://www.youtube-nocookie.com',
  ]);
  csp = ensureDirective(csp, 'img-src', [
    `'self'`,
    'data:',
    'https://i.ytimg.com',
    'https://*.ytimg.com',
  ]);
  csp = ensureDirective(csp, 'media-src', [`'self'`, 'https://*.googlevideo.com']);
  csp = ensureDirective(csp, 'connect-src', [
    `'self'`,
    'https://www.youtube.com',
    'https://*.googlevideo.com',
  ]);
  response.headers.set('Content-Security-Policy', csp);
  if (!response.headers.has('Referrer-Policy')) {
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  if (!response.headers.has('Permissions-Policy')) {
    response.headers.set(
      'Permissions-Policy',
      'autoplay=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
    );
  }
  return response;
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

      let response = await handleRequest(request);

      if (appLoadContext.session?.isPending) {
        const cookie = await appLoadContext.session.commit();
        if (cookie) response.headers.append('Set-Cookie', cookie);
      }

      if (response.status === 404) {
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
        });
      }

      response = withYouTubeCSPHeaders(response);

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', { status: 500 });
    }
  },
};
