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
    <section className="py-16 bg-[color:var(--color-brand-primary)] text-[color:var(--palette-neutral-0)]">
      <Container className="grid grid-cols-2 gap-32 items-center max-w-6xl">
        <div>
          <Heading
            as="h6"
            className="text-inherit w-full opacity-70 uppercase text-xs tracking-widest"
          >
            {eyebrow}
          </Heading>
          <Heading className="text-inherit w-full">{title}</Heading>
          <Button variant="white" className="mt-8">
            {cta}
          </Button>
        </div>
        <Image className="w-full" src={layersSrc} alt="" />
      </Container>
    </section>
  );
}
