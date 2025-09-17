import { Carousel, CarouselSlide, Container, Heading, VideoPreviewWithModal } from '@nuvens/ui';

type Props = {
  heading: string;
  youtubeIds: string[];
};

export function TrustedByCarousel({ heading, youtubeIds }: Props) {
  return (
    <section className="py-16 bg-[#A6ABBD]/20">
      <Container>
        <Heading className="mb-8">{heading}</Heading>
        <Carousel
          aria-label=""
          className="w-full mx-auto"
          nav={false}
          // eslint-disable-next-line @typescript-eslint/naming-convention
          slidesPerView={{ 0: 1.5, 768: 6 }}
          // eslint-disable-next-line @typescript-eslint/naming-convention
          bleedLeft={{ 0: 16, 768: 0 }}
          // eslint-disable-next-line @typescript-eslint/naming-convention
          edgeLeft={{ 0: 16, 768: 0 }}
          // eslint-disable-next-line @typescript-eslint/naming-convention
          bleedRight={{ 0: 16, 768: 0 }}
          // eslint-disable-next-line @typescript-eslint/naming-convention
          edgeRight={{ 0: 0, 768: 0 }}
        >
          {youtubeIds.map((id, i) => (
            <CarouselSlide key={i} className="h-full overflow-hidden rounded-2xl">
              <VideoPreviewWithModal youtubeId={id} vertical />
            </CarouselSlide>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
