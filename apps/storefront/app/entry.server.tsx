import type { AppLoadContext } from '@shopify/remix-oxygen';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';
import { registerUiCoreAdapter } from './core.adapter';
import { createHydrogenCSP } from './csp/policy';
import { applySecurityHeaders } from './server/http/headers';

registerUiCoreAdapter();

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: AppLoadContext,
) {
  const { nonce, header, NonceProvider } = createHydrogenCSP(context);

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter context={reactRouterContext} url={request.url} nonce={nonce} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError() {
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent') || '')) {
    await body.allReady;
  }

  applySecurityHeaders(responseHeaders, header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
