'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionStyle } from 'framer-motion';
import { Folder, User, Code, Briefcase, Cpu, Trophy, Award, Users, FileText, Terminal, Sparkles } from 'lucide-react';
import { useWindowStore } from '@/store/windowStore';

const DOCK_ITEMS = [
  { id: 'finder', label: 'Finder', accent: '#5b9dff', icon: Folder },
  { id: 'about', label: 'About', accent: '#ad83e8', icon: User },
  { id: 'projects', label: 'Projects', accent: '#45c99a', icon: Code },
  { id: 'experience', label: 'Experience', accent: '#d68a63', icon: Briefcase },
  { id: 'skills', label: 'Skills', accent: '#61b9d0', icon: Cpu },
  { id: 'achievements', label: 'Achievements', accent: '#e2b94f', icon: Trophy },
  { id: 'certifications', label: 'Certifications', accent: '#e89b59', icon: Award },
  { id: 'community', label: 'Community', accent: '#53c8d1', icon: Users },
  { id: 'resume', label: 'Resume', accent: '#ef746d', icon: FileText },
  { id: 'terminal', label: 'Terminal', accent: '#9ca8b8', icon: Terminal },
  { id: 'askraksha', label: 'Ask Raksha', accent: '#8f7cf2', icon: Sparkles, special: true },
];

function DockItem({ item, mouseX }: { item: any; mouseX: any }) {
  const windows = useWindowStore((s) => s.windows);
  const openApp = useWindowStore((s) => s.openApp);
  const isOpen = windows[item.id]?.isOpen ?? false;
  const [isHovered, setIsHovered] = useState(false);
  
  const ref = React.useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const baseWidth = item.special ? 112 : 48;
  const magnifiedWidth = item.special ? 136 : 72;
  const widthSync = useTransform(distance, [-150, 0, 150], [baseWidth, magnifiedWidth, baseWidth]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative flex flex-col items-center">
      {isHovered && (
        <div className="absolute -top-10 px-3 py-1 bg-black/50 text-white text-xs rounded-md backdrop-blur-md whitespace-nowrap z-50">
          {item.label}
        </div>
      )}
      <motion.button
        ref={ref}
        whileHover={{ y: -4, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        className={`dock-icon relative flex items-center justify-center gap-2 ${item.special ? 'dock-icon-special px-3' : ''} ${isOpen ? 'is-open' : ''}`}
        style={{ width, height: item.special ? 48 : width, '--icon-accent': item.accent } as MotionStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => openApp(item.id)}
      >
        <span className="dock-icon-highlight" />
        <item.icon className="relative z-10 w-1/2 h-1/2 text-white" />
        {item.special && <span className="relative z-10 text-[11px] font-semibold text-white whitespace-nowrap">{item.label}</span>}
      </motion.button>
      <div className={`mt-1 w-1 h-1 rounded-full ${isOpen ? 'bg-white' : 'bg-transparent'}`} />
    </div>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div 
        className="dock flex items-end gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/10 shadow-2xl"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {DOCK_ITEMS.map((item) => (
          <DockItem key={item.id} item={item} mouseX={mouseX} />
        ))}
      </div>
    </div>
  );
}
