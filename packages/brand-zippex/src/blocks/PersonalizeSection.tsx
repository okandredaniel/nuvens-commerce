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
    <section className="bg-primary-600 py-16 text-neutral-0">
      <Container className="grid grid-cols-2 items-center gap-32 max-w-6xl">
        <div>
          <Heading
            as="h6"
            tone="onPrimary"
            className="w-full text-xs uppercase tracking-widest opacity-70"
          >
            {eyebrow}
          </Heading>
          <Heading tone="onPrimary" className="w-full">
            {title}
          </Heading>
          <Button variant="white" className="mt-8">
            {cta}
          </Button>
        </div>
        <Image className="w-full md:rounded-xl" src={layersSrc} alt="" />
      </Container>
    </section>
  );
}
