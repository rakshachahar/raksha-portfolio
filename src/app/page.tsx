'use client';

import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/mobile/MobileLayout';
// Mock import of Desktop component as it wasn't specified to create it, but page.tsx requires it
// Assuming Desktop is at '@/components/desktop/Desktop' or similar. 
import Desktop from '@/components/desktop/Desktop';

export default function Page() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Listener for window resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Avoid hydration mismatch by rendering nothing until mounted
  if (isMobile === null) {
    return <div className="min-h-screen bg-black" />;
  }

  return isMobile ? <MobileLayout /> : <Desktop />;
}
