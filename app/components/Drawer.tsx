import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {XCircleIcon} from '@heroicons/react/16/solid';

import {Heading, IconClose} from '~/components';

/**
 * Drawer component that opens on user click.
 * @param heading - string. Shown at the top of the drawer.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param openFrom - right, left
 * @param children - react children node.
 */
export function Drawer({
  heading,
  open,
  onClose,
  openFrom = 'right',
  children,
}: {
  heading?: string;
  open: boolean;
  onClose: () => void;
  openFrom: 'right' | 'left';
  children: React.ReactNode;
}) {
  const offScreen = {
    right: 'translate-x-full',
    left: '-translate-x-full',
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 left-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`fixed inset-y-0 flex max-w-full ${
                openFrom === 'right' ? 'right-0' : ''
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
              >
                <Dialog.Panel className="w-[318px] sm:w-[490px] text-left align-middle transition-all transform shadow-xl h-screen-dynamic bg-black/90 backdrop-blur-md border-r-1 border-gray-500 mt-2">
                  <header
                    className={`sticky top-0 flex items-center px-1 h-nav sm:px-8 md:px-12 ${
                      heading ? 'justify-between' : 'justify-end'
                    }`}
                  >
                    {heading !== null && (
                      <Dialog.Title>
                        <Heading
                          className="font-racing text-2xl p-2 text-gray-200"
                          as="span"
                          size="lead"
                          id="cart-contents"
                        >
                          {/* {heading} */}
                          Productos
                        </Heading>
                      </Dialog.Title>
                    )}
                    <button
                      type="button"
                      className="p-6 -m-4 transition text-primary hover:text-primary/50"
                      onClick={onClose}
                      data-test="close-cart"
                    >
                      {/* <IconClose
                        className="p-1 rounded-full border"
                        aria-label="Close panel"
                      /> */}
                      <XCircleIcon
                        className="rounded-full border text-gray-200"
                        aria-label="Close panel"
                        width={40}
                      />
                    </button>
                  </header>
                  <div className="border-b-1 border-gray-500 mt-1" />
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* Use for associating arialabelledby with the title*/
Drawer.Title = Dialog.Title;

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openDrawer() {
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
}
