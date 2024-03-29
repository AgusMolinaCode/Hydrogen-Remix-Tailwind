import {Image} from '@shopify/hydrogen';
import {useState, useEffect} from 'react';

import type {MediaFragment} from 'storefrontapi.generated';

export function ProductGallery({
  media,
  className,
}: {
  media: MediaFragment[];
  className?: string;
}) {
  const [selectedImage, setSelectedImage] = useState(media[0]);
  const [windowWidth, setWindowWidth] = useState(0);

  // Actualizar el ancho de la ventana al montar y al cambiar el tamaño de la ventana
  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setSelectedImage(media[0]);
  }, [media]);

  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div
      className={`${
        media.length > 1 ? 'swimlane' : ''
      } md:grid-flow-row hiddenScroll md:p-0 md:overflow-x-auto md:grid-cols-3 pb-6 sm:pb-0 ${className}`}
    >
      <div className="md:col-span-3 aspect-square snap-center bg-white dark:bg-contrast/10 w-mobileGallery mx-auto md:w-full rounded-xl ">
        {selectedImage.__typename === 'MediaImage' && (
          <Image
            loading="eager"
            data={{
              ...selectedImage.image,
              altText: selectedImage.alt || 'Product image',
            }}
            aspectRatio="1/1"
            className="object-contain object-center w-full h-full aspect-square fadeIn rounded-2xl"
          />
        )}
      </div>
      {media.map((med, i) => {
        if ((i === 0 && windowWidth < 767) || media.length === 1) {
          return null;
        }

        const image =
          med.__typename === 'MediaImage'
            ? {...med.image, altText: med.alt || 'Product image'}
            : {altText: '', url: '', height: 0, width: 0}; // Proporciona un objeto vacío en lugar de null

        return (
          <div
            key={med.id || image?.id}
            role="button"
            tabIndex={0}
            className="md:col-span-1 md:aspect-[1/1] aspect-square snap-center bg-white dark:bg-contrast/10 w-mobileGallery md:w-full rounded-xl "
            onClick={() => {
              if (windowWidth >= 767) {
                setSelectedImage(med);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setSelectedImage(med);
              }
            }}
          >
            <Image
              loading="lazy"
              data={image}
              aspectRatio="1/1"
              className="object-contain object-center w-full h-full aspect-square fadeIn rounded-2xl "
            />
          </div>
        );
      })}
    </div>
  );
}
