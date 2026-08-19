"use client";
import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { useWindowStore } from "@/store/windowStore";

const SIDEBAR_ITEMS = [
  { id: "about", label: "About Raksha", icon: "User" },
  { id: "projects", label: "Projects", icon: "Briefcase" },
  { id: "experience", label: "Experience", icon: "FileText" },
  { id: "skills", label: "Skills", icon: "Code" },
  { id: "achievements", label: "Achievements", icon: "Trophy" },
  { id: "certifications", label: "Certifications", icon: "Award" },
  { id: "community", label: "Community", icon: "Users" },
  { id: "photos", label: "Photos", icon: "Image" },
  { id: "resume", label: "Resume", icon: "File" },
  { id: "contact", label: "Contact", icon: "Mail" },
];

export function Finder() {
  const { openApp } = useWindowStore();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleFolderDoubleCLick = (id: string) => {
    openApp(id);
  };

  const handleSidebarClick = (id: string) => {
    setActiveSection(id);
  };

  const renderIcon = (iconName: string, size = 18) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Folder;
    return <Icon size={size} />;
  };

  return (
    <div className="flex h-full w-full bg-black/20 text-white/90">
      {/* Sidebar */}
      <div className="w-[220px] bg-black/40 border-r border-white/10 flex flex-col backdrop-blur-md">
        <div className="px-4 py-3 text-xs font-semibold text-white/50 uppercase tracking-wider">
          Favorites
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSidebarClick(item.id)}
              onDoubleClick={() => handleFolderDoubleCLick(item.id)}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                activeSection === item.id ? "bg-white/20 text-white" : "hover:bg-white/10 text-white/80"
              }`}
            >
              <div className="text-blue-400">{renderIcon(item.icon, 16)}</div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e]/80">
        <div className="h-12 border-b border-white/10 flex items-center px-4 gap-4 backdrop-blur-sm bg-black/20">
          <button 
            onClick={() => setActiveSection(null)}
            className="p-1 rounded-md hover:bg-white/10 text-white/70"
            disabled={!activeSection}
          >
            <LucideIcons.ChevronLeft size={20} className={!activeSection ? "opacity-30" : ""} />
          </button>
          <button 
            className="p-1 rounded-md hover:bg-white/10 text-white/70"
            disabled={true}
          >
            <LucideIcons.ChevronRight size={20} className="opacity-30" />
          </button>
          <span className="text-sm font-medium">
            {activeSection ? SIDEBAR_ITEMS.find((i) => i.id === activeSection)?.label : "Home"}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!activeSection ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-6">
              {SIDEBAR_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => handleSidebarClick(item.id)}
                  onDoubleClick={() => handleFolderDoubleCLick(item.id)}
                >
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    {renderIcon(item.icon, 32)}
                  </div>
                  <span className="text-xs text-center font-medium line-clamp-2 px-1 text-white/90 group-hover:bg-blue-500/30 rounded px-2">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
              {renderIcon(SIDEBAR_ITEMS.find((i) => i.id === activeSection)?.icon || "Folder", 64)}
              <h3 className="mt-4 text-xl font-medium text-white/90">
                {SIDEBAR_ITEMS.find((i) => i.id === activeSection)?.label}
              </h3>
              <p className="mt-2 text-sm">Double click in sidebar to open full app.</p>
              <button 
                className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                onClick={() => handleFolderDoubleCLick(activeSection)}
              >
                Open App
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
