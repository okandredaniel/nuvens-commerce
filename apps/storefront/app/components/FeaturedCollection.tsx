import { LocalizedLink } from '@/components/LocalizedLink';
import { Image } from '@shopify/hydrogen';
import type { CollectionCardFragment } from 'storefrontapi.generated';

export function FeaturedCollection({ collection }: { collection: CollectionCardFragment }) {
  if (!collection) return null;
  const image = collection.image ?? null;

  return (
    <LocalizedLink
      to={`/collections/${collection.handle}`}
      className="group block rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
      aria-label={collection.title}
    >
      {image ? (
        <div className="relative aspect-[16/9] bg-[color:var(--color-muted)]/10">
          <Image
            data={image}
            alt={image.altText || collection.title}
            sizes="100vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-[color:var(--color-muted)]/10" />
      )}
      <div className="p-4">
        <h2 className="text-lg font-medium text-[color:var(--color-on-surface)] group-hover:underline">
          {collection.title}
        </h2>
      </div>
    </LocalizedLink>
  );
}
