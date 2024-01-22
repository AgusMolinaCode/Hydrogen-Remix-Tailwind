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
    <div className="parallax">
      <motion.div className="scroller w-full" style={{x}}>
        {[...Array(30)].map((_, i) => (
          <p
            key={i}
            className="text-[10rem] sm:text-[18rem] tracking-normal flex items-center justify-center  font-racing bg-gray-600/25 bg-clip-text text-transparent pr-2"
          >
            {children}{' '}
          </p>
        ))}
      </motion.div>
    </div>
  );
}

export default function SliderMenuFooter() {
  return (
    <section>
      <ParallaxText baseVelocity={15}>AM MOTOS ⁃</ParallaxText>
    </section>
  );
}
