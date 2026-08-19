'use client';

import React, { useState } from 'react';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  accent?: string;
  isOpen?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export default function DesktopIcon({ icon, label, accent = '#70a7ff', isOpen = false, onClick, onDoubleClick }: DesktopIconProps) {
  const [selected, setSelected] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(true);
    onClick?.();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDoubleClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onDoubleClick?.();
    }
  };

  React.useEffect(() => {
    const handleGlobalClick = () => setSelected(false);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${label}`}
      className={`desktop-icon flex flex-col items-center justify-center w-24 p-2 rounded-lg cursor-pointer transition-all ${
        selected ? 'selected' : ''
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={`desktop-icon-shell ${isOpen ? 'is-open' : ''}`} style={{ '--icon-accent': accent } as React.CSSProperties}>
        <div className="desktop-icon-highlight" />
        {icon}
      </div>
      <span className="text-white text-xs font-medium text-center shadow-black drop-shadow-md px-1 bg-black/20 rounded">
        {label}
      </span>
    </div>
  );
}
