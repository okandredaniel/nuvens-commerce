import type { ProductTemplateProps } from '@nuvens/core';
import { Button, Container, Heading } from '@nuvens/ui';

type Props = {
  Image: ProductTemplateProps['slots']['Image'];
  layersSrc: string;
  eyebrow: string;
  title: string;
  cta: string;
};

export function PersonalizeSection({ Image, layersSrc, eyebrow, title, cta }: Props) {
  return (
    <section className="bg-primary-600 text-neutral-0 py-12 md:py-16">
      <Container className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-12 lg:gap-32 max-w-6xl">
        <div>
          <Heading
            as="h6"
            tone="onPrimary"
            className="w-full text-xs uppercase tracking-widest opacity-70"
          >
            {eyebrow}
          </Heading>
          <Heading as="h2" tone="onPrimary" className="w-full">
            {title}
          </Heading>
          <Button variant="primary" surface="dark" className="mt-8">
            {cta}
          </Button>
        </div>

        <Image
          className="w-full md:ui-radius-lg"
          src={layersSrc}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </Container>
    </section>
  );
}
