import React from 'react';
import {ChevronDoubleRightIcon} from '@heroicons/react/16/solid';
import {Button} from '@nextui-org/react';
import {Link} from '@remix-run/react/dist/components';
import {motion} from 'framer-motion';

import {BackgroundGradient} from '../components/ui/background-gradient';
import {fadeIn, slideIn, staggerContainer, textVariant} from '../utils/motion';

const HeroTwo = () => {
  return (
    <motion.div
      variants={staggerContainer(1, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{once: false, amount: 0.25}}
      className="ImageTwo flex items-center justify-center h-full px-2"
    >
      <BackgroundGradient className="rounded-[22px] bg-black/10">
        <div className="flex flex-col h-[350px] sm:h-[400px] items-center justify-center mx-auto bg-black/80 border-1 border-gray-700 p-2 rounded-3xl">
          <motion.h1
            variants={textVariant(0.25)}
            className="text-4xl sm:text-[4rem] font-racing text-center text-red-200  font-bold"
          >
            Repuestos Usados
          </motion.h1>
          <motion.p
            variants={fadeIn('right', 'spring', 0.2, 0.7)}
            className="font-Righteous font-semibold text-lg sm:text-xl max-w-lg flex justify-center mx-auto text-center pt-8 text-rose-100"
          >
            Importamos repuestos usados de motos de alta calidad, con garantía y
            a un precio accesible. Encuentra lo que necesitas para tu moto en
            nuestra colección de repuestos usados.
            <br />
          </motion.p>
          <motion.div
            variants={fadeIn('left', 'tween', 0.2, 0.7)}
            className="flex flex-wrap justify-center mx-auto gap-4 pt-6 sm:pt-10"
          >
            <Link to="/collections/ofertas">
              <Button className="bg-black/20 backdrop-blur-xl text-rose-100 px-3 sm:px-6 rounded-2xl shadow-lg font-bold font-Righteous text-lg sm:text-xl py-6 border border-rose-100 animate-fade-up animate-duration-300 delay-500">
                Ver Coleccion
                <ChevronDoubleRightIcon className="w-6 sm:w-8 h-6 sm:h-8 ml-2 animate-fade animate-infinite animate-duration-[600ms]" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </BackgroundGradient>
    </motion.div>
  );
};

export default HeroTwo;
