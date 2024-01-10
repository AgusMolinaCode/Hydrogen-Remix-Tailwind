import React from 'react';
import {Button} from '@nextui-org/react';
import {Link} from '@remix-run/react/dist/components';
import {ChevronDoubleRightIcon} from '@heroicons/react/16/solid';

const HeroInfo = () => {
  return (
    <div
      style={{
        backgroundImage: `url('/image2.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '700px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div>
        <Button
          href="/products"
          className="bg-white text-black px-4 mt-[38rem] rounded-lg shadow-lg font-bold text-md"
        >
          Ver Coleccion
          <ChevronDoubleRightIcon className="w-8 h-8 ml-2 animate-fade animate-infinite animate-duration-[1500ms]" />
        </Button>
      </div>
    </div>
  );
};

export default HeroInfo;
