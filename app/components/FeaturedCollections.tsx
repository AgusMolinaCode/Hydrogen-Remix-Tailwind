import {Image} from '@shopify/hydrogen';

import type {HomepageFeaturedCollectionsQuery} from 'storefrontapi.generated';
import {Heading, Section, Grid, Link} from '~/components';

type FeaturedCollectionsProps = HomepageFeaturedCollectionsQuery & {
  title?: string;
  [key: string]: any;
};

export function FeaturedCollections({
  collections,
  title = 'Collections',
  ...props
}: FeaturedCollectionsProps) {
  const haveCollections = collections?.nodes?.length > 0;
  if (!haveCollections) return null;

  const collectionsWithImage = collections.nodes.filter((item) => item.image);

  return (
    <Section
      {...props}
      // heading={title}
      padding="card"
      display="none"
      className="pt-16 pb-10"
    >
      <div>
        <h1 className="font-racing text-5xl sm:text-6xl text-center text-rose-100">
          COLECCIONES
        </h1>
        <h2 className="font-racing text-3xl sm:text-4xl text-center text-gray-400 pb-12">
          Descubre nuestras colecciones
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 content-center mx-auto gap-4 ">
          {collectionsWithImage.map((collection) => {
            return (
              <Link
                key={collection.id}
                to={`/collections/${collection.handle}`}
                className="hover:border hover:border-orange-500 hover:shadow-2xl transition-shadow duration-300 rounded-2xl"
              >
                <div className="grid">
                  <div className="aspect-[3/2]">
                    {collection?.image && (
                      <Image
                        alt={`Image of ${collection.title}`}
                        data={collection.image}
                        sizes="(max-width: 32em) 100vw, 33vw"
                        aspectRatio="3/2"
                        className="rounded-2xl"
                      />
                    )}
                  </div>
                  {/* <Heading size="copy">{collection.title}</Heading> */}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
