import clsx from 'clsx';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';
import {motion} from 'framer-motion';

import type {ProductCardFragment, MediaFragment} from 'storefrontapi.generated';
import {Link} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';

import {
  slideIn,
  staggerContainer,
  textVariant,
  fadeIn,
  divVariants,
  zoomIn,
  fade,
} from '../utils/motion';

export function ProductCardGrid({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}: {
  product: ProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
  quickAdd?: boolean;
}) {
  let cardLabel;

  const cardProduct: Product = product?.variants
    ? (product as Product)
    : ({} as Product);
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = 'Oferta';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'Nuevo';
  }

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  function truncateTitle(title: string) {
    if (title.length > 80) {
      return title.substring(0, 80) + '...';
    } else {
      return title;
    }
  }

  return (
    <Link
      onClick={onClick}
      to={`/products/${product.handle}`}
      prefetch="intent"
    >
      <div>
        <div className="flex flex-col gap-3 justify-center mx-auto">
          <div>
            {image && (
              <div className="h-[320px] w-[320px] relative mx-auto">
                {cardLabel && (
                  <span className="inline-flex h-8 animate-background-shine items-center justify-center rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-sm font-medium font-racing text-gray-300 absolute top-1 left-4">
                    {cardLabel}
                  </span>
                )}

                <Image
                  className="object-center  h-[320px] w-[320px] "
                  data={image}
                  alt={image.altText || `Picture of ${product.title}`}
                  loading={loading}
                />
              </div>
            )}
          </div>
          <div>
            <div
              className={clsx(
                'gap-4 overflow-hidden flex flex-col text-center justify-between h-full px-2 max-w-lg',
                className,
              )}
            >
              <div className="text-center">
                <h1 className="text-rose-100 font-Righteous font-medium sm:font-semibold text-lg sm:text-xl text-center">
                  {truncateTitle(product.title)}
                </h1>

                <div className="text-red-400 font-outfit font-bold flex justify-center items-center gap-1 text-lg sm:text-2xl md:py-8 text-center">
                  <span className="text-xl pb-[0.12rem]">desde</span>
                  <Money withoutTrailingZeros data={price!} />
                  {isDiscounted(
                    price as MoneyV2,
                    compareAtPrice as MoneyV2,
                  ) && (
                    <>
                      <CompareAtPrice
                        className={'opacity-50'}
                        data={compareAtPrice as MoneyV2}
                      />
                    </>
                  )}
                </div>
                {/* <p className="font-semibold font-outfit text-gray-200 text-sm sm:text-md">
                {truncateDescription(product.description)}
              </p> */}
                {compareAtPrice && (
                  <div className="bg-gradient-to-r from-red-400 to-yellow-100 p-1 rounded-2xl inline-block font-racing text-xl text-gray-800 my-4">
                    -
                    {getDiscountPercentage(
                      price as MoneyV2,
                      compareAtPrice as MoneyV2,
                    )}
                    % descuento
                  </div>
                )}
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getDiscountPercentage(price: MoneyV2, compareAtPrice: MoneyV2) {
  const discount = Number(compareAtPrice.amount) - Number(price.amount);
  const percentage = (Number(discount) / Number(compareAtPrice.amount)) * 100;
  return Math.round(percentage);
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
