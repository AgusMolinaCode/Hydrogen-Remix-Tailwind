import type {CustomerDetailsFragment} from 'storefrontapi.generated';
import {Link} from '~/components';

export function AccountDetails({
  customer,
}: {
  customer: CustomerDetailsFragment;
}) {
  const {firstName, lastName, email, phone} = customer;

  return (
    <>
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h3 className="font-bold text-lead font-outfit text-rose-100">
          Detalles de cuenta
        </h3>
        <div className="lg:p-8 p-6 border-b border-t border-gray-200 rounded">
          <div className="flex">
            <h3 className="font-bold text-base flex-1 font-outfit text-gray-300">
              Cuenta & Contraseñas
            </h3>
            <Link
              prefetch="intent"
              className="text-md  font-outfit p-1 text-gray-900 bg-blue-300 rounded-xl"
              to="/account/edit"
            >
              Editar
            </Link>
          </div>
          <div className="mt-4 text-sm font-outfit text-gray-300">Nombre</div>
          <p className="mt-1 font-outfit text-white">
            {firstName || lastName
              ? (firstName ? firstName + ' ' : '') + lastName
              : 'Agregar nombre'}{' '}
          </p>

          <div className="mt-4 text-sm font-outfit text-gray-300">Contacto</div>
          <p className="mt-1 font-outfit text-white">
            {phone ?? 'Agregar celular'}
          </p>

          <div className="mt-4 text-sm font-outfit text-gray-300">Email</div>
          <p className="mt-1 font-outfit text-white">{email}</p>

          <div className="mt-4 text-sm font-outfit text-gray-300">
            Contraseña
          </div>
          <p className="mt-1 font-outfit text-white">**************</p>
        </div>
      </div>
    </>
  );
}
