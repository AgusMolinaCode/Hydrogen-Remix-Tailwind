import {flattenConnection, Image} from '@shopify/hydrogen';
import type {OrderFulfillmentStatus} from '@shopify/hydrogen/storefront-api-types';

import type {OrderCardFragment} from 'storefrontapi.generated';
import {Heading, Text, Link} from '~/components';
import {statusMessage} from '~/lib/utils';

export function OrderCard({order}: {order: OrderCardFragment}) {
  if (!order?.id) return null;
  const [legacyOrderId, key] = order!.id!.split('/').pop()!.split('?');
  const lineItems = flattenConnection(order?.lineItems);

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
    <li className="grid text-center border rounded-xl">
      <Link
        className="grid items-center gap-4 p-4 md:gap-6 md:p-6 md:grid-cols-2"
        to={`/account/orders/${legacyOrderId}?${key}`}
        prefetch="intent"
      >
        {lineItems[0].variant?.image && (
          <div className="card-image aspect-square bg-primary/5">
            <Image
              width={168}
              height={168}
              className="w-full fadeIn cover"
              alt={lineItems[0].variant?.image?.altText ?? 'Order image'}
              src={lineItems[0].variant?.image.url}
            />
          </div>
        )}
        <div
          className={`flex-col justify-center text-left ${
            !lineItems[0].variant?.image && 'md:col-span-2'
          }`}
        >
          <Heading
            as="h3"
            format
            size="copy"
            className="text-white font-outfit font-bold"
          >
            {lineItems.length > 1
              ? `${lineItems[0].title} +${lineItems.length - 1} more`
              : lineItems[0].title}
          </Heading>
          <dl className="grid grid-gap-1">
            <dt className="sr-only">Order ID</dt>
            <dd>
              <Text size="fine" className="text-gray-300 font-outfit">
                Orden No. {order.orderNumber}
              </Text>
            </dd>
            <dt className="sr-only font-outfit text-white">Dia de compra</dt>
            <dd>
              <Text size="fine" className="text-gray-300 font-outfit">
                {new Date(order.processedAt).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </Text>
            </dd>
            <dt className="sr-only font-outfit text-white">Estado de Orden</dt>
            <dd className="mt-2">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  order.fulfillmentStatus === 'FULFILLED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-600 text-gray-100'
                }`}
              >
                <Text size="fine">
                  {statusMessageSpanish[order.fulfillmentStatus]}
                </Text>
              </span>
            </dd>
          </dl>
        </div>
      </Link>
      <div className="self-end border-t">
        <Link
          className="block w-full p-2 text-center"
          to={`/account/orders/${legacyOrderId}?${key}`}
          prefetch="intent"
        >
          <Text color="subtle" className="ml-3 font-outfit text-rose-100">
            Ver detalles
          </Text>
        </Link>
      </div>
    </li>
  );
}

export const ORDER_CARD_FRAGMENT = `#graphql
  fragment OrderCard on Order {
    id
    orderNumber
    processedAt
    financialStatus
    fulfillmentStatus
    currentTotalPrice {
      amount
      currencyCode
    }
    lineItems(first: 2) {
      edges {
        node {
          variant {
            image {
              url
              altText
              height
              width
            }
          }
          title
        }
      }
    }
  }
`;
