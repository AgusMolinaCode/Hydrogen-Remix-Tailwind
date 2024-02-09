import clsx from 'clsx';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {ShoppingBagIcon} from '@heroicons/react/16/solid';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';
import type {MouseEvent} from 'react';
import {useState, useCallback} from 'react';

import type {ProductCardFragment, MediaFragment} from 'storefrontapi.generated';
import {Text, Link, AddToCartButton, Button} from '~/components';
import {isDiscounted, isNewArrival} from '~/lib/utils';

function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}
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
  const [rotate, setRotate] = useState({x: 0, y: 0});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onMouseMove = useCallback(
    throttle((e: MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const centerX = box.width / 2;
      const centerY = box.height / 2;
      const rotateX = (y - centerY) / 4;
      const rotateY = (centerX - x) / 4;

      setRotate({x: rotateX, y: rotateY});
    }, 100),
    [],
  );

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

  const onMouseLeave = () => {
    setRotate({x: 0, y: 0});
  };

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
            <div
              className="card relative max-w-[600px] max-h-[600px] transition-[all_400ms_cubic-bezier(0.03,0.98,0.52,0.99)_0s] will-change-transform"
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${
                  rotate.x / 3
                }deg) rotateY(${rotate.y / 3}deg) scale3d(1, 1, 1)`,
                transition: 'all 600ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s',
              }}
            >
              <div className="group relative flex h-full w-full select-none items-center justify-center rounded-lg border border-gray-900 bg-gradient-to-tr from-gray-950 to-gray-900 text-sm font-light text-gray-300">
                <span className="text-md bg-gradient-to-t from-gray-400 to-white bg-clip-text font-bold text-transparent">
                  {image && (
                    <div className="flex justify-center items-center bg-transparent backdrop-blur h-[300px] md:h-[430px] w-full relative rounded-2xl bg-zinc-600 border-r border-l border-gray-500 overflow-hidden">
                      <Image
                        className="object-center sm:object-contain fadeIn p-4 rounded-xl md:h-full md:w-full"
                        data={image}
                        alt={image.altText || `Picture of ${product.title}`}
                        loading={loading}
                      />
                    </div>
                  )}
                </span>
              </div>
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
