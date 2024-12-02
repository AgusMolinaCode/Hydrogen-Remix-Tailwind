import {Suspense, useContext, useState, useEffect} from 'react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

import FilterContext from '~/context/FilterContext';
import {Button, Link, ProductSwimlane} from '~/components';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import HeroInfo from '~/components/HeroInfo';
import HeroTwo from '~/components/HeroTwo';
import {ProductSwimlaneTwo} from '~/components/ProductSwimlaneTwo';
import SliderMenuVendor from '~/components/SliderMenuVendor';
import {ProductCardForm} from '~/components/ProductCardForm';
import SliderInfinite from '~/components/SliderInfinite';
import {BentoGridSecondDemo} from '~/components/BentoGridSecondDemo';
import SortHome from '~/components/SortHome';

import {staggerContainer, fadeIn} from '../utils/motion';
import {ProductCardGrid} from '~/components/ProductCardGrid';
import ChevronDoubleRightIcon from '@heroicons/react/16/solid/ChevronDoubleRightIcon';
import FetchParts from '~/components/FetchParts';
import ProxCatalog from '~/components/ProxCatalog';
export const headers = routeHeaders;

export async function loader({params, context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the locale URL param is defined, yet we still are on `EN-US`
    // the the locale param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const {shop} = await context.storefront.query(HOMEPAGE_SEO_QUERY, {
    variables: {handle: 'home-hero'},
  });

  const seo = seoPayload.home();

  return defer({
    shop,
    featuredCollection: context.storefront.query(FEATURED_COLLECTION_QUERY, {
      variables: {
        handle: 'MAS-VENDIDOS',
        country,
        language,
      },
    }),
    featuredProducts: context.storefront.query(
      HOMEPAGE_FEATURED_PRODUCTS_QUERY,
      {
        variables: {
          country,
          language,
          reverse: true,
        },
      },
    ),
    vendorProducts: context.storefront.query(VENDOR_FEATURED_PRODUCTS_QUERY, {
      variables: {
        country,
        language,
        reverse: true,
      },
    }),
    featuredProduct: context.storefront.query(FEATURED_PRODUCT_QUERY, {
      variables: {
        handle: 'casco-fly-racing-trekker-cw-solid',
        country,
        language,
      },
    }),

    featuredCollections: context.storefront.query(FEATURED_COLLECTIONS_QUERY, {
      variables: {
        country,
        language,
      },
    }),
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  });
}

