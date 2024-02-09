import {Suspense} from 'react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {ProductSwimlane, FeaturedCollections, Hero} from '~/components';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import HeroInfo from '~/components/HeroInfo';
import HeroTwo from '~/components/HeroTwo';
import {ProductSwimlaneTwo} from '~/components/ProductSwimlaneTwo';
import SliderMenuVendor from '~/components/SliderMenuVendor';
import {ProductCardForm} from '~/components/ProductCardForm';

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
        handle: 'OFERTAS',
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
        },
      },
    ),
    featuredProduct: context.storefront.query(FEATURED_PRODUCT_QUERY, {
      variables: {
        handle: 'kit-biela-hot-rods',
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
    featuredProducts,
    featuredCollection,
    featuredProduct,
  } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="h-[545px] md:h-[820px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-stone-900 via-gray-900 to-neutral-800">
        <HeroInfo />
      </div>

      {featuredProducts && (
        <Suspense>
          <Await resolve={featuredProducts}>
            {({products}) => {
              if (!products?.nodes) return <></>;
              const filteredProducts = products.nodes.filter(
                (product) =>
                  product.collections.edges.length > 0 &&
                  product.collections.edges[0].node.title === 'MAS VENDIDOS',
              );

              return (
                <div>
                  <h1 className="flex flex-wrap justify-center text-rose-100 text-3xl sm:text-5xl font-racing font-semibold mx-auto items-center gap-2 pt-8">
                    productos
                    <span className="font-racing text-3xl sm:text-5xl text-center font-bold text-red-200">
                      {filteredProducts[0].collections.edges[0].node.title}
                    </span>
                  </h1>
                  <ProductSwimlane
                    products={{nodes: filteredProducts}}
                    count={4}
                  />
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
      {featuredProducts && (
        <Suspense>
          <Await resolve={featuredProducts}>
            {({products}) => {
              if (!products?.nodes) return <></>;
              const filteredProducts = products.nodes.filter(
                (product: {vendor: string}) => product.vendor === '100%',
              );

              return (
                <div>
                  <h1 className="flex justify-center text-rose-100 text-3xl sm:text-5xl font-racing font-semibold mx-auto items-center gap-2 pt-8">
                    productos
                    <span className="font-racing text-3xl sm:text-6xl text-center font-bold text-red-300">
                      {filteredProducts[0].vendor}
                    </span>
                  </h1>
                  <ProductSwimlaneTwo
                    products={{nodes: filteredProducts}}
                    count={4}
                  />
                </div>
              );
            }}
          </Await>
        </Suspense>
      )}

      {featuredProduct && (
        <Suspense>
          <Await resolve={featuredProduct}>
            {({productByHandle}) => {
              if (!productByHandle) return <></>;
              return (
                <div>
                  <h1 className="flex justify-center text-rose-100 text-3xl sm:text-5xl font-racing font-semibold mx-auto items-center gap-2 pt-8">
                    producto
                    <span className="font-racing text-3xl sm:text-5xl text-center font-bold text-red-200">
                      {productByHandle.title}
                    </span>
                  </h1>
                  <ProductCardForm product={productByHandle} />
                </div>
              );
            }}
          </Await>
        </Suspense>
      )}

      {featuredCollections && (
        <Suspense>
          <Await resolve={featuredCollections}>
            {({collections}) => {
              if (!collections?.nodes) return <></>;
              const filteredCollections = collections.nodes.filter(
                (collection) => collection.title !== 'All',
              );
              return (
                <FeaturedCollections
                  collections={{nodes: filteredCollections}}
                  title="Collections"
                />
              );
            }}
          </Await>
        </Suspense>
      )}
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
  }
  ${MEDIA_FRAGMENT}
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
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 40,sortKey: UPDATED_AT) {
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
