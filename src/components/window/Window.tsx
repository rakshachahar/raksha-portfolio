"use client";
import React, { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  getWindowWorkspace,
  WINDOW_MIN_HEIGHT,
  WINDOW_MIN_WIDTH,
  useWindowStore,
} from "@/store/windowStore";
import { TrafficLights } from "./TrafficLights";
import {
  Folder, User, Code, Briefcase, Cpu, Trophy, Award, Users,
  Image, FileText, Mail, TerminalSquare, Sparkles
} from "lucide-react";

interface WindowProps {
  windowId: string;
  children: React.ReactNode;
}

const ICON_MAP: Record<string, LucideIcon> = {
  folder: Folder,
  user: User,
  code: Code,
  briefcase: Briefcase,
  cpu: Cpu,
  trophy: Trophy,
  award: Award,
  users: Users,
  image: Image,
  "file-text": FileText,
  mail: Mail,
  terminal: TerminalSquare,
  sparkles: Sparkles,
};

export function Window({ windowId, children }: WindowProps) {
  const win = useWindowStore((s) => s.windows[windowId]);
  const closeApp = useWindowStore((s) => s.closeApp);
  const minimizeApp = useWindowStore((s) => s.minimizeApp);
  const maximizeApp = useWindowStore((s) => s.maximizeApp);
  const focusApp = useWindowStore((s) => s.focusApp);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);

  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

  if (!win || !win.isOpen || win.isMinimized) {
    return null;
  }

  const IconComponent = ICON_MAP[win.icon] || FileText;
  const workspace = getWindowWorkspace();
  const boundedWidth = Math.min(win.width, workspace.width);
  const boundedHeight = Math.min(win.height, workspace.height);
  const boundedX = Math.min(workspace.right - boundedWidth, Math.max(workspace.left, win.x));
  const boundedY = Math.min(workspace.bottom - boundedHeight, Math.max(workspace.top, win.y));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (win.isMaximized) return;
    if ((e.target as HTMLElement).closest(".traffic-lights-group")) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    focusApp(windowId);

    setDragOffset({
      x: e.clientX - boundedX,
      y: e.clientY - boundedY,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const maxX = Math.max(workspace.left, workspace.right - boundedWidth);
    const maxY = Math.max(workspace.top, workspace.bottom - boundedHeight);
    const newX = Math.min(maxX, Math.max(workspace.left, e.clientX - dragOffset.x));
    const newY = Math.min(maxY, Math.max(workspace.top, e.clientY - dragOffset.y));
    updatePosition(windowId, newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const handleResizeStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (win.isMaximized) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    focusApp(windowId);
    resizeStart.current = { x: e.clientX, y: e.clientY, width: boundedWidth, height: boundedHeight };
    setIsResizing(true);
  };

  const handleResizeMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isResizing) return;
    const maxWidth = workspace.right - boundedX;
    const maxHeight = workspace.bottom - boundedY;
    const minWidth = Math.min(WINDOW_MIN_WIDTH, workspace.width);
    const minHeight = Math.min(WINDOW_MIN_HEIGHT, workspace.height);
    updateSize(
      windowId,
      Math.min(maxWidth, Math.max(minWidth, resizeStart.current.width + e.clientX - resizeStart.current.x)),
      Math.min(maxHeight, Math.max(minHeight, resizeStart.current.height + e.clientY - resizeStart.current.y)),
    );
  };

  const handleResizeEnd = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setIsResizing(false);
  };

  const style: React.CSSProperties = win.isMaximized
    ? { left: workspace.left, top: workspace.top, width: workspace.width, height: workspace.height, zIndex: win.zIndex, borderRadius: 0 }
    : { left: boundedX, top: boundedY, width: boundedWidth, height: boundedHeight, maxWidth: workspace.width, maxHeight: workspace.height, zIndex: win.zIndex, borderRadius: 12 };

  return (
    <motion.div
      ref={windowRef}
      className={`window fixed flex flex-col ${win.isFocused ? "focused" : "unfocused"}`}
      style={style}
      initial={{ scale: 0.88, opacity: 0, filter: "blur(4px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30, duration: 0.2 }}
      onClick={() => focusApp(windowId)}
    >
      {/* Title bar */}
      <div
        className="window-titlebar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={() => maximizeApp(windowId)}
        style={{ cursor: isDragging ? "grabbing" : "default" }}
      >
        <div className="flex items-center gap-2 mr-auto">
          <TrafficLights
            onClose={() => closeApp(windowId)}
            onMinimize={() => minimizeApp(windowId)}
            onMaximize={() => maximizeApp(windowId)}
          />
        </div>

        <div className="absolute inset-0 flex justify-center items-center gap-2 pointer-events-none">
          <IconComponent size={14} className="text-white/60" />
          <span className="text-[13px] font-medium text-white/80">{win.title}</span>
        </div>
      </div>

      {/* Content area */}
      <div className="window-content flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
      {!win.isMaximized && (
        <button
          aria-label="Resize window"
          className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize after:absolute after:bottom-1 after:right-1 after:h-2 after:w-2 after:border-b after:border-r after:border-white/35"
          onPointerDown={handleResizeStart}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeEnd}
          onPointerCancel={handleResizeEnd}
        />
      )}
    </motion.div>
  );
}
