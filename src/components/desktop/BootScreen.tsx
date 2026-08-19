'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootScreenProps {
  onComplete: () => void;
}

const loadingTexts = [
  'Initializing workspace...',
  'Loading portfolio...',
  'Loading projects...',
  'Initializing Ask Raksha...',
  'Ready.'
];

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('hasBooted')) {
      onComplete();
      return;
    }

    const textInterval = setInterval(() => {
      setTextIndex(prev => {
        if (prev < loadingTexts.length - 1) return prev + 1;
        clearInterval(textInterval);
        return prev;
      });
    }, 300); // 300ms per text step

    const completeTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        sessionStorage.setItem('hasBooted', 'true');
        onComplete();
      }, 500);
    }, 2000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  if (sessionStorage.getItem('hasBooted') && isVisible) {
    return null; // Don't render anything if already booted
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-white"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-[0.2em] mb-8">RAKSHA</h1>
            <div className="h-6 flex items-center justify-center">
              <p className="text-sm text-gray-400">
                {loadingTexts[textIndex]}
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-48 h-1 bg-gray-800 rounded-full mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
