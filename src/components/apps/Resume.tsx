'use client';

import React, { useState } from 'react';
import { Download, ZoomIn, ZoomOut, ExternalLink } from 'lucide-react';

export default function Resume() {
  const resumeUrl = '/assets/resume/Raksha_Resume_.pdf';
  const [zoom, setZoom] = useState(100);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#323639]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#202124] border-b border-black/20 text-white shadow-md z-10">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium hidden sm:inline-block">Raksha_Resume_.pdf</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={resumeUrl}
            download
            className="p-1.5 hover:bg-white/10 rounded transition-colors flex items-center gap-2"
            title="Download"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm hidden sm:inline-block">Download</span>
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex justify-center bg-[#525659] p-4 relative">
        {hasError ? (
          <div className="flex flex-col items-center justify-center text-white space-y-4">
            <p>Resume preview unavailable.</p>
            <a
              href={resumeUrl}
              download
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        ) : (
          <div 
            className="relative bg-white shadow-2xl transition-transform duration-200 origin-top"
            style={{ 
              width: '100%', 
              maxWidth: '800px', 
              aspectRatio: '1/1.414',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center'
            }}
          >
            <iframe
              src={`${resumeUrl}#view=FitH`}
              className="absolute inset-0 w-full h-full border-0"
              title="Resume Preview"
              onError={() => setHasError(true)}
              onLoad={(e) => {
                // Basic check if iframe failed to load cross-origin or network error
                try {
                  const doc = (e.target as HTMLIFrameElement).contentDocument || (e.target as HTMLIFrameElement).contentWindow?.document;
                  if (!doc) setHasError(true);
                } catch {
                  // Ignore cross origin errors
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
