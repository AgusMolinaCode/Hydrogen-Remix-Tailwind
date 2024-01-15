import React, {useRef, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Scrollbar} from 'swiper/modules';

import 'swiper/css/scrollbar';

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
    <Section padding="card" display="flex" className="pt-8 px-1">
      <Swiper
        modules={[Scrollbar]}
        slidesPerView={1}
        spaceBetween={3}
        grabCursor={true}
        style={{height: '600px'}}
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
            slidesPerView: 5,
            spaceBetween: 7,
          },
        }}
      >
        <div className="flex">
          {products.nodes.map((product) => (
            <SwiperSlide key={`slide-${product.id}`} className="">
              <ProductCard product={product} key={product.id} />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </Section>
  );
}
