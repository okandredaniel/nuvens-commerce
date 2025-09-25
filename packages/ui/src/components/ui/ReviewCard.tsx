import { type ImageProps } from '@nuvens/core';
import { Badge, Card, CardContent, Heading, RatingStars } from '@nuvens/ui';
import { Verified } from 'lucide-react';

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
          {(verified || date) && (
            <div className="mb-2 flex items-center gap-2 text-xs text-neutral-600">
              {verified ? (
                <Badge size="sm" className="gap-2 pr-1">
                  {verifiedLabel} <Verified className="text-white fill-emerald-500 w-5 h-5" />
                </Badge>
              ) : null}
              {date ? <span>{date}</span> : null}
            </div>
          )}

          <Image
            src={logoSrc}
            alt="Trustpilot"
            width={100}
            height={24}
            className="opacity-80"
            sizes="(min-width:1024px) 560px, (min-width:768px) 50vw, 100vw"
          />
        </div>

        <div className="flex space-between items-center pt-4 pb-2">
          <Heading as="h3" className="text-primary-600 w-auto mr-auto">
            {name}
          </Heading>

          <div className="flex items-center gap-2" aria-label={ratingLabel}>
            <RatingStars value={rating} />
            <span className="text-neutral-700 text-xs">{rating}/5</span>
          </div>
        </div>

        <p className="text-neutral-700">{text}</p>
      </CardContent>
    </Card>
  );
}
