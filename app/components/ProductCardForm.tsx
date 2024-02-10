import clsx from 'clsx';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';

import type {ProductCardFragment, MediaFragment} from 'storefrontapi.generated';
import {Link} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';

export function ProductCardForm({
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
    if (title.length > 35) {
      return title.substring(0, 35) + '...';
    } else {
      return title;
    }
  }

  function truncateDescription(description: string) {
    if (!description) {
      return 'Todas las semanas tenemos nuevos productos con los mejores precios. ¡No te los pierdas!';
    }

    if (description.length > 400) {
      return description.substring(0, 400) + '...';
    } else {
      return description;
    }
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center mx-auto mt-8 sm:mt-20 sm:mb-20">
      <div>
        {image && (
          <div className="h-[300px] md:h-[430px] w-full  relative">
            <span className="inline-flex h-8 animate-background-shine items-center justify-center rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-sm font-medium font-racing text-gray-300 absolute top-1 left-4">
              {cardLabel}
            </span>
            <Image
              className="object-center sm:object-contain h-full w-full "
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
            'gap-4 overflow-hidden flex flex-col justify-between h-full px-2 max-w-lg',
            className,
          )}
        >
          <div className="">
            <h1 className="text-rose-100 font-Righteous font-bold text-4xl sm:text-5xl">
              {truncateTitle(product.title)}
            </h1>

            <div className="text-red-400 font-Righteous font-bold flex gap-3 text-2xl sm:text-3xl py-8">
              <span className="text-xl mt-auto">desde</span>
              <Money withoutTrailingZeros data={price!} />
              {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                <>
                  <CompareAtPrice
                    className={'opacity-50'}
                    data={compareAtPrice as MoneyV2}
                  />
                </>
              )}
            </div>
            <p className="font-semibold font-outfit text-gray-200 text-sm sm:text-md">
              {truncateDescription(product.description)}
            </p>
            {compareAtPrice && (
              <div className="bg-gradient-to-r from-red-400 to-yellow-100 p-1 rounded-2xl inline-block font-racing text-2xl text-gray-800 my-4">
                -
                {getDiscountPercentage(
                  price as MoneyV2,
                  compareAtPrice as MoneyV2,
                )}
                % descuento
              </div>
            )}
          </div>
          <div>
            <Link
              onClick={onClick}
              to={`/products/${product.handle}`}
              prefetch="intent"
            >
              <button className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full border border-neutral-200 text-lg sm:text-xl bg-transparent px-4 text-rose-100 font-racing">
                <span className="relative inline-flex overflow-hidden">
                  <div className="absolute origin-bottom transition duration-500 [transform:translateX(-150%)_skewX(33deg)] group-hover:[transform:translateX(0)_skewX(0deg)]">
                    Ver producto
                  </div>
                  <div className="transition duration-500 [transform:translateX(0%)_skewX(0deg)] group-hover:[transform:translateX(150%)_skewX(33deg)]">
                    Ver producto
                  </div>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
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
