import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Pagination} from 'swiper/modules';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';

import type {HomepageFeaturedProductsQuery} from 'storefrontapi.generated';
import {ProductCard, Section} from '~/components';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

type ProductSwimlaneProps = HomepageFeaturedProductsQuery & {
  count?: number;
};

export function ProductSwimlane({
  products = mockProducts,
  count = 12,
  ...props
}: ProductSwimlaneProps) {
  return (
    <Section padding="card" display="flex" className="pt-4 sm:pt-14 px-1">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
        pagination={{
          clickable: true,
        }}
        slidesPerView={2}
        spaceBetween={3}
        grabCursor={true}
        style={{
          width: '100%',
        }}
        breakpoints={{
          550: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1300: {
            slidesPerView: 4,
            spaceBetween: 7,
          },
        }}
      >
        <div className="flex">
          {products.nodes.map((product: any) => (
            <SwiperSlide key={`slide-${product.id}`} className="">
              <ProductCard product={product} key={product.id} />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </Section>
  );
}
