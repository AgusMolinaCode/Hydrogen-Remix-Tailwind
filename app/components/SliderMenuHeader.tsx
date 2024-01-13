import React from 'react';

const SliderMenuHeader = () => {
  return (
    <div className="flex items-center justify-center w-full animate-carousel h-12">
      {Array(20)
        .fill(0)
        .map((_, i) => (
          <p
            key={i}
            className="flex items-center justify-center w-full h-12 text-nowrap"
          >
            Envios gratios desde $25.000 pesos
          </p>
        ))}
    </div>
  );
};

export default SliderMenuHeader;
