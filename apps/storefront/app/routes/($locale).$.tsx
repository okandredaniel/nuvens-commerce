import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function loader({ request }: LoaderFunctionArgs) {
  const path = new URL(request.url).pathname;
  throw new Response(`${path} not found`, { status: 404 });
}

export default function CatchAllPage() {
  return null;
}
