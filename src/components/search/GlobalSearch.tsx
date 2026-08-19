'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { searchIndex } from '@/data/portfolioData';
import { useWindowStore } from '@/store/windowStore';
import { motion } from 'framer-motion';

interface GlobalSearchProps {
  onClose: () => void;
}

export default function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const openApp = useWindowStore((state) => state.openApp);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const lowerQ = query.toLowerCase().trim();
  const results = lowerQ
    ? searchIndex.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQ) ||
          item.keywords.some((k) => k.includes(lowerQ))
      ).slice(0, 20)
    : [];

  const groupedResults = results.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, typeof results>);

  const handleSelect = (appId: string, subRoute?: string) => {
    openApp(appId, subRoute);
    onClose();
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: -10 }}
      transition={{ duration: 0.15 }}
      className="spotlight w-[600px] max-w-[90vw] flex flex-col max-h-[60vh]"
    >
      <div className="flex items-center px-4 py-3 border-b border-white/10">
        <Search className="w-5 h-5 text-white/40 mr-3 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search portfolio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-lg text-white outline-none placeholder-white/30"
        />
      </div>

      <div className="overflow-y-auto flex-1 p-2">
        {!lowerQ ? (
          <div className="p-6 text-center text-white/30 text-sm">
            Search projects, skills, experience, achievements...
          </div>
        ) : Object.keys(groupedResults).length > 0 ? (
          Object.entries(groupedResults).map(([category, items]) => (
            <div key={category} className="mb-3">
              <div className="px-3 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                {category}
              </div>
              {items.map((item, idx) => (
                <button
                  key={`${item.appId}-${idx}`}
                  onClick={() => handleSelect(item.appId, item.subRoute)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/10 text-white/80 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-[11px] px-2 py-0.5 bg-white/5 rounded text-white/30 group-hover:text-white/50">
                    Open
                  </span>
                </button>
              ))}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-white/30 text-sm">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}
      </div>

      {lowerQ && (
        <div className="p-2 border-t border-white/10">
          <button
            onClick={() => { openApp('askraksha'); onClose(); }}
            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-violet-500/15 text-violet-300 transition-colors flex items-center gap-3 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Raksha about &ldquo;{query}&rdquo;</span>
          </button>
        </div>
      )}
    </motion.div>
  );
}
