import {Image} from '@shopify/hydrogen';

import type {MediaFragment} from 'storefrontapi.generated';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({
  media,
  className,
}: {
  media: MediaFragment[];
  className?: string;
}) {
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`swimlane md:grid-flow-row hiddenScroll md:p-0 md:overflow-x-auto md:grid-cols-3 ${className}`}
    >
      {media.map((med, i) => {
        const isFirst = i === 0;

        const image =
          med.__typename === 'MediaImage'
            ? {...med.image, altText: med.alt || 'Product image'}
            : null;

        const style = [
          isFirst ? 'md:col-span-3' : 'md:col-span-1',
          isFirst ? 'md:aspect-[1/1]' : 'md:aspect-[1/1]',
          'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
        ].join(' ');

        return (
          <div key={med.id || image?.id} className={style}>
            {image && (
              <Image
                loading={i === 0 ? 'eager' : 'lazy'}
                data={image}
                aspectRatio="1/1"
                className="object-center w-full h-full fadeIn"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
