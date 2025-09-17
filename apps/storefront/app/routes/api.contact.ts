import type { ActionFunctionArgs, LoaderFunctionArgs } from '@shopify/remix-oxygen';

type Bindings = { PUBLIC_STORE_DOMAIN: string };

const headerContentType = 'content-type';
const headers = { [headerContentType]: 'application/json' };

export async function loader({ request }: LoaderFunctionArgs) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
    status: 405,
    headers,
  });
}

function formDataToUrlEncoded(fd: FormData) {
  const sp = new URLSearchParams();
  for (const [k, v] of fd.entries()) sp.append(k, typeof v === 'string' ? v : '');
  return sp.toString();
}

export async function action({ request, context }: ActionFunctionArgs) {
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
        status: 405,
        headers,
      });
    }

    const { PUBLIC_STORE_DOMAIN } = context.env as unknown as Bindings;
    if (!PUBLIC_STORE_DOMAIN) {
      console.error('Missing binding PUBLIC_STORE_DOMAIN');
      return new Response(JSON.stringify({ ok: false, error: 'missing_binding' }), {
        status: 500,
        headers,
      });
    }

    const fd = await request.formData();

    const honeypot = (fd.get('company') as string) || '';
    const consent = (fd.get('consent') as string) || '';
    if (honeypot || consent !== 'on') {
      return new Response(JSON.stringify({ ok: false, error: 'bad_request' }), {
        status: 400,
        headers,
      });
    }

    const email = fd.get('contact[email]');
    const comment = (fd.get('contact[Comment]') as string) || (fd.get('contact[body]') as string);
    if (!email || !comment) {
      return new Response(JSON.stringify({ ok: false, error: 'missing_required' }), {
        status: 400,
        headers,
      });
    }

    if (!fd.get('form_type')) fd.set('form_type', 'contact');
    if (!fd.get('utf8')) fd.set('utf8', '✓');

    if (!fd.get('contact[body]') && comment) fd.set('contact[body]', comment as string);

    const endpoint = `https://${PUBLIC_STORE_DOMAIN.replace(/^https?:\/\//, '')}/contact`;

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        [headerContentType]: 'application/x-www-form-urlencoded',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'user-agent': request.headers.get('user-agent') || 'Hydrogen',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'accept-language': request.headers.get('accept-language') || 'en',
        accept: request.headers.get('accept') || '*/*',
        origin: `https://${PUBLIC_STORE_DOMAIN.replace(/^https?:\/\//, '')}`,
        referer: `https://${PUBLIC_STORE_DOMAIN.replace(/^https?:\/\//, '')}/contact`,
      },
      body: formDataToUrlEncoded(fd),
      redirect: 'manual',
    });

    const ok = upstream.status >= 200 && upstream.status < 400;
    if (!ok) {
      const text = await upstream.text().catch(() => '');
      console.error('Contact proxy upstream error', {
        status: upstream.status,
        location: upstream.headers.get('location'),
        snippet: text.slice(0, 300),
      });
      return new Response(
        JSON.stringify({ ok: false, error: 'upstream_failed', status: upstream.status }),
        {
          status: 502,
          headers,
        },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error('Contact proxy exception', err);
    return new Response(JSON.stringify({ ok: false, error: 'server_error' }), {
      status: 500,
      headers,
    });
  }
}
