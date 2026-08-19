'use client';

import React, { useState, useEffect } from 'react';
import Wallpaper from './Wallpaper';
import MenuBar from './MenuBar';
import DesktopIcon from './DesktopIcon';
import DesktopIdentity from './DesktopIdentity';
import Dock from './Dock';
import BootScreen from './BootScreen';
import WindowManager from '@/components/window/WindowManager';
import GlobalSearch from '@/components/search/GlobalSearch';
import { useWindowStore } from '@/store/windowStore';
import { Folder, Code, FileText, User, Trophy, Award, Users, Terminal, Sparkles } from 'lucide-react';

const DESKTOP_ICONS = [
  { id: 'projects', label: 'Portfolio', accent: '#5b9dff', icon: <Folder className="text-blue-300 w-10 h-10" /> },
  { id: 'projects', label: 'Projects', accent: '#45c99a', icon: <Code className="text-emerald-300 w-10 h-10" /> },
  { id: 'resume', label: 'Resume.pdf', accent: '#ef746d', icon: <FileText className="text-red-300 w-10 h-10" /> },
  { id: 'about', label: 'About Raksha', accent: '#ad83e8', icon: <User className="text-purple-300 w-10 h-10" /> },
  { id: 'achievements', label: 'Achievements', accent: '#e2b94f', icon: <Trophy className="text-yellow-300 w-10 h-10" /> },
  { id: 'certifications', label: 'Certifications', accent: '#e89b59', icon: <Award className="text-orange-300 w-10 h-10" /> },
  { id: 'community', label: 'Community', accent: '#53c8d1', icon: <Users className="text-cyan-300 w-10 h-10" /> },
  { id: 'terminal', label: 'Terminal', accent: '#9ca8b8', icon: <Terminal className="text-gray-300 w-10 h-10" /> },
  { id: 'askraksha', label: 'Ask Raksha', accent: '#e783b7', icon: <Sparkles className="text-pink-300 w-10 h-10" /> },
];

export default function Desktop() {
  const [booted, setBooted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openApp = useWindowStore((state) => state.openApp);
  const windows = useWindowStore((state) => state.windows);

  useEffect(() => {
    if (sessionStorage.getItem('hasBooted')) {
      setBooted(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}
      
      {booted && (
        <>
          <Wallpaper />
          <MenuBar onOpenSearch={() => setSearchOpen(true)} />
          
          <div className="absolute top-[var(--menu-bar-height)] left-0 right-0 bottom-0 overflow-hidden p-4 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-fit items-start justify-start grid-flow-col auto-cols-max grid-rows-6">
              {DESKTOP_ICONS.map((icon, index) => (
                <DesktopIcon
                  key={index}
                  icon={icon.icon}
                  label={icon.label}
                  accent={icon.accent}
                  isOpen={windows[icon.id]?.isOpen ?? false}
                  onDoubleClick={() => openApp(icon.id)}
                />
              ))}
            </div>
          </div>

          <DesktopIdentity />
          <WindowManager />
          <Dock />
          
          {searchOpen && (
            <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-start pt-32 justify-center" onClick={() => setSearchOpen(false)}>
              <div onClick={e => e.stopPropagation()}>
                <GlobalSearch onClose={() => setSearchOpen(false)} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
