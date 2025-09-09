import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Hero } from '../components/hero';

export async function homeLoader(_: LoaderFunctionArgs) {
  return null;
}

export function HomePage() {
  return (
    <div className="home">
      <Hero />
    </div>
  );
}
