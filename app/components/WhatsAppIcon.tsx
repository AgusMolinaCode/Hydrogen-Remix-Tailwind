import {motion, useViewportScroll, useTransform} from 'framer-motion';

export default function WhatsAppIcon() {
  const {scrollYProgress} = useViewportScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <motion.a
      href="https://wa.me/1159474844"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-5 z-50 flex justify-center items-center"
    >
      <motion.img
        src="/wsp.png"
        alt="WhatsApp"
        className="w-10 sm:w-14 h-10 sm:h-14 object-cover"
      />
      <motion.span
        style={{rotate}}
        className="absolute"
      >
        WhatsApp
      </motion.span>
    </motion.a>
  );
}