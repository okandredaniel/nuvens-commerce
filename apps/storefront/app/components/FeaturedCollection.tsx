import { Image } from '@shopify/hydrogen';
import { Link } from 'react-router';
import type { FeaturedCollectionFragment } from 'storefrontapi.generated';

export function FeaturedCollection({ collection }: { collection: FeaturedCollectionFragment }) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link className="featured-collection" to={`/collections/${collection.handle}`}>
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}
