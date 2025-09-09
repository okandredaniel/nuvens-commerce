import { HomePage, homeLoader } from '@nuvens/brand-ui';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function loader(args: LoaderFunctionArgs) {
  if (typeof homeLoader === 'function') {
    return homeLoader(args);
  }
  return null;
}

export const handle = { header: 'transparent' as const };

export default function Index() {
  return <HomePage />;
}
