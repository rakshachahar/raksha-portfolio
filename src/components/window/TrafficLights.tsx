"use client";
import React from "react";

interface TrafficLightsProps {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

export function TrafficLights({ onClose, onMinimize, onMaximize }: TrafficLightsProps) {
  return (
    <div className="traffic-lights-group flex items-center gap-[8px] px-2 py-3 group relative cursor-pointer">
      {/* Close button */}
      <button
        onClick={onClose}
        className="traffic-light w-3 h-3 rounded-full flex items-center justify-center bg-[#ff5f57] border border-[#e0443e] overflow-hidden"
        title="Close"
      >
        <svg
          className="w-2 h-2 opacity-0 group-hover:opacity-100 text-[#4d0000]"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      {/* Minimize button */}
      <button
        onClick={onMinimize}
        className="traffic-light w-3 h-3 rounded-full flex items-center justify-center bg-[#ffbd2e] border border-[#dea123] overflow-hidden"
        title="Minimize"
      >
        <svg
          className="w-2 h-2 opacity-0 group-hover:opacity-100 text-[#5c4300]"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M20 12H4"></path>
        </svg>
      </button>

      {/* Maximize button */}
      <button
        onClick={onMaximize}
        className="traffic-light w-3 h-3 rounded-full flex items-center justify-center bg-[#28c840] border border-[#1aab29] overflow-hidden"
        title="Maximize"
      >
        <svg
          className="w-2 h-2 opacity-0 group-hover:opacity-100 text-[#004d09]"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
        </svg>
      </button>
    </div>
  );
}
