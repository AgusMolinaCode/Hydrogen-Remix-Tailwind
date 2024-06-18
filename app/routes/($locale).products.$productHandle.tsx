import {useRef, Suspense} from 'react';
import {Disclosure, Listbox} from '@headlessui/react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Await} from '@remix-run/react';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
//import '../styles/app.css';
import {
  AnalyticsPageType,
  Money,
  ShopPayButton,
  VariantSelector,
  getSelectedProductOptions,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';
import {ChevronDoubleDownIcon} from '@heroicons/react/16/solid';

import type {
  ProductQuery,
  ProductVariantFragmentFragment,
} from 'storefrontapi.generated';
import {
  Heading,
  IconCaret,
  IconCheck,
  IconClose,
  ProductGallery,
  ProductSwimlane,
  Section,
  Skeleton,
  Text,
  Link,
  AddToCartButton,
  Button,
} from '~/components';
import {BuyNowButton} from '~/components/BuyNowButton';
import {getExcerpt} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

export const headers = routeHeaders;

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  if (!product.selectedVariant) {
    throw redirectToFirstVariant({product, request});
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.
  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const recommended = getRecommendedProducts(context.storefront, product.id);

  // TODO: firstVariant is never used because we will always have a selectedVariant due to redirect
  // Investigate if we can avoid the redirect for product pages with no search params for first variant
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return defer({
    variants,
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
    seo,
  });
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductQuery['product'];
  request: Request;
}) {
  const searchParams = new URLSearchParams(new URL(request.url).search);
  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  return redirect(
    `/products/${product!.handle}?${searchParams.toString()}`,
    302,
  );
}
export default function Product() {
  const {product, shop, recommended, variants} = useLoaderData<typeof loader>();
  const {media, title, vendor, descriptionHtml, selectedVariant} = product;
  const {shippingPolicy, refundPolicy} = shop;
  const isOutOfStock = !selectedVariant?.availableForSale;
  console.log(product);

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const compareAtPriceAmount =
    Number(selectedVariant?.compareAtPrice?.amount) || 0;
  const priceAmount = Number(selectedVariant?.price?.amount) || 0;

  const discountPercentage: number =
    compareAtPriceAmount && priceAmount
      ? (((((compareAtPriceAmount as number) - priceAmount) as number) /
          compareAtPriceAmount) as number) * 100
      : 0;

  return (
    <>
      <div className="px-2 md:px-4 mt-12 mb-12 md:mb-32">
        <div className="grid items-start md:gap-3 lg:gap-4 md:grid-cols-2 lg:grid-cols-2">
          <ProductGallery
            media={media.nodes}
            className="w-full xl:w-[80%] mx-auto sm:ml-auto object-contain"
          />
          <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:pt-nav hiddenScroll md:overflow-y-scroll ">
            <div className="flex gap-2 items-center">
              {vendor && (
                <Link
                  to={`/collections/todos-los-productos?filter.productVendor="${vendor}"`}
                  className="font-outfit text-gray-300 text-lg"
                >
                  <span className="align-self:flex-start h-8 animate-background-shine items-center justify-center rounded-full border border-gray-800 bg-[linear-gradient(110deg,#000,45%,#4D4B4B,55%,#000)] bg-[length:250%_100%] px-3 py-1 text-sm font-medium font-racing text-gray-300">
                    {vendor}
                  </span>
                </Link>
              )}
              {isOnSale && (
                <div
                  className="relative w-20 h-20 p-1 m-1 mr-auto flex items-center justify-center"
                  style={{
                    backgroundImage: 'url(/etiqueta.webp)',
                    backgroundSize: 'cover',
                  }}
                >
                  <span className="text-xl text-white font-semibold font-outfit">{`-${Math.round(
                    discountPercentage,
                  )}%`}</span>
                </div>
              )}
            </div>
            <section className="flex flex-col w-full max-w-xl gap-4 mx-auto md:mx-0 md:mr-auto md:max-w-xl md:px-0 pt-2">
              <div className="grid gap-2">
                <Heading
                  as="h1"
                  className="whitespace-normal text-rose-100 font-Righteous text-2xl sm:text-3xl border-b border-gray-400/40 pb-4 flex gap-2 items-center justify-between flex-wrap"
                >
                  {title}
                </Heading>
                <div className="max-w-lg flex flex-col gap-4">
                  <div className="flex gap-4 font-semibold font-outfit text-2xl sm:text-3xl text-orange-400">
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant?.price!}
                      as="span"
                    />
                    {isOnSale && (
                      <Money
                        withoutTrailingZeros
                        data={selectedVariant?.compareAtPrice!}
                        as="span"
                        className="opacity-50 strike text-xl sm:text-3xl"
                      />
                    )}
                  </div>
                  <div>
                    {selectedVariant?.sku && (
                      <p className="font-outfit text-xl text-white font-semibold">
                        <span className="font-semibold font-outfit text-gray-300 text-lg">
                          Codigo:
                        </span>{' '}
                        {selectedVariant.sku}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <Suspense fallback={<ProductForm variants={[]} />}>
                <Await
                  errorElement="Hubo un problema cargando variantes de producto"
                  resolve={variants}
                >
                  {(resp) => (
                    <ProductForm
                      variants={resp.product?.variants.nodes || []}
                    />
                  )}
                </Await>
              </Suspense>
              <div className="grid gap-4 py-4">
                {descriptionHtml && (
                  <ProductDetail
                    title="Detalles del producto"
                    content={descriptionHtml}
                  />
                )}
                {shippingPolicy?.body && (
                  <ProductDetail
                    title="Informacion de envio"
                    content={getExcerpt(shippingPolicy.body)}
                    learnMore={`/policies/${shippingPolicy.handle}`}
                  />
                )}
                {refundPolicy?.body && (
                  <ProductDetail
                    title="Returns"
                    content={getExcerpt(refundPolicy.body)}
                    learnMore={`/policies/${refundPolicy.handle}`}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      <Suspense fallback={<Skeleton className="h-32" />}>
        <h1 className="text-center text-3xl sm:text-4xl font-bold font-racing text-rose-100">
          Productos relacionados
        </h1>
        <Await
          errorElement="Hubo un problema cargando productos relacionados"
          resolve={recommended}
        >
          {(products) => <ProductSwimlane products={products} />}
        </Await>
      </Suspense>
    </>
  );
}

export function ProductForm({
  variants,
}: {
  variants: ProductVariantFragmentFragment[];
}) {
  const {product, analytics, storeDomain} = useLoaderData<typeof loader>();

  const closeRef = useRef<HTMLButtonElement>(null);

  const selectedVariant = product.selectedVariant!;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const currentDate = new Date();
  const twelveDaysLater = new Date();
  twelveDaysLater.setDate(currentDate.getDate() + 19);
  const twentyDaysLater = new Date();
  twentyDaysLater.setDate(currentDate.getDate() + 27);

  const formatDate = (date: Date) => {
    return `${date.getDate()} de ${date.toLocaleString('es-ES', {
      month: 'long',
    })}`;
  };

  const productAnalytics: ShopifyAnalyticsProduct = {
    ...analytics.products[0],
    quantity: 1,
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4">
        <VariantSelector
          handle={product.handle}
          options={product.options}
          variants={variants}
        >
          {({option}) => {
            return (
              <div
                key={option.name}
                className="grid  items-center mb-4 gap-y-2 last:mb-0"
              >
                <Heading
                  as="legend"
                  size="lead"
                  className="h-full font-semibold font-outfit text-gray-300 text-xl"
                >
                  {option.name}:
                </Heading>
                <div className="flex flex-wrap gap-4">
                  {option.values.length > 1 && (
                    <div className="relative w-full">
                      <Listbox>
                        {({open}) => (
                          <>
                            <Listbox.Button
                              ref={closeRef}
                              className={clsx(
                                'flex items-center rounded-2xl justify-between w-full py-1 px-2 border border-white font-outfit font-bold text-white',
                                open
                                  ? 'md:rounded-t-2xl md:rounded-b-none md:border-b-0'
                                  : 'rounded',
                              )}
                            >
                              <span>{option.value}</span>
                              <IconCaret
                                direction={open ? 'up' : 'down'}
                                className="text-white"
                              />
                            </Listbox.Button>
                            <Listbox.Options
                              className={clsx(
                                'border-white bg-black/85 backdrop-blur-lg absolute bottom-12 z-30 grid h-12rem w-full rounded-2xl border px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto font-outfit font-bold overflow-auto',
                                open
                                  ? 'max-h-[22rem] md:rounded-t-none md:border-t-0'
                                  : 'max-h-0',
                              )}
                            >
                              {option.values
                                .filter((value) => value.isAvailable)
                                .map(({value, to, isActive}) => (
                                  <Listbox.Option
                                    key={`option-${option.name}-${value}`}
                                    value={value}
                                  >
                                    {({active}) => (
                                      <Link
                                        to={to}
                                        className={clsx(
                                          'text-white w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer font-outfit font-bold',
                                          active && 'bg-primary/10',
                                        )}
                                        onClick={() => {
                                          if (!closeRef?.current) return;
                                          closeRef.current.click();
                                        }}
                                      >
                                        {value}
                                        {isActive && (
                                          <span className="ml-2">
                                            <IconCheck />
                                          </span>
                                        )}
                                      </Link>
                                    )}
                                  </Listbox.Option>
                                ))}
                            </Listbox.Options>
                          </>
                        )}
                      </Listbox>
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        </VariantSelector>
        {selectedVariant && (
          <div className="grid items-stretch gap-4">
            <div className="rounded-xl flex gap-3 items-center justify-center">
              <p className="font-outfit font-semibold text-gray-100 text-left text-[0.8rem] sm:text-[1rem]">
                Si no encuentra el producto que busca, puede contactarnos a
                través de nuestro whatsapp.
              </p>
            </div>
            <div className="bg-[#59ff00] rounded-xl flex gap-3 items-center justify-center">
              <img
                src="/delivery.png"
                alt=""
                className="w-[35px] sm:w-[45px] h-[35px] sm:h-[45px]"
              />
              <p className="font-outfit font-semibold text-black text-center text-[0.8rem] sm:text-[1rem]">
                Llega entre el {formatDate(twelveDaysLater)} y{' '}
                {formatDate(twentyDaysLater)}.
              </p>
            </div>
            <div className="flex justify-center w-full">
              <div className="w-full rounded-l-2xl clip-path">
                {isOutOfStock ? (
                  <Button variant="secondary" disabled>
                    <Text className="font-outfit">Sin stock</Text>
                  </Button>
                ) : (
                  <AddToCartButton
                    lines={[
                      {
                        merchandiseId: selectedVariant.id!,
                        quantity: 1,
                      },
                    ]}
                    data-test="add-to-cart"
                    analytics={{
                      products: [productAnalytics],
                      totalValue: parseFloat(productAnalytics.price),
                    }}
                  >
                    <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-tl-2xl rounded-bl-2xl bg-indigo-600 px-6 font-medium text-neutral-200 duration-500 w-full ">
                      <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0 font-outfit text-md md:text-lg">
                        Agregar al carrito
                      </div>
                      <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                        <svg
                          width="209px"
                          height="209px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          stroke="#000000"
                          className="w-6 h-6"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {' '}
                            <path
                              d="M6.29977 5H21L19 12H7.37671M20 16H8L6 3H3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM20 20C20 20.5523 19.5523 21 19 21C18.4477 21 18 20.5523 18 20C18 19.4477 18.4477 19 19 19C19.5523 19 20 19.4477 20 20Z"
                              stroke="#ffffff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>{' '}
                          </g>
                        </svg>
                      </div>
                    </button>
                  </AddToCartButton>
                )}
              </div>

              <BuyNowButton
                lines={[{merchandiseId: selectedVariant.id, quantity: 1}]}
                disabled={isOutOfStock}
                buttonClassName="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetail({
  title,
  content,
  learnMore,
}: {
  title: string;
  content: string;
  learnMore?: string;
}) {
  return (
    <Disclosure key={title} as="div" className="grid w-full gap-2">
      {({open}) => (
        <>
          <Disclosure.Button className="text-left">
            <div className="flex justify-between">
              <Text
                size="lead"
                as="h4"
                className="text-rose-100 font-outfit font-bold text-lg"
              >
                {title}
              </Text>
              <div className="m-2 border rounded-full">
                <ChevronDoubleDownIcon
                  className={clsx(
                    'transition-transform transform-gpu duration-200 text-white w-8 h-8 animate-pulse ',
                    !open && 'rotate-[90deg]',
                  )}
                />
              </div>
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'pb-4 pt-2 grid gap-2'}>
            <div
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{__html: content}}
            />
            {learnMore && (
              <div className="">
                <Link
                  className="pb-px border-b border-gray-300 text-gray-300 font-outfit"
                  to={learnMore}
                >
                  Ver más
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media(first: 10) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  query variants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      variants(first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No hay productos recomendados para mostrar');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}
