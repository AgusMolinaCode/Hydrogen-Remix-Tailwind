import '../styles/app.css';
import {useRef} from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion';
import {wrap} from '@motionone/utils';

interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

function ParallaxText({children, baseVelocity = 80}: ParallaxProps) {
  const baseX = useMotionValue(0);
  const {scrollY} = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 500], [0, 5], {
    clamp: false,
  });

  /**
   * This is a magic wrapping for the length of the text - you
   * have to replace for wrapping that works for you or dynamically
   * calculate
   */
  const x = useTransform(baseX, (v) => `${wrap(-0, -200, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    /**
     * This is what changes the direction of the scroll once we
     * switch scrolling directions.
     */
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  /**
   * The number of times to repeat the child text should be dynamically calculated
   * based on the size of the text and viewport. Likewise, the x motion value is
   * currently wrapped between -20 and -45% - this 25% is derived from the fact
   * we have four children (100% / 4). This would also want deriving from the
   * dynamically generated number of children.
   */
  return (
    <div className="parallax bg-rose-500">
      <motion.div className="scroller w-full" style={{x}}>
        {[...Array(30)].map((_, i) => (
          <p
            key={i}
            className="text-base sm:text-lg tracking-normal flex items-center text-gray-600 justify-center m-1 font-Righteous"
          >
            {children}{' '}
            <span className="font-bold text-base sm:text-lg ml-1 font-Righteous tracking-normal text-gray-900">
              $50.000 pesos
            </span>
          </p>
        ))}
      </motion.div>
    </div>
  );
}

export default function SliderMenuHeader() {
  return (
    <section>
      <ParallaxText baseVelocity={6}>
        Envios gratis en compras mayores a
      </ParallaxText>
    </section>
  );
}
