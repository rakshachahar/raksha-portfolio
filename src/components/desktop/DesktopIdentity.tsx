'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

export default function DesktopIdentity() {
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 120, damping: 24, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 120, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (shouldReduceMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = heroRef.current?.getBoundingClientRect();
      if (!bounds) return;
      x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 6);
      y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 4);
    };
    const handlePointerLeave = () => {
      x.set(0);
      y.set(0);
    };

    const hero = heroRef.current;
    hero?.addEventListener('pointermove', handlePointerMove);
    hero?.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      hero?.removeEventListener('pointermove', handlePointerMove);
      hero?.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [shouldReduceMotion, x, y]);

  return (
    <div ref={heroRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <motion.div
        className="hero-identity flex flex-col items-center pointer-events-none select-none"
        style={{ x, y }}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
      <motion.h2
        className="hero-kicker pointer-events-auto text-xl font-light text-white/70 mb-2 drop-shadow-lg"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.04, y: -1 }}
      >
        Hey, I&apos;m
      </motion.h2>
      <motion.h1
        className="hero-name pointer-events-auto text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl text-center"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.06, y: -2 }}
      >
        RAKSHA
      </motion.h1>
      <motion.p
        className="hero-subtitle pointer-events-auto text-xs md:text-sm text-white/65 uppercase font-medium drop-shadow-lg text-center px-4"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -1 }}
      >
        AI/ML • GENERATIVE AI • RAG • SOFTWARE DEVELOPMENT
      </motion.p>
      </motion.div>
    </div>
  );
}
