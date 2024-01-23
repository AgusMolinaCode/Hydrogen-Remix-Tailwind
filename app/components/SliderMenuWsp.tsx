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
import {Link} from '.';

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
  const x = useTransform(baseX, (v) => `${wrap(-0, -600, v)}%`);

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

  return (
    <div className="parallax-two">
      <motion.div
        className="scroller-two fixed bottom-5 right-4 rounded-full"
        style={{x}}
      >
        {[...Array(30)].map((_, i) => (
          <p
            key={i}
            className="text-sm tracking-normal flex rounded-full items-center  text-gray-100  font-Righteous"
          >
            {children}{' '}
          </p>
        ))}
      </motion.div>
    </div>
  );
}

export default function SliderMenuWsp() {
  return (
    <div className="w-32 h-32 rounded-full">
      <Link
        to="https://wa.me/1159474844"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-5 z-50"
      >
        <img
          src="/wsp.png"
          alt="WhatsApp icon"
          className="w-10 sm:w-14 h-10 sm:h-14 object-cover"
        />
        <ParallaxText baseVelocity={20}>Whatsapp</ParallaxText>
      </Link>
    </div>
  );
}
