import React from 'react';
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from '@tabler/icons-react';

// import {cn} from '../../utils/cn';
import {BentoGrid, BentoGridItem} from '../components/ui/bento-grid';

export function BentoGridSecondDemo() {
  return (
    <div>
      <h1 className="font-racing text-5xl sm:text-6xl text-center text-rose-100">
        COLECCIONES
      </h1>
      <h2 className="font-racing text-3xl sm:text-4xl text-center text-gray-400 pb-12">
        Descubre nuestras colecciones
      </h2>
      <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[20rem]">
        {items.map((item, index) => (
          <BentoGridItem
            key={index}
            header={item.header}
            title={item.title}
            className={item.className}
          />
        ))}
      </BentoGrid>
    </div>
  );
}

const items = [
  {
    title: 'off-road',
    header: (
      <img
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
        src="/OFF-ROAD.webp"
        alt="Catalogo Motocross"
      />
    ),
    className: 'md:col-span-1',
  },
  {
    title: 'mas-vendidos',
    header: (
      <img
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
        src="/MAS-VENDIDO-1.webp"
        alt="Catalogo Mas Vendido"
      />
    ),
    className: 'md:col-span-2',
  },
  {
    title: 'touring',
    header: (
      <img
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
        src="/TOURING.webp"
        alt="Catalogo Touring"
      />
    ),
    className: 'md:col-span-2',
  },
  {
    title: 'repuestos usados',
    header: (
      <img
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
        src="/OFERTAS.webp"
        alt="Catalogo repuestos usados"
      />
    ),
    className: 'md:col-span-1',
  },
  {
    title: 'todos-los-productos',
    header: (
      <img
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
        src="/TODOS3.webp"
        alt="Catalogo Todos los Productos"
      />
    ),
    className: 'col-span-1 md:row-span-2',
  },
  {
    title: 'atv-utv',
    header: (
      <img
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
        src="/ATV_UTV.webp"
        alt="Catalogo ATV/UTV"
      />
    ),
    className: 'md:col-span-2',
  },
  {
    title: 'indumentaria',
    header: (
      <img
        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300 ease-in-out"
        src="/INDUMENTARIA.webp"
        alt="Catalogo Indumentaria"
      />
    ),
    className: 'md:col-span-2',
  },
];
