import { type ImageProps } from '@nuvens/core';
import { Badge, Card, CardContent, Heading, RatingStars } from '@nuvens/ui';

type Props = {
  name: string;
  text: string;
  rating: number;
  ratingLabel: string;
  Image: ImageProps;
  logoSrc: string;
  verified?: boolean;
  verifiedLabel?: string;
  date?: string;
};

export function ReviewCard({
  name,
  text,
  rating,
  ratingLabel,
  Image,
  logoSrc,
  verified,
  verifiedLabel,
  date,
}: Props) {
  return (
    <Card className="bg-neutral-0 transition-shadow duration-200 hover:shadow-lg">
      <CardContent>
        <div className="flex items-center justify-between">
          <Image
            src={logoSrc}
            alt="Trustpilot"
            width={100}
            height={24}
            className="opacity-80"
            sizes="(min-width:1024px) 560px, (min-width:768px) 50vw, 100vw"
          />
          <div className="flex items-center gap-2" aria-label={ratingLabel}>
            <RatingStars value={rating} />
            <span className="text-neutral-700">{rating}/5</span>
          </div>
        </div>

        <Heading as="h3" className="my-4 text-primary-600">
          {name}
        </Heading>

        {(verified || date) && (
          <div className="mb-2 flex items-center gap-2 text-xs text-neutral-600">
            {verified ? <Badge size="sm">{verifiedLabel}</Badge> : null}
            {date ? <span>{date}</span> : null}
          </div>
        )}

        <p className="text-neutral-700">{text}</p>
      </CardContent>
    </Card>
  );
}
