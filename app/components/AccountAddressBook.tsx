import {Form} from '@remix-run/react';
import type {MailingAddress} from '@shopify/hydrogen/storefront-api-types';

import type {CustomerDetailsFragment} from 'storefrontapi.generated';
import {Button, Link, Text} from '~/components';

export function AccountAddressBook({
  customer,
  addresses,
}: {
  customer: CustomerDetailsFragment;
  addresses: MailingAddress[];
}) {
  return (
    <>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="font-bold text-lead font-outfit text-rose-100">
          Direcciones de envio
        </h3>
        <div>
          {!addresses?.length && (
            <Text className="mb-1" width="narrow" as="p" size="copy">
              Aun no tienes direcciones de envio.
            </Text>
          )}
          <div className="w-48 pb-8">
            <Button
              to="address/add"
              className="text-md font-outfit p-1 text-gray-900 bg-blue-300 rounded-xl"
            >
              Agregar dirección
            </Button>
          </div>
          {Boolean(addresses?.length) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {customer.defaultAddress && (
                <Address address={customer.defaultAddress} defaultAddress />
              )}
              {addresses
                .filter((address) => address.id !== customer.defaultAddress?.id)
                .map((address) => (
                  <Address key={address.id} address={address} />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Address({
  address,
  defaultAddress,
}: {
  address: MailingAddress;
  defaultAddress?: boolean;
}) {
  return (
    <div className="lg:p-8 p-6 border border-gray-200 rounded-xl flex flex-col">
      {defaultAddress && (
        <div className="mb-3 flex flex-row">
          <span className="px-3 py-1 text-sm font-outfit font-medium rounded-full bg-black text-gray-300">
            Principal
          </span>
        </div>
      )}
      <ul className="flex-1 flex-row">
        {(address.firstName || address.lastName) && (
          <li className="text-rose-100 font-outfit">
            {'' +
              (address.firstName && address.firstName + ' ') +
              address?.lastName}
          </li>
        )}
        {address.formatted &&
          address.formatted.map((line: string) => (
            <li className="text-rose-100 font-outfit" key={line}>
              {line}
            </li>
          ))}
      </ul>

      <div className="flex flex-row font-medium mt-6 items-baseline gap-2">
        <Link
          to={`/account/address/${encodeURIComponent(address.id)}`}
          className="text-md font-outfit p-1 text-gray-900 bg-blue-300 rounded-xl"
          prefetch="intent"
        >
          Editar
        </Link>
        <Form action="address/delete" method="delete">
          <input type="hidden" name="addressId" value={address.id} />
          <button className="text-md font-outfit p-1 text-red-400  rounded-xl">
            Eliminar
          </button>
        </Form>
      </div>
    </div>
  );
}
