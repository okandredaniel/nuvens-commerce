import { Container } from '@nuvens/ui-core';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function homeLoader(_: LoaderFunctionArgs) {
  return null;
}

export function HomePage() {
  return (
    <div className="home">
      <Container>
        <h1>Zippex</h1>
        <p>Homepage base da marca.</p>
      </Container>
    </div>
  );
}
