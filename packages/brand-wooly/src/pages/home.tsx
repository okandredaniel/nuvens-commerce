import { type ImageProps } from '@nuvens/core';
import { Container } from '@nuvens/ui';

type HomePageProps = { slots: { Image: ImageProps } };

export function HomePage({ slots }: HomePageProps) {
  return (
    <section className="py-20 bg-cyan-500">
      <Container>Página inicial Wooly</Container>
    </section>
  );
}
