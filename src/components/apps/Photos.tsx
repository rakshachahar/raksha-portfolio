'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { galleryImages } from '@/data/portfolioData';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Photos() {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handlePrevious = useCallback(() => {
    if (currentIndex !== null) {
      setCurrentIndex((prev) => (prev! > 0 ? prev! - 1 : galleryImages.length - 1));
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex !== null) {
      setCurrentIndex((prev) => (prev! < galleryImages.length - 1 ? prev! + 1 : 0));
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setCurrentIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, handlePrevious, handleNext]);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {galleryImages.map((img, index) => (
          <div
            key={index}
            className="break-inside-avoid relative group cursor-pointer rounded-lg overflow-hidden border border-white/5 bg-white/5"
            onClick={() => setCurrentIndex(index)}
          >
            <img
              src={img.src}
              alt={img.label || `Gallery image ${index + 1}`}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {img.label && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="p-4 text-sm text-white font-medium w-full truncate">
                  {img.label}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {currentIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur flex items-center justify-center select-none"
          >
            <button
              onClick={() => setCurrentIndex(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              className="absolute left-4 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="relative max-w-7xl max-h-screen p-4 flex flex-col items-center justify-center w-full h-full" onClick={() => setCurrentIndex(null)}>
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={galleryImages[currentIndex].src}
                alt={galleryImages[currentIndex].label || `Gallery image ${currentIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                onClick={(e) => e.stopPropagation()}
              />
              {galleryImages[currentIndex].label && (
                <div className="mt-4 text-center text-gray-300 max-w-2xl px-4" onClick={(e) => e.stopPropagation()}>
                  {galleryImages[currentIndex].label}
                </div>
              )}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 text-white/50 text-sm">
              {currentIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
