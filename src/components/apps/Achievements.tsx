'use client';

import React, { useState } from 'react';
import { portfolioData, type Achievement } from '@/data/portfolioData';
import { Trophy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Achievements() {
  const { achievements } = portfolioData;
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  return (
    <div className="p-6 h-full overflow-y-auto text-gray-200 relative">
      <h2 className="sr-only">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 cursor-pointer hover:border-white/20 transition-colors"
            onClick={() => setSelectedAchievement(achievement)}
          >
            {achievement.image ? (
              <>
                <div className="aspect-video w-full bg-black/50 relative overflow-hidden">
                  <img
                    src={achievement.image}
                    alt={achievement.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <h3 className="text-lg font-semibold">{achievement.title}</h3>
                  </div>
                </div>
              </>
            ) : (
              <div className="aspect-video w-full flex flex-col items-center justify-center p-6 text-center">
                <Trophy className="w-12 h-12 text-yellow-500 mb-3" />
                <h3 className="text-lg font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{achievement.organization}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <h3 className="text-xl font-semibold">{selectedAchievement.title}</h3>
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="overflow-y-auto p-6 space-y-4">
                {selectedAchievement.image && (
                  <img
                    src={selectedAchievement.image}
                    alt={selectedAchievement.title}
                    className="w-full rounded-lg mb-4 object-contain max-h-[40vh]"
                  />
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Organization</p>
                    <p className="font-medium">{selectedAchievement.organization}</p>
                  </div>
                  {selectedAchievement.location && (
                    <div>
                      <p className="text-gray-400">Location</p>
                      <p className="font-medium">{selectedAchievement.location}</p>
                    </div>
                  )}
                  {selectedAchievement.track && (
                    <div>
                      <p className="text-gray-400">Track</p>
                      <p className="font-medium">{selectedAchievement.track}</p>
                    </div>
                  )}
                  {selectedAchievement.team && (
                    <div>
                      <p className="text-gray-400">Team</p>
                      <p className="font-medium">{selectedAchievement.team}</p>
                    </div>
                  )}
                  {selectedAchievement.scale && (
                    <div>
                      <p className="text-gray-400">Scale</p>
                      <p className="font-medium">{selectedAchievement.scale}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
