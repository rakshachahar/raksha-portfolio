'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Code, Bot, Brain, LayoutTemplate, Wrench, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, LucideIcon> = {
  Programming: Code,
  GenAI: Bot,
  NLP: Brain,
  ML: LayoutTemplate,
  Tools: Wrench,
};

const colorMap: Record<string, string> = {
  Programming: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
  GenAI: 'border-violet-500/50 bg-violet-500/10 text-violet-400',
  NLP: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
  ML: 'border-pink-500/50 bg-pink-500/10 text-pink-400',
  Tools: 'border-green-500/50 bg-green-500/10 text-green-400',
};

export default function Skills() {
  const { skills } = portfolioData;

  return (
    <div className="p-6 h-full overflow-y-auto text-gray-200">
      <h2 className="sr-only">Skills & Expertise</h2>
      <div className="space-y-8">
        {skills.map((category) => {
          const Icon = iconMap[category.category] || Code;
          const colorClass = colorMap[category.category] || 'border-gray-500/50 bg-gray-500/10 text-gray-400';

          return (
            <div key={category.category} className="space-y-4">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium">{category.category}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {category.items.map((skill) => (
                  <motion.div
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-2 rounded-full border ${colorClass} text-sm font-medium cursor-default transition-shadow hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
