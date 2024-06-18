import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Pagination} from 'swiper/modules';
import {Image} from '@shopify/hydrogen';
import {useState, useEffect} from 'react';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';

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
    <>
      <div
        className={`${
          media.length > 1 ? 'swimlane' : ''
        } hidden md:block md:grid-flow-row hiddenScroll md:p-0 md:overflow-x-auto md:grid-cols-1 pb-6 sm:pb-0 ${className}`}
      >
        <div className="aspect-square snap-center bg-white dark:bg-contrast/10 w-mobileGallery mx-auto md:w-full md:h-[600px] rounded-xl">
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
        <div>
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            slidesPerView={3}
            spaceBetween={5}
            grabCursor={true}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              margin: 'auto',
              padding: '1rem 1rem',
            }}
          >
            {media.map((med, i) => {
              if ((i === 0 && windowWidth < 767) || media.length === 1) {
                return null;
              }

              const image =
                med.__typename === 'MediaImage'
                  ? {...med.image, altText: med.alt || 'Product image'}
                  : {altText: '', url: '', height: 0, width: 0}; // Proporciona un objeto vacío en lugar de null

              return (
                <SwiperSlide key={`slide-${i}`} className="">
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
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
}
