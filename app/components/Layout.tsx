import {useParams, Form, Await} from '@remix-run/react';
import {
  Navbar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from '@nextui-org/react';
import {useWindowScroll} from 'react-use';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo, useState} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {
  Bars2Icon,
  MagnifyingGlassIcon,
  UserIcon,
  UserCircleIcon,
  ShoppingCartIcon,
} from '@heroicons/react/16/solid';

import {type LayoutQuery} from 'storefrontapi.generated';
import {
  Drawer,
  useDrawer,
  Text,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
} from '~/components';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useRootLoaderData} from '~/root';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function Layout({children, layout}: LayoutProps) {
  const {headerMenu, footerMenu} = layout || {};
  return (
    <>
      <div className="flex flex-col lg:pt-10 pb-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 to-gray-600 bg-gradient-to-r">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && layout?.shop.name && (
          <Header title={layout.shop.name} menu={headerMenu} />
        )}
        <main role="main" id="mainContent" className="">
          {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </>
  );
}

function Header({title, menu}: {title: string; menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRootLoaderData();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive
                ? 'font-outfit font-bold text-orange-500'
                : 'font-outfit font-bold text-white'
            }
          >
            <Text as="span" size="copy" className="text-xl">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-[#202123]/70 dark:bg-black/20 backdrop-blur-sm text-contrast dark:text-primary shadow-darkHeader'
          : 'bg-[#202123]/70 text-primary'
      } flex lg:hidden items-center h-14 sticky backdrop-blur-sm z-40 top-0 justify-between w-full leading-none gap-2 px-1 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-10 h-10 text-white border rounded-full"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <MagnifyingGlassIcon className="text-white" />
          </button>
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold text-center font-racing text-2xl text-rose-100 leading-none"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8 text-white" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
}) {
  const params = useParams();
  const {y} = useWindowScroll();

  const [MenuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <Navbar
        shouldHideOnScroll
        maxWidth="full"
        role="banner"
        className={
          'hidden h-[5rem] lg:flex items-center transition duration-300 bg-[#202123]/70 backdrop-blur-sm z-40 top-0 justify-around mx-auto w-full leading-none gap-8 px-2 border-b-[0.4px] border-contrast/10 dark:border-contrast/20 md:px-8 lg:px-12 fixed left-0 right-0'
        }
      >
        <div className="flex gap-4">
          <div>
            <Dropdown
              backdrop="blur"
              className="p-0 bg-transparent hover:bg-black/70"
            >
              <DropdownTrigger>
                <Button className="bg-black/20 px-0 border-1 rounded-full border-gray-400/20 hover:bg-black/30 min-w-unit-10 h-unit-10 dropdown">
                  {MenuOpen ? (
                    <Bars2Icon
                      width={100}
                      className="w-20 animate-rotate-y animate-delay-400 text-white"
                    />
                  ) : (
                    <Bars2Icon
                      width={100}
                      className="w-20 animate-rotate-x animate-delay-400 text-white"
                    />
                  )}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                color="undefined"
                className="p-0 hover:bg-black/25 w-[200px]"
              >
                <DropdownItem
                  className="bg-black/70 p-5 hover:bg-black/20"
                  key="new"
                >
                  {(menu?.items || []).map((item) => (
                    <Link
                      key={item.id}
                      to={item.to}
                      target={item.target}
                      className={({isActive}) =>
                        isActive
                          ? 'font-outfit text-lg m-2 font-bold flex items-end underline hover:text-orange-500 duration-200'
                          : 'font-outfit text-lg m-2 font-semibold flex items-end hover:text-orange-500 duration-200'
                      }
                    >
                      {item.title}
                    </Link>
                  ))}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="flex items-center">
            <p className="font-outfit font-bold text-lg text-gray-400">Menu </p>
            <Link
              className="font-semibold font-racing text-3xl text-rose-100 pl-3"
              to="/"
              prefetch="intent"
            >
              <h1>| {title} SHOP</h1>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Form
            method="get"
            action={params.locale ? `/${params.locale}/search` : '/search'}
            className="flex items-center gap-2"
          >
            <Input
              style={{
                borderWidth: '0px',
                outline: 'none',
                color: 'white',
                boxShadow: 'none',
              }}
              className={
                isHome ? ' text-white font-outfit' : ' text-white font-outfit'
              }
              classNames={{
                input: 'text-white font-outfit placeholder:text-white',
              }}
              type="search"
              variant="underlined"
              placeholder="Buscar"
              name="q"
            />
            <button
              type="submit"
              className="relative flex items-center justify-center w-10 h-10 focus:ring-primary/5"
            >
              <MagnifyingGlassIcon className="text-white" />
            </button>
          </Form>
          <AccountLink className="relative flex items-center justify-center w-10 h-10 focus:ring-primary/5" />
          <CartCount isHome={isHome} openCart={openCart} />
        </div>
      </Navbar>
    </div>
  );
}

function AccountLink({className}: {className?: string}) {
  const rootData = useRootLoaderData();
  const isLoggedIn = rootData?.isLoggedIn;

  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <UserCircleIcon className="text-white" />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <UserIcon className="text-white" />
    </Link>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRootLoaderData();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <ShoppingCartIcon className="text-white" />
        <div
          className={`${
            dark ? '' : ''
          } absolute top-0 right-0 text-[0.925rem] font-semibold font-outfit h-5 lg:h-6 w-5 lg:w-6 flex items-center justify-center  text-center rounded-full border-1 text-black border-black bg-orange-300`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 lg:w-10 h-8 lg:h-10 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      <CountrySelector />
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project.
      </div>
    </Section>
  );
}

function FooterLink({item}: {item: ChildEnhancedMenuItem}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}: {menu?: EnhancedMenu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem: ChildEnhancedMenuItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
