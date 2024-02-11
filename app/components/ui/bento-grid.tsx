import clsx from 'clsx';

import {Link} from '../Link';
import {cn} from '../../utils/cn';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'grid md:auto-rows-[12rem] sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto mb-16 px-1',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 overflow-hidden',
        className,
      )}
    >
      <div
        className={clsx('w-full h-full flex justify-center overflow-hidden', {
          'items-center': className?.includes('col-span-2'),
        })}
      >
        <Link to={`/collections/${title}`}>
          <div className="object-center object-cover w-full h-full">
            {header}
          </div>
        </Link>
      </div>
    </div>
  );
};
