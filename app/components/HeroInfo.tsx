import {Button} from '@nextui-org/react';
import React from 'react';

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
        <Button className="bg-white text-black px-4 mt-[38rem] rounded-lg shadow-lg">
          Shop Now
        </Button>
      </div>
    </div>
  );
};

export default HeroInfo;
