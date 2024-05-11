import clsx from 'clsx';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {ShoppingBagIcon} from '@heroicons/react/16/solid';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';
import {useMediaQuery} from 'react-responsive';

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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isSmallScreen = useMediaQuery({query: '(max-width: 640px)'}); // Ajusta el valor según tu necesidad
    const maxLength = isSmallScreen ? 50 : 100;

    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
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
          <div className="text-black absolute top-1 z-20 w-full">
            <div className="flex justify-between px-3 py-2">
              <ShoppingBagIcon className="w-8 h-8 bg-rose-100 duration-200 rounded-full p-1" />
              <Text className="text-rose-100 font-Righteous text-sm p-1 rounded-2xl font-bold bg-gray-900 border border-gray-100 sm:flex gap-2">
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
          <div className="">
            {image && (
              <div className="flex justify-center items-center bg-transparent backdrop-blur h-[300px] md:h-[430px] w-full relative rounded-2xl bg-zinc-600 border-r border-l border-gray-500 overflow-hidden">
                <Image
                  className="object-center sm:object-contain fadeIn p-4 rounded-xl md:h-full md:w-full hover:scale-105 duration-300"
                  data={image}
                  alt={image.altText || `Picture of ${product.title}`}
                  loading={loading}
                />
              </div>
            )}
            <div className="flex justify-between gap-4 absolute bottom-0 w-full rounded-bl-xl items-center rounded-br-xl bg-black/60 border-t h-[4rem] backdrop-blur-3xl px-3">
              <Text
                className="text-rose-100 font-Righteous font-thin lg:font-bold text-sm sm:text-[1rem]"
                as="h3"
                size="copy"
              >
                {truncateTitle(product.title)}
              </Text>

              {/* <Text className="text-rose-100 font-Righteous text-sm p-1 rounded-3xl font-bold sm:hidden block">
                <Money withoutTrailingZeros data={price!} />
                {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                  <CompareAtPrice
                    className={'opacity-50'}
                    data={compareAtPrice as MoneyV2}
                  />
                )}
              </Text> */}
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
            Sin stock
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
