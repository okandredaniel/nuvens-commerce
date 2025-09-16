import { VideoPreviewWithModal } from '@nuvens/ui';
import { Carousel, CarouselSlide, Container, Heading } from '@nuvens/ui';

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
          slidesPerView={{ 0: 1.5, 768: 6 }}
          nav={false}
          bleedLeft={{ 0: 16, 768: 0 }}
          edgeLeft={{ 0: 16, 768: 0 }}
          bleedRight={{ 0: 16, 768: 0 }}
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
