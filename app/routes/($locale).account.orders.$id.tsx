import invariant from 'tiny-invariant';
import clsx from 'clsx';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Money, Image, flattenConnection} from '@shopify/hydrogen';
import type {OrderFulfillmentStatus} from '@shopify/hydrogen/storefront-api-types';

import {statusMessage} from '~/lib/utils';
import {Link, Heading, PageHeader, Text} from '~/components';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({request, context, params}: LoaderFunctionArgs) {
  if (!params.id) {
    return redirect(params?.locale ? `${params.locale}/account` : '/account');
  }

  const queryParams = new URL(request.url).searchParams;
  const orderToken = queryParams.get('key');

  invariant(orderToken, 'Orde token es requerido');

  const customerAccessToken = await context.session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect(
      params.locale ? `${params.locale}/account/login` : '/account/login',
    );
  }

  const orderId = `gid://shopify/Order/${params.id}?key=${orderToken}`;

  const {node: order} = await context.storefront.query(CUSTOMER_ORDER_QUERY, {
    variables: {orderId},
  });

  if (!order || !('lineItems' in order)) {
    throw new Response('Orden no encontrada.', {status: 404});
  }

  const lineItems = flattenConnection(order.lineItems);

  const discountApplications = flattenConnection(order.discountApplications);

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return json({
    order,
    lineItems,
    discountValue,
    discountPercentage,
  });
}

