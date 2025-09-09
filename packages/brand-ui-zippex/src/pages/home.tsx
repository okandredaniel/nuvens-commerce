import { Button, Container, Heading } from '@nuvens/ui-core';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Hero } from '../components/hero';
import { VideoPreviewWithModal } from '../components';

export async function homeLoader(_: LoaderFunctionArgs) {
  return null;
}

export function HomePage() {
  return (
    <div className="home">
      <Hero />

      <section className="py-12">
        <Container className="max-w-2xl text-center">
          <Heading as="h2" className="text-[color:var(--palette-neutral-500)]" align="center">
            Un seul matelas. Plusieurs possibilités.
          </Heading>
          <p className="text-xl mt-8 mb-12">
            Oui c’est du sérieux. Zippex s’adapte à chacun grâce à ses couches modulables que vous
            pouvez repositionner selon vos envies.
          </p>
          <Button asChild>
            <a href="/collections/all">Je veux mon matelas</a>
          </Button>
        </Container>
      </section>

      <section className="px-24">
        <VideoPreviewWithModal previewSrc="/zippex-cambio-de-nucleos.mov" youtubeId="m_lfbLhKIMI" />
      </section>

      <section className="py-12">
        <Container className="max-w-2xl text-center">
          <Heading as="h2" className="text-[color:var(--palette-neutral-500)]" align="center">
            Le confort, réinventé.
          </Heading>
        </Container>
      </section>
    </div>
  );
}
