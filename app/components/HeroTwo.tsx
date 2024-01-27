import React from 'react';
import {ChevronDoubleRightIcon} from '@heroicons/react/16/solid';
import {Button} from '@nextui-org/react';
import {Link} from '@remix-run/react/dist/components';

const HeroTwo = () => {
  return (
    <div className="ImageTwo flex items-center justify-center h-full px-2">
      <div className="flex flex-col h-[350px] sm:h-[400px] items-center justify-center mx-auto bg-black/80 border-1 border-gray-700 p-2 rounded-3xl">
        <h1 className="text-6xl sm:text-[8rem] font-racing text-center text-red-200  font-bold">
          Ofertas
        </h1>
        <p className="font-Righteous font-semibold text-2xl sm:text-3xl max-w-lg flex justify-center mx-auto text-center pt-8 text-rose-100">
          Hasta 50% de descuento en productos seleccionados. <br />
        </p>
        <div className="flex flex-wrap justify-center mx-auto gap-4 pt-6 sm:pt-10">
          <Link to="/collections/ofertas">
            <Button className="bg-black/20 backdrop-blur-xl text-rose-100 px-3 sm:px-6 rounded-2xl shadow-lg font-bold font-Righteous text-lg sm:text-xl py-6 border border-rose-100 animate-fade-up animate-duration-300 delay-500">
              Ver Coleccion
              <ChevronDoubleRightIcon className="w-6 sm:w-8 h-6 sm:h-8 ml-2 animate-fade animate-infinite animate-duration-[1500ms]" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroTwo;
