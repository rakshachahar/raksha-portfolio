"use client";
import React from "react";
import { useWindowStore } from "@/store/windowStore";
import { Window } from "./Window";

// Import all app components
import { About } from "@/components/apps/About";
import { Finder } from "@/components/apps/Finder";
import { Projects } from "@/components/apps/Projects";
import { Experience } from "@/components/apps/Experience";
import Skills from "@/components/apps/Skills";
import Achievements from "@/components/apps/Achievements";
import Certifications from "@/components/apps/Certifications";
import Community from "@/components/apps/Community";
import Photos from "@/components/apps/Photos";
import Resume from "@/components/apps/Resume";
import Contact from "@/components/apps/Contact";
import Terminal from "@/components/apps/Terminal";
import AskRaksha from "@/components/apps/AskRaksha";

const APP_COMPONENTS: Record<string, React.ComponentType> = {
  Finder,
  About,
  Projects,
  Experience,
  Skills,
  Achievements,
  Certifications,
  Community,
  Photos,
  Resume,
  Contact,
  Terminal,
  AskRaksha,
};

export default function WindowManager() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <>
      {Object.values(windows)
        .filter((w) => w.isOpen)
        .map((win) => {
          const AppComponent = APP_COMPONENTS[win.component];
          return (
            <Window key={win.id} windowId={win.id}>
              {AppComponent ? <AppComponent /> : <div className="p-8 text-center text-white/60">App not found: {win.component}</div>}
            </Window>
          );
        })}
    </>
  );
}
