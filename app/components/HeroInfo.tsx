import React from 'react';
import {Button} from '@nextui-org/react';
import {Link} from '@remix-run/react/dist/components';
import {ChevronDoubleRightIcon} from '@heroicons/react/16/solid';

import SliderMenuHeader from './SliderMenuHeader';

const HeroInfo = () => {
  return (
    <div className="hero-info">
      <div>
        <Link to="/collections/todos-los-productos">
          <Button className="bg-black/20 backdrop-blur-xl text-rose-100 px-6 mt-[22rem] md:mt-[35rem] rounded-2xl shadow-lg font-bold font-Righteous text-xl py-6 border border-rose-100 animate-fade-up animate-duration-[600ms] animate-delay-[600ms]">
            Ver Coleccion
            <ChevronDoubleRightIcon className="w-8 h-8 ml-2 animate-fade animate-infinite animate-duration-[600ms]" />
          </Button>
        </Link>
        <div className="absolute bottom-0 left-0 w-full">
          <SliderMenuHeader />
        </div>
      </div>
    </div>
  );
};

export default HeroInfo;
