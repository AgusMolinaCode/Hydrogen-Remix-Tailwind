import React from 'react';
import {Button} from '@nextui-org/react';
import {Link} from '@remix-run/react/dist/components';
import {ChevronDoubleRightIcon} from '@heroicons/react/16/solid';

const HeroInfo = () => {
  return (
    <div className="hero-info">
      <div>
        <Link to="/products">
          <Button className="bg-white text-black px-4 mt-[22rem] md:mt-[35rem] rounded-lg shadow-lg font-bold font-Righteous text-md">
            Ver Coleccion
            <ChevronDoubleRightIcon className="w-8 h-8 ml-2 animate-fade animate-infinite animate-duration-[1500ms]" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroInfo;
