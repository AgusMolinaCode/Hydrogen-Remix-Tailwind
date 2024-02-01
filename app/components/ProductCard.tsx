import clsx from 'clsx';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {ShoppingBagIcon} from '@heroicons/react/16/solid';
import {Tooltip} from '@nextui-org/react';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';

import type {ProductCardFragment, MediaFragment} from 'storefrontapi.generated';
import {Text, Link, AddToCartButton, Button} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';

export function ProductCard({
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
    if (title.length > 25) {
      return title.substring(0, 25) + '...';
    } else {
      return title;
    }
  }

  return (
    <div className="flex flex-col gap-2 relative">
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
      >
        <div className={clsx('grid gap-4 overflow-hidden', className)}>
          <div className="absolute top-2 left-2 text-black bg-rose-200 hover:bg-rose-100 duration-200 rounded-full p-1 z-20">
            <ShoppingBagIcon className="w-6 h-6" />
          </div>
          <div className="">
            {image && (
              <div className="flex justify-center items-center bg-transparent backdrop-blur h-[350px] md:h-[420px] w-full relative rounded-2xl bg-zinc-600 border-r border-l border-gray-500 overflow-hidden">
                <Image
                  className="object-center sm:object-contain fadeIn p-4 rounded-xl h-[300px] md:h-full md:w-full hover:scale-105 duration-300"
                  data={image}
                  alt={image.altText || `Picture of ${product.title}`}
                  loading={loading}
                />
              </div>
            )}
            <div className="flex justify-between gap-4 absolute bottom-0 w-full rounded-bl-xl items-center rounded-br-xl bg-black/20 border-t h-14 backdrop-blur-3xl px-3">
              <Tooltip
                content={product.title}
                className="z-50 bg-black text-white"
                placement="top"
              >
                <Text
                  className="text-rose-100 font-Righteous font-bold"
                  as="h3"
                  size="copy"
                >
                  {truncateTitle(product.title)}
                </Text>
              </Tooltip>
              <Text className="text-rose-100 font-Righteous font-bold">
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
