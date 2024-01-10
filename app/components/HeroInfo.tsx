import React from 'react';

const HeroInfo = () => {
  return (
    <div
      style={{
        backgroundImage: `url('/image.webp')`,
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
        <button className="bg-white text-black px-4 py-2 rounded-lg shadow-lg absolute bottom-5 left-auto right-auto">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default HeroInfo;
