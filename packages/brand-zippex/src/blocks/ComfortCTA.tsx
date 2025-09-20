import type { ImageProps } from '@nuvens/core';
import { Button, Container, Heading } from '@nuvens/ui';

type Props = {
  Image: ImageProps;
  imageAlt: string;
  imageSrc: string;
  title: string;
  text: string;
  cta: string;
};

export function ComfortCTA({ Image, imageAlt, imageSrc, title, text, cta }: Props) {
  return (
    <section className="py-16">
      <Container>
        <div className="ui-radius-lg grid grid-cols-1 overflow-hidden bg-slate-200 md:grid-cols-2 md:items-center md:gap-8">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1500}
            height={1000}
            sizes="(min-width:1024px) 560px, (min-width:768px) 50vw, 100vw"
            className="h-56 w-full object-cover sm:h-72 md:h-full"
          />
          <div className="p-6 md:p-8">
            <Heading id="product-title">{title}</Heading>
            <p className="my-4">{text}</p>
            <Button>{cta}</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
