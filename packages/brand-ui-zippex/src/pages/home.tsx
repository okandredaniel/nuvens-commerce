import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function homeLoader(_: LoaderFunctionArgs) {
  return null;
}

export function HomePage() {
  return (
    <div className="home">
      <section className="px-6 py-16 md:px-10 lg:px-16">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Zippex</h1>
        <p className="mt-3 max-w-xl text-base md:text-lg opacity-80">Homepage base da marca.</p>
      </section>
    </div>
  );
}
