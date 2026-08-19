'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Search, Info } from 'lucide-react';
import { useWindowStore } from '@/store/windowStore';

interface MenuBarProps {
  onOpenSearch: () => void;
}

export default function MenuBar({ onOpenSearch }: MenuBarProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeUtility, setActiveUtility] = useState<'network' | 'clock' | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const windows = useWindowStore((state) => state.windows);
  const openApp = useWindowStore((state) => state.openApp);
  const closeApp = useWindowStore((state) => state.closeApp);
  const getFocusedWindow = useWindowStore((state) => state.getFocusedWindow);
  const openWindows = Object.values(windows).filter((window) => window.isOpen && !window.isMinimized);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setActiveUtility(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuEnter = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleUtilityClick = (utility: 'network' | 'clock') => {
    setActiveUtility(activeUtility === utility ? null : utility);
  };

  const menus = {
    File: ['New Window', 'Close Window'],
    Go: ['Home', 'Applications'],
    Window: openWindows.length > 0 ? openWindows.map((window) => window.title) : ['No Open Windows'],
    Help: ['Contact']
  };

  const handleItemClick = (menu: string, item: string) => {
    setActiveMenu(null);
    if (menu === 'Help' && item === 'Contact') {
      openApp('contact');
    }
    if (menu === 'Raksha' && item === 'Ask Raksha') {
      openApp('askraksha');
    }
    if (menu === 'File' && item === 'New Window') openApp('finder');
    if (menu === 'File' && item === 'Close Window') {
      const focused = getFocusedWindow();
      if (focused) closeApp(focused.id);
    }
    if (menu === 'Go' && item === 'Home') openApp('finder');
    if (menu === 'Go' && item === 'Applications') openApp('finder');
    if (menu === 'Window') {
      const target = openWindows.find((window) => window.title === item);
      if (target) openApp(target.id);
    }
  };

  return (
    <div ref={menuRef} className="menu-bar fixed top-0 left-0 right-0 h-7 z-50 flex items-center justify-between px-4 text-sm select-none shadow-sm text-white/90 font-medium">
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center space-x-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" />
          </svg>
          <div
            className="relative"
            onMouseEnter={() => handleMenuEnter('Raksha')}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button
              className={`px-3 py-1 rounded font-bold transition-colors ${activeMenu === 'Raksha' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              aria-haspopup="menu"
              aria-expanded={activeMenu === 'Raksha'}
              onClick={() => handleMenuClick('Raksha')}
            >
              Raksha
            </button>
            {activeMenu === 'Raksha' && (
              <div className="absolute top-full left-0 mt-0 w-48 py-1 rounded-lg border border-white/10 bg-[#1e1b4b]/90 backdrop-blur-xl shadow-2xl">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors"
                  onClick={() => handleItemClick('Raksha', 'Ask Raksha')}
                >
                  Ask Raksha
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {Object.entries(menus).map(([menu, items]) => (
            <div
              key={menu}
              className="relative"
              onMouseEnter={() => handleMenuEnter(menu)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={`px-3 py-1 rounded transition-colors ${activeMenu === menu ? 'bg-white/20' : 'hover:bg-white/10'}`}
                onClick={() => handleMenuClick(menu)}
              >
                {menu}
              </button>
              {activeMenu === menu && (
                <div className="absolute top-full left-0 mt-0 w-48 py-1 rounded-lg border border-white/10 bg-[#1e1b4b]/90 backdrop-blur-xl shadow-2xl">
                  {items.map((item, i) => (
                    <button
                      key={i}
                      disabled={item === 'No Open Windows'}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 disabled:hover:bg-transparent disabled:opacity-45 transition-colors"
                      onClick={() => handleItemClick(menu, item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div
          className="relative"
          onMouseEnter={() => setActiveUtility('network')}
          onMouseLeave={() => setActiveUtility(null)}
        >
          <button
            type="button"
            title="Portfolio Network"
            aria-label="Portfolio Network status"
            aria-expanded={activeUtility === 'network'}
            onClick={() => handleUtilityClick('network')}
            className={`p-2 rounded transition-colors ${activeUtility === 'network' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            <Wifi size={14} />
          </button>
          {activeUtility === 'network' && (
            <div className="absolute top-full right-0 mt-0 w-48 rounded-lg border border-white/10 bg-[#1e1b4b]/90 p-3 text-xs text-white/80 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">Portfolio Network</div>
                  <div className="mt-0.5 text-[11px] text-white/50">Decorative local status</div>
                </div>
                <div className="flex h-4 items-end gap-0.5" aria-label="Strong signal">
                  {[2, 3, 4, 5].map((height) => (
                    <span key={height} className="w-1 rounded-sm bg-emerald-300/80" style={{ height: `${height * 3}px` }} />
                  ))}
                </div>
              </div>
              <div className="mt-2 border-t border-white/10 pt-2 text-[11px] text-white/50">No network access required</div>
            </div>
          )}
        </div>
        <button onClick={onOpenSearch} className="hover:bg-white/10 p-2 rounded transition-colors">
          <Search size={14} />
        </button>
        <button onClick={() => openApp('about')} aria-label="Open About Raksha" className="hover:bg-white/10 p-2 rounded transition-colors"><Info size={14} /></button>
        <div
          className="relative"
          onMouseEnter={() => setActiveUtility('clock')}
          onMouseLeave={() => setActiveUtility(null)}
        >
          <button
            type="button"
            aria-label="Show portfolio date and time"
            aria-expanded={activeUtility === 'clock'}
            onClick={() => handleUtilityClick('clock')}
            className={`rounded px-2 py-1 transition-colors ${activeUtility === 'clock' ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            {time ? formatTime(time) : ''}
          </button>
          {activeUtility === 'clock' && (
            <div className="absolute top-full right-0 mt-0 w-56 rounded-lg border border-white/10 bg-[#1e1b4b]/90 p-3 text-xs text-white/80 backdrop-blur-xl shadow-2xl">
              <div className="font-semibold text-white">Portfolio workspace</div>
              <div className="mt-1 text-white/70">{time ? formatTime(time) : 'Local time unavailable'}</div>
              <div className="mt-2 border-t border-white/10 pt-2 text-[11px] text-white/50">Local workspace</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
