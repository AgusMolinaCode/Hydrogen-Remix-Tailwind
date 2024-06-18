import clsx from 'clsx';

export function Input({
  className = '',
  type,
  variant,
  ...props
}: {
  className?: string;
  type?: string;
  variant: 'search' | 'minisearch';
  [key: string]: any;
}) {
  const variants = {
    search:
      'bg-transparent px-0 py-2 text-heading w-full focus:ring-0 focus:bg-transparent focus:outline-none border-x-0 border-t-0 transition border-b-1 border-white focus:border-white',
    minisearch:
      'bg-transparent hidden md:inline-block text-left lg:text-right border-b transition border-white -mb-px border-x-0 border-t-0 appearance-none px-0 py-1 focus:ring-transparent focus:bg-transparent focus:outline-none placeholder:opacity-20 placeholder:text-inherit',
  };

  const styles = clsx(variants[variant], className);

  return <input type={type} {...props} className={styles} />;
}
