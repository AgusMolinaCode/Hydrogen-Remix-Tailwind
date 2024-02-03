import clsx from 'clsx';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';

import type {ProductCardFragment} from 'storefrontapi.generated';
import {Text, Link, AddToCartButton, Button} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';

export function ProductCardTwo({
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
  // console.log(product);
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
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
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
    if (title.length > 25) {
      return title.substring(0, 25) + '...';
    } else {
      return title;
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
      >
        <div className={clsx('grid gap-4 relative overflow-hidden', className)}>
          <div className="">
            {image && (
              <div className="flex justify-center items-center bg-transparent backdrop-blur h-[400px] w-full relative rounded-2xl bg-gradient-to-bl from-gray-900 via-gray-500 to-gray-900 border-r border-l border-gray-500 overflow-hidden">
                <Image
                  className="object-contain fadeIn p-2 rounded-xl md:h-full md:w-full hover:scale-105 duration-300"
                  data={image}
                  alt={image.altText || `Picture of ${product.title}`}
                  loading={loading}
                />
              </div>
            )}
            <div className="w-full px-2 rounded-bl-xl flex flex-col items-center justify-center rounded-br-xl bg-orange-200/60 absolute bottom-0 backdrop-blur-3xl border-t h-[80px]">
              {/* <Text
                className="text-rose-300 font-Righteous font-semibold"
                as="h3"
                size="copy"
              >
                {product.vendor}
              </Text> */}
              <Text
                className="text-gray-800 font-Righteous font-bold text-center text-xl"
                as="h3"
                size="Thirdxl"
              >
                {truncateTitle(product.title)}
              </Text>
              <Text className="text-gray-900 font-Righteous font-bold py-2 flex gap-2">
                <Money withoutTrailingZeros data={price!} />
                {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                  <CompareAtPrice
                    className={'opacity-50'}
                    data={compareAtPrice as MoneyV2}
                  />
                )}
              </Text>
            </div>
          </div>
        </div>
      </Link>
      {quickAdd && firstVariant.availableForSale && (
        <AddToCartButton
          lines={[
            {
              quantity: 1,
              merchandiseId: firstVariant.id,
            },
          ]}
          variant="secondary"
          className="mt-2"
          analytics={{
            products: [productAnalytics],
            totalValue: parseFloat(productAnalytics.price),
          }}
        >
          <Text as="span" className="flex items-center justify-center gap-2">
            Agregar al carrito
          </Text>
        </AddToCartButton>
      )}
      {quickAdd && !firstVariant.availableForSale && (
        <Button variant="secondary" className="mt-2" disabled>
          <Text as="span" className="flex items-center justify-center gap-2">
            Sold out
          </Text>
        </Button>
      )}
    </div>
  );
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
