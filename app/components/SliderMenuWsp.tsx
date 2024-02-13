import {motion, useScroll, useTransform, useSpring} from 'framer-motion';

import {Link} from '.';

export default function SliderMenuWsp() {
  const {scrollYProgress} = useScroll();

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotateSpring = useSpring(rotate, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div className="relative">
      <div className="fixed bottom-2 right-2 z-50 w-[100px] sm:w-[120px] h-[100px] sm:h-[120px]">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full sm:viewBox[0 0 120 120]"
        >
          <defs>
            <path
              id="circlePath"
              d="M 50, 50 m -40, 0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0"
              className="sm:d[M 60, 60 m -48, 0 a 48,48 0 1,0 96,0 a 48,48 0 1,0 -96,0]"
            />
          </defs>
          <motion.text style={{rotate: rotateSpring}} fill="#fde4e6">
            <textPath
              xlinkHref="#circlePath"
              className="text-xs font-outfit text-rose-100 font-semibold tracking-tight"
            >
              whatsapp - whatsapp - whatsapp - whatsapp -
            </textPath>
          </motion.text>
          <Link
            to="https://wa.me/5491159474844"
            target="_blank"
            rel="noopener noreferrer"
          >
            <image
              href="/wsp.png"
              x="30"
              y="30"
              height="40px"
              width="40px"
              className="sm:x[40] sm:y[40]"
            />
          </Link>
        </svg>
      </div>
    </div>
  );
}
