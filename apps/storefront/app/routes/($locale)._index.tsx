import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { HomePage, homeLoader } from '@nuvens/brand-ui';

export async function loader(args: LoaderFunctionArgs) {
  if (typeof homeLoader === 'function') {
    return homeLoader(args);
  }
  return null;
}

export default function Index() {
  return <HomePage />;
}
