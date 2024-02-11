import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import clsx from 'clsx';
import {twMerge} from 'tailwind-merge';

import {Link} from '../components/Link';

type ButtonMode = 'default' | 'inline';

export function BuyNowButton({
  children = 'Buy now',
  lines,
  mode = 'default',
  buttonClassName,
  ...props
}: {
  children?: React.ReactNode;
  lines: CartLineInput[];
  mode?: ButtonMode;
  buttonClassName?: string;
  [key: string]: any;
}) {
  const to = lines
    .map(
      (line) =>
        `${line.merchandiseId.replace('gid://shopify/ProductVariant/', '')}:${
          line.quantity
        }`,
    )
    .join(',');

  return (
    <Link
      to={`/cart/${to}`}
      className={clsx([
        mode == 'default' ? twMerge(buttonClassName) : buttonClassName,
        props.disabled ? 'pointer-events-none bg-opacity-100 opacity-20' : '',
      ])}
      {...props}
    >
      {/* {children} */}
      <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-3xl bg-indigo-700 px-6 font-medium text-neutral-200 duration-500 w-full">
        <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0 font-outfit text-lg">
          Comprar ahora
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
    </Link>
  );
}
