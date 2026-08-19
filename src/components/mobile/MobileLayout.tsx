'use client';

import React, { useState } from 'react';
import { ChevronLeft, Sparkles, User, Briefcase, Code, Cpu, Trophy, Award, Users, Image, FileText, Mail, TerminalSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { About } from '../apps/About';
import { Experience } from '../apps/Experience';
import { Projects } from '../apps/Projects';
import Skills from '../apps/Skills';
import Achievements from '../apps/Achievements';
import Certifications from '../apps/Certifications';
import Community from '../apps/Community';
import Photos from '../apps/Photos';
import Resume from '../apps/Resume';
import Contact from '../apps/Contact';
import Terminal from '../apps/Terminal';
import AskRaksha from '../apps/AskRaksha';

const APP_MAP: Record<string, { component: React.ComponentType; label: string; icon: React.ReactNode }> = {
  about: { component: About, label: 'About', icon: <User size={22} /> },
  experience: { component: Experience, label: 'Experience', icon: <Briefcase size={22} /> },
  projects: { component: Projects, label: 'Projects', icon: <Code size={22} /> },
  skills: { component: Skills, label: 'Skills', icon: <Cpu size={22} /> },
  achievements: { component: Achievements, label: 'Awards', icon: <Trophy size={22} /> },
  certifications: { component: Certifications, label: 'Certs', icon: <Award size={22} /> },
  community: { component: Community, label: 'Community', icon: <Users size={22} /> },
  photos: { component: Photos, label: 'Photos', icon: <Image size={22} /> },
  resume: { component: Resume, label: 'Resume', icon: <FileText size={22} /> },
  contact: { component: Contact, label: 'Contact', icon: <Mail size={22} /> },
  terminal: { component: Terminal, label: 'Terminal', icon: <TerminalSquare size={22} /> },
  askraksha: { component: AskRaksha, label: 'Ask Raksha', icon: <Sparkles size={22} /> },
};

const APP_ORDER = ['about', 'projects', 'experience', 'skills', 'achievements', 'certifications', 'community', 'photos', 'resume', 'contact', 'terminal'];

export default function MobileLayout() {
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const ActiveComponent = activeApp ? APP_MAP[activeApp]?.component : null;

  return (
    <div className="fixed inset-0 bg-[#0a0a1a] text-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Identity */}
          <div className="text-center mt-10">
            <p className="text-white/50 text-sm mb-1">Hey, I&apos;m</p>
            <h1 className="text-4xl font-bold tracking-tight mb-1">Raksha Chahar</h1>
            <p className="text-white/50 text-sm">AI/ML &bull; Generative AI &bull; RAG &bull; Software</p>
          </div>

          {/* Ask Raksha */}
          <button
            onClick={() => setActiveApp('askraksha')}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 p-4 rounded-2xl shadow-lg active:scale-[0.97] transition-transform"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-lg">Ask Raksha</span>
          </button>

          {/* App Grid */}
          <div className="grid grid-cols-4 gap-x-4 gap-y-6 pt-2">
            {APP_ORDER.map((id) => {
              const app = APP_MAP[id];
              if (!app) return null;
              return (
                <button
                  key={id}
                  onClick={() => setActiveApp(id)}
                  className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 bg-white/8 rounded-2xl flex items-center justify-center text-white/70 shadow-sm border border-white/10">
                    {app.icon}
                  </div>
                  <span className="text-[11px] font-medium text-white/50">{app.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active App Overlay */}
      <AnimatePresence>
        {activeApp && ActiveComponent && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-0 z-50 bg-[#0a0a1a] flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#14142a] border-b border-white/8">
              <button
                onClick={() => setActiveApp(null)}
                className="p-1 rounded-lg text-blue-400 flex items-center gap-1"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </button>
              <span className="text-sm font-semibold text-white/80">
                {APP_MAP[activeApp]?.label}
              </span>
              <div className="w-14" />
            </div>
            <div className="flex-1 overflow-y-auto">
              <ActiveComponent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
