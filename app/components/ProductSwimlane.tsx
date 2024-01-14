import type {HomepageFeaturedProductsQuery} from 'storefrontapi.generated';
import {ProductCard, Section} from '~/components';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

type ProductSwimlaneProps = HomepageFeaturedProductsQuery & {
  title?: string;
  count?: number;
};

export function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  ...props
}: ProductSwimlaneProps) {
  return (
    <Section
      heading={title}
      padding="y"
      {...props}
      className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-stone-900 via-gray-900 to-neutral-800"
    >
      <div className="flex overflow-x-auto">
        {products.nodes.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            className="snap-start w-80"
          />
        ))}
      </div>
    </Section>
  );
}