export default function Homepage() {
  const {
    featuredCollections,
    vendorProducts,
    featuredProducts,
    featuredCollection,
    featuredProduct,
  } = useLoaderData<typeof loader>();

  const [isSortHomeRendered, setIsSortHomeRendered] = useState(false);

  useEffect(() => {
    setIsSortHomeRendered(true);
  }, []);

  return (
    <>
      <div className="h-[545px] md:h-[820px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-stone-900 via-gray-900 to-neutral-800">
        <HeroInfo />
      </div>

      {featuredCollection && (
        <Suspense>
          <Await resolve={featuredCollection}>
            {({collection}) => {
              if (!collection) return <></>;

              return (
                <motion.div
                  variants={staggerContainer(1, 0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{once: false, amount: 0.25}}
                >
                  <motion.div variants={fadeIn('right', 'spring', 0.2, 1)}>
                    <h1 className="flex justify-center text-rose-100 text-3xl sm:text-5xl font-racing font-semibold mx-auto items-center gap-2 pt-8">
                      <span className="font-racing text-3xl sm:text-5xl text-center font-bold text-red-200">
                        Mas vendidos
                      </span>
                    </h1>
                    <p className="font-racing font-thin text-center text-lg text-gray-300 sm:text-2xl px-2">
                      Descubre los productos más vendidos de nuestra tienda.
                    </p>
                  </motion.div>

                  <ProductSwimlane
                    products={{
                      nodes: collection.products.edges.map(
                        (product: any) => product.node,
                      ),
                    }}
                    count={4}
                  />
                </motion.div>
              );
            }}
          </Await>
        </Suspense>
      )}

      {vendorProducts && (
        <Suspense>
          <Await resolve={vendorProducts}>
            {({products}) => {
              if (!products?.nodes) return <></>;

              const latestProducts = products.nodes;

              return (
                <div>
                  <div>
                    <h1 className="flex justify-center text-rose-100 text-3xl sm:text-5xl font-racing font-semibold mx-auto items-center gap-2 pt-8">
                      <span className="font-racing text-3xl sm:text-5xl text-center font-bold text-red-200">
                        Pro-x Japon
                      </span>
                    </h1>

                    <Link
                      to='/collections/todos-los-productos?filter.productVendor="Pro-x"'
                      className="flex justify-center mx-auto items-center pt-4"
                    >
                      <Button className="bg-black/20 backdrop-blur-xl text-rose-100 px-2  rounded-2xl shadow-lg font-bold font-Righteous text-xl py-1 border border-rose-100 flex">
                        Ver Más Productos Pro-x
                        <ChevronDoubleRightIcon className="w-8 h-8 ml-2 animate-fade animate-infinite animate-duration-[600ms]" />
                      </Button>
                    </Link>
                  </div>
                  {/* <ProductSwimlaneTwo
                    products={{nodes: latestProducts}}
                    count={4}
                  /> */}

                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-2 md:gap-4 lg:gap-6 mt-2">
                      {latestProducts.map((product: any) => (
                        <div
                          key={product.id}
                          className="flex flex-col items-center"
                        >
                          <div>
                            {/* <ProductCardForm product={product} /> */}
                            <ProductCardGrid product={product} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    to='/collections/todos-los-productos?filter.productVendor="Pro-x"'
                    className="flex justify-center mx-auto items-center pt-4 pb-8"
                  >
                    <Button className="bg-black/20 backdrop-blur-xl text-rose-100 px-2  rounded-2xl shadow-lg font-bold font-Righteous text-xl py-1 border border-rose-100 flex">
                      Ver Más Productos Pro-x
                      <ChevronDoubleRightIcon className="w-8 h-8 ml-2 animate-fade animate-infinite animate-duration-[600ms]" />
                    </Button>
                  </Link>
                </div>
              );
            }}
          </Await>
        </Suspense>
      )}
      <div className="pt-2 sm:pt-14">
        <HeroTwo />
      </div>
      <SliderMenuVendor />
      {featuredProduct && (
        <Suspense>
          <Await resolve={featuredProduct}>
            {({productByHandle}) => {
              if (!productByHandle) return <></>;
              return (
                <motion.div
                  variants={staggerContainer(1, 0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{once: false, amount: 0.25}}
                >
                  <motion.div variants={fadeIn('right', 'spring', 0.2, 1)}>
                    <h1 className="flex justify-center text-rose-100 text-4xl sm:text-5xl font-racing font-thin sm:font-semibold mx-auto items-center gap-2 pt-10 sm:pt-16 pb-4">
                      Producto destacado
                    </h1>
                    <p className="font-racing font-thin text-center text-lg text-gray-300 sm:text-2xl px-2">
                      Descubre el producto más vendido de la semana, no te
                      quedes sin el tuyo.
                    </p>
                  </motion.div>
                  <ProductCardForm product={productByHandle} />
                </motion.div>
              );
            }}
          </Await>
        </Suspense>
      )}
      {featuredProducts && (
        <Suspense>
          <Await resolve={featuredProducts}>
            {({products}) => {
              if (!products?.nodes) return <></>;

              const latestProducts = products.nodes;

              return (
                <motion.div
                  variants={staggerContainer(1, 0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{once: false, amount: 0.25}}
                >
                  <motion.div variants={fadeIn('right', 'spring', 0.2, 1)}>
                    <h1 className="flex justify-center text-rose-100 text-3xl sm:text-5xl font-racing font-semibold mx-auto items-center gap-2 pt-8">
                      <span className="font-racing text-3xl sm:text-5xl text-center font-bold text-red-200">
                        Nuevos
                      </span>
                    </h1>
                    <p className="font-racing font-thin text-center text-lg text-gray-300 sm:text-2xl px-2">
                      Descubre los últimos productos en llegar a nuestra tienda.
                    </p>
                  </motion.div>
                  <ProductSwimlaneTwo
                    products={{nodes: latestProducts}}
                    count={4}
                  />
                </motion.div>
              );
            }}
          </Await>
        </Suspense>
      )}
      <SliderInfinite />
      <BentoGridSecondDemo />
    </>
  );
}

const COLLECTION_CONTENT_FRAGMENT = `#graphql
  fragment CollectionContent on Collection {
    id
    handle
    title
    descriptionHtml
    
    heading: metafield(namespace: "hero", key: "title") {
      value
    }
    byline: metafield(namespace: "hero", key: "byline") {
      value
    }
    cta: metafield(namespace: "hero", key: "cta") {
      value
    }
    spread: metafield(namespace: "hero", key: "spread") {
      reference {
        ...Media
      }
    }
    spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
      reference {
        ...Media
      }
    }
    image {
      altText
      width
      height
      url
    }
    products(first: 8) {
      edges {
        node {
          ...ProductCard
        }
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
` as const;

const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
    shop {
      name
      description
    }
  }
  ${COLLECTION_CONTENT_FRAGMENT}
` as const;

export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  query homepageFeaturedProductsIndex($country: CountryCode, $language: LanguageCode, $reverse: Boolean!)
  @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: CREATED_AT, reverse: $reverse) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const VENDOR_FEATURED_PRODUCTS_QUERY = `#graphql
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode, $reverse: Boolean!)
  @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: UPDATED_AT, reverse: $reverse, query: "vendor:pro-x") {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const FEATURED_PRODUCT_QUERY = `#graphql
  query featuredProduct($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    productByHandle(handle: $handle) {
      ...ProductCard
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(
      first: 7,
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
` as const;

export const FEATURED_COLLECTION_QUERY = `#graphql
  query featuredCollection($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...CollectionContent
    }
  }
  ${COLLECTION_CONTENT_FRAGMENT}
` as const;
