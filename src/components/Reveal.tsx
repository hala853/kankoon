import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  className?: string;
}

export function Reveal({ children, width = '100%', delay = 0, className }: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ width, position: 'relative', overflow: 'hidden' }} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