export default function OrderRoute() {
  const {order, lineItems, discountValue, discountPercentage} =
    useLoaderData<typeof loader>();

  const statusMessageSpanish: Record<OrderFulfillmentStatus, string> = {
    FULFILLED: 'Pago realizado',
    IN_PROGRESS: 'En progreso',
    ON_HOLD: 'En espera',
    OPEN: 'Abierto',
    PARTIALLY_FULFILLED: 'Parcialmente realizado',
    PENDING_FULFILLMENT: 'Cumplimiento pendiente',
    RESTOCKED: 'Reabastecido',
    SCHEDULED: 'Programado',
    UNFULFILLED: 'Pago no realizado',
  };

  return (
    <div>
      <PageHeader
        heading="Detalle de orden"
        className="text-rose-100 font-outfit"
      >
        <Link to="/account">
          <Text className="text-gray-300 font-outfit">
            Volver al resumen de la cuenta
          </Text>
        </Link>
      </PageHeader>
      <div className="w-full p-6 sm:grid-cols-1 md:p-8 lg:p-12 lg:py-6">
        <div>
          <Text as="h3" size="lead" className="text-rose-100 font-outfit">
            Orden Numero {order.name}
          </Text>
          <Text as="p" className="text-gray-300 font-outfit mt-2">
            Comprado en {new Date(order.processedAt!).toDateString()}
          </Text>
          <div className="grid items-start gap-12 sm:grid-cols-1 md:grid-cols-4 md:gap-16 sm:divide-y sm:divide-gray-200">
            <table className="min-w-full my-8 divide-y divide-gray-300 md:col-span-3">
              <thead>
                <tr className="align-baseline ">
                  <th
                    scope="col"
                    className="pb-4 pl-0 pr-3 font-semibold text-left text-gray-300 font-outfit"
                  >
                    Producto
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 font-semibold text-right sm:table-cell md:table-cell text-gray-300 font-outfit"
                  >
                    Precio
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 pb-4 font-semibold text-right sm:table-cell md:table-cell text-gray-300 font-outfit"
                  >
                    Cantidad
                  </th>
                  <th
                    scope="col"
                    className="px-4 pb-4 font-semibold text-right text-gray-300 font-outfit"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lineItems.map((lineItem) => (
                  <tr key={lineItem.variant!.id}>
                    <td className="w-full py-4 pl-0 pr-3 align-top sm:align-middle max-w-0 sm:w-auto sm:max-w-none">
                      <div className="flex gap-6">
                        <Link
                          to={`/products/${lineItem.variant!.product!.handle}`}
                        >
                          {lineItem?.variant?.image && (
                            <div className="w-24 card-image aspect-square">
                              <Image
                                data={lineItem.variant.image}
                                width={96}
                                height={96}
                              />
                            </div>
                          )}
                        </Link>
                        <div className="flex-col justify-center hidden lg:flex">
                          <Text as="p" className="font-outfit text-gray-100">
                            {lineItem.title}
                          </Text>
                          <Text
                            size="fine"
                            className="mt-1 font-outfit text-gray-400"
                            as="p"
                          >
                            {lineItem.variant!.title}
                          </Text>
                        </div>
                        <dl className="grid">
                          <dt className="sr-only">Producto</dt>
                          <dd className="truncate lg:hidden">
                            <Heading
                              size="copy"
                              format
                              as="h3"
                              className="font-outfit text-rose-100"
                            >
                              {lineItem.title}
                            </Heading>
                            <Text
                              size="fine"
                              className="mt-1 font-outfit text-rose-100"
                            >
                              {lineItem.variant!.title}
                            </Text>
                          </dd>
                          <dt className="sr-only">Precio</dt>
                          <dd className="truncate sm:hidden">
                            <Text
                              size="fine"
                              className="mt-4 font-outfit text-rose-100"
                            >
                              <Money data={lineItem.variant!.price!} />
                            </Text>
                          </dd>
                          <dt className="sr-only">Cantidad</dt>
                          <dd className="truncate sm:hidden">
                            <Text className="mt-1 text-gray-200" size="fine">
                              Cant.: {lineItem.quantity}
                            </Text>
                          </dd>
                        </dl>
                      </div>
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:align-middle sm:table-cell font-outfit text-rose-100 font-semibold">
                      <Money data={lineItem.variant!.price!} />
                    </td>
                    <td className="hidden px-3 py-4 text-right align-top sm:align-middle sm:table-cell font-outfit text-rose-100 font-semibold">
                      {lineItem.quantity}
                    </td>
                    <td className="px-3 py-4 text-right align-top sm:align-middle sm:table-cell font-outfit text-rose-100 font-semibold">
                      <Text>
                        <Money data={lineItem.discountedTotalPrice!} />
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {((discountValue && discountValue.amount) ||
                  discountPercentage) && (
                  <tr>
                    <th
                      scope="row"
                      colSpan={3}
                      className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0 text-rose-100"
                    >
                      <Text>Descuentos</Text>
                    </th>
                    <th
                      scope="row"
                      className="pt-6 pr-3 font-normal text-left sm:hidden text-rose-100"
                    >
                      <Text>Descuentos</Text>
                    </th>
                    <td className="pt-6 pl-3 pr-4 font-medium text-right text-green-700 md:pr-3">
                      {discountPercentage ? (
                        <span className="text-sm">
                          -{discountPercentage}% OFF
                        </span>
                      ) : (
                        discountValue && <Money data={discountValue!} />
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-6 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0"
                  >
                    <Text className="text-white font-bold font-outfit">
                      Subtotal
                    </Text>
                  </th>
                  <th
                    scope="row"
                    className="pt-6 pr-3 font-normal text-left sm:hidden"
                  >
                    <Text className="text-white font-bold font-outfit">
                      Subtotal
                    </Text>
                  </th>
                  <td className="pt-6 pl-3 pr-4 text-right md:pr-3 font-outfit text-white">
                    <Money data={order.subtotalPriceV2!} />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-normal text-right sm:table-cell md:pl-0 text-gray-300 font-outfit"
                  >
                    Tax
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-normal text-left sm:hidden"
                  >
                    <Text>Impuesto</Text>
                  </th>
                  <td className="pt-4 pl-3 pr-4 text-right md:pr-3 text-rose-100 font-outfit">
                    <Money data={order.totalTaxV2!} />
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    colSpan={3}
                    className="hidden pt-4 pl-6 pr-3 font-semibold text-right sm:table-cell md:pl-0 font-outfit text-white"
                  >
                    Total
                  </th>
                  <th
                    scope="row"
                    className="pt-4 pr-3 font-bold text-left sm:hidden font-outfit text-white"
                  >
                    <Text>Total</Text>
                  </th>
                  <td className="pt-4 pl-3 pr-4 font-bold text-right md:pr-3 font-outfit text-white">
                    <Money data={order.totalPriceV2!} />
                  </td>
                </tr>
              </tfoot>
            </table>
            <div className="sticky border-none top-nav md:my-8">
              <Heading
                size="copy"
                className="font-semibold font-outfit text-gray-300"
                as="h3"
              >
                Direccion de envio
              </Heading>
              {order?.shippingAddress ? (
                <ul className="mt-6 font-outfit text-rose-100">
                  <li>
                    <Text className="font-outfit text-rose-100">
                      {order.shippingAddress.firstName &&
                        order.shippingAddress.firstName + ' '}
                      {order.shippingAddress.lastName}
                    </Text>
                  </li>
                  {order?.shippingAddress?.formatted ? (
                    order.shippingAddress.formatted.map((line: string) => (
                      <li key={line}>
                        <Text className="font-outfit text-rose-100">
                          {line}
                        </Text>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
              ) : (
                <p className="mt-3 font-outfit text-gray-300">
                  No se ingreso direccion de envio.
                </p>
              )}
              <Heading
                size="copy"
                className="mt-8 font-semibold font-outfit text-gray-300"
                as="h3"
              >
                Estado
              </Heading>
              <div
                className={clsx(
                  `mt-3 px-3 py-1 text-xs font-medium rounded-full inline-block w-auto`,
                  order.fulfillmentStatus === 'FULFILLED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-600 text-gray-100',
                )}
              >
                <Text size="fine">
                  {statusMessageSpanish[order.fulfillmentStatus]}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CUSTOMER_ORDER_QUERY = `#graphql
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
  fragment AddressFull on MailingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    formatted
    id
    lastName
    name
    phone
    province
    provinceCode
    zip
  }
  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        amount
        currencyCode
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment Image on Image {
    altText
    height
    src: url(transform: {crop: CENTER, maxHeight: 96, maxWidth: 96, scale: 2})
    id
    width
  }
  fragment ProductVariant on ProductVariant {
    id
    image {
      ...Image
    }
    price {
      ...Money
    }
    product {
      handle
    }
    sku
    title
  }
  fragment LineItemFull on OrderLineItem {
    title
    quantity
    discountAllocations {
      allocatedAmount {
        ...Money
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    originalTotalPrice {
      ...Money
    }
    discountedTotalPrice {
      ...Money
    }
    variant {
      ...ProductVariant
    }
  }

  query CustomerOrder(
    $country: CountryCode
    $language: LanguageCode
    $orderId: ID!
  ) @inContext(country: $country, language: $language) {
    node(id: $orderId) {
      ... on Order {
        id
        name
        orderNumber
        processedAt
        fulfillmentStatus
        totalTaxV2 {
          ...Money
        }
        totalPriceV2 {
          ...Money
        }
        subtotalPriceV2 {
          ...Money
        }
        shippingAddress {
          ...AddressFull
        }
        discountApplications(first: 100) {
          nodes {
            ...DiscountApplication
          }
        }
        lineItems(first: 100) {
          nodes {
            ...LineItemFull
          }
        }
      }
    }
  }
`;
