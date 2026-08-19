import { create } from "zustand";

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  prevX: number;
  prevY: number;
  prevWidth: number;
  prevHeight: number;
  hasOpened: boolean;
  component: string;
  subRoute?: string;
}

interface WindowStore {
  windows: Record<string, WindowState>;
  nextZIndex: number;
  booted: boolean;

  setBoot: (val: boolean) => void;
  openApp: (id: string, subRoute?: string) => void;
  setSubRoute: (id: string, subRoute?: string) => void;
  closeApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  maximizeApp: (id: string) => void;
  restoreApp: (id: string) => void;
  focusApp: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, w: number, h: number) => void;
  getOpenWindows: () => WindowState[];
  getFocusedWindow: () => WindowState | undefined;
}

export const WINDOW_MENU_BAR_HEIGHT = 28;
export const WINDOW_DOCK_SAFE_AREA = 112;
export const WINDOW_EDGE_MARGIN = 8;
export const WINDOW_MIN_WIDTH = 360;
export const WINDOW_MIN_HEIGHT = 260;

export function getWindowWorkspace(viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440, viewportHeight = typeof window !== "undefined" ? window.innerHeight : 900) {
  const left = WINDOW_EDGE_MARGIN;
  const top = WINDOW_MENU_BAR_HEIGHT + WINDOW_EDGE_MARGIN;
  const right = Math.max(left, viewportWidth - WINDOW_EDGE_MARGIN);
  const bottom = Math.max(top, viewportHeight - WINDOW_DOCK_SAFE_AREA);

  return {
    left,
    top,
    right,
    bottom,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

function getInitialGeometry(index: number, width: number, height: number) {
  const workspace = getWindowWorkspace();
  const nextWidth = Math.min(width, workspace.width);
  const nextHeight = Math.min(height, workspace.height);
  const cascade = (index % 5) * 24;
  const centeredX = (workspace.left + workspace.right - nextWidth) / 2 + cascade - 48;
  const centeredY = (workspace.top + workspace.bottom - nextHeight) / 2 + cascade - 48;

  return {
    x: Math.min(workspace.right - nextWidth, Math.max(workspace.left, centeredX)),
    y: Math.min(workspace.bottom - nextHeight, Math.max(workspace.top, centeredY)),
    width: nextWidth,
    height: nextHeight,
  };
}

const APP_DEFINITIONS: Omit<
  WindowState,
  "isOpen" | "isMinimized" | "isMaximized" | "isFocused" | "zIndex" | "x" | "y" | "prevX" | "prevY" | "prevWidth" | "prevHeight" | "hasOpened"
>[] = [
  { id: "finder", title: "Raksha Portfolio", icon: "folder", width: 960, height: 600, component: "Finder" },
  { id: "about", title: "About Raksha", icon: "user", width: 800, height: 560, component: "About" },
  { id: "projects", title: "Projects", icon: "code", width: 960, height: 620, component: "Projects" },
  { id: "experience", title: "Experience", icon: "briefcase", width: 860, height: 580, component: "Experience" },
  { id: "skills", title: "Skills", icon: "cpu", width: 820, height: 560, component: "Skills" },
  { id: "achievements", title: "Achievements", icon: "trophy", width: 880, height: 580, component: "Achievements" },
  { id: "certifications", title: "Certifications", icon: "award", width: 900, height: 600, component: "Certifications" },
  { id: "community", title: "Community & Events", icon: "users", width: 880, height: 580, component: "Community" },
  { id: "photos", title: "Photos", icon: "image", width: 900, height: 620, component: "Photos" },
  { id: "resume", title: "Resume", icon: "file-text", width: 800, height: 640, component: "Resume" },
  { id: "contact", title: "Contact", icon: "mail", width: 600, height: 450, component: "Contact" },
  { id: "terminal", title: "Terminal", icon: "terminal", width: 720, height: 480, component: "Terminal" },
  { id: "askraksha", title: "Ask Raksha", icon: "sparkles", width: 700, height: 560, component: "AskRaksha" },
];

function buildInitialWindows(): Record<string, WindowState> {
  const map: Record<string, WindowState> = {};
  APP_DEFINITIONS.forEach((def) => {
    const pos = { x: 0, y: 0 };
    map[def.id] = {
      ...def,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      isFocused: false,
      zIndex: 0,
      x: pos.x,
      y: pos.y,
      prevX: pos.x,
      prevY: pos.y,
      prevWidth: def.width,
      prevHeight: def.height,
      hasOpened: false,
    };
  });
  return map;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: buildInitialWindows(),
  nextZIndex: 10,
  booted: false,

  setBoot: (val) => set({ booted: val }),

  openApp: (id, subRoute) => {
    const state = get();
    const win = state.windows[id];
    if (!win) return;

    if (win.isOpen && !win.isMinimized) {
      // Already open and visible — just focus
      get().focusApp(id);
      if (subRoute) {
        set((s) => ({
          windows: {
            ...s.windows,
            [id]: { ...s.windows[id], subRoute },
          },
        }));
      }
      return;
    }

    const newZ = state.nextZIndex + 1;
    const updates: Partial<WindowState> = {
      isOpen: true,
      isMinimized: false,
      isFocused: true,
      zIndex: newZ,
    };
    if (!win.hasOpened) {
      const geometry = getInitialGeometry(Object.keys(state.windows).indexOf(id), win.width, win.height);
      Object.assign(updates, geometry, {
        prevX: geometry.x,
        prevY: geometry.y,
        prevWidth: geometry.width,
        prevHeight: geometry.height,
        hasOpened: true,
      });
    }
    if (subRoute) updates.subRoute = subRoute;

    // Unfocus others
    const newWindows = { ...state.windows };
    for (const key of Object.keys(newWindows)) {
      if (key !== id) {
        newWindows[key] = { ...newWindows[key], isFocused: false };
      }
    }
    newWindows[id] = { ...newWindows[id], ...updates };

    set({ windows: newWindows, nextZIndex: newZ });
  },

  setSubRoute: (id, subRoute) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], subRoute },
      },
    }));
  },

  closeApp: (id) => {
    set((state) => {
      const windows = {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
          isFocused: false,
          x: state.windows[id].isMaximized ? state.windows[id].prevX : state.windows[id].x,
          y: state.windows[id].isMaximized ? state.windows[id].prevY : state.windows[id].y,
          width: state.windows[id].isMaximized ? state.windows[id].prevWidth : state.windows[id].width,
          height: state.windows[id].isMaximized ? state.windows[id].prevHeight : state.windows[id].height,
          subRoute: undefined,
        },
      };
      const nextFocus = Object.values(windows)
        .filter((window) => window.isOpen && !window.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      if (nextFocus) windows[nextFocus.id] = { ...windows[nextFocus.id], isFocused: true };
      return { windows };
    });
  },

  minimizeApp: (id) => {
    set((state) => {
      const windows = {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: true, isFocused: false },
      };
      const nextFocus = Object.values(windows)
        .filter((window) => window.isOpen && !window.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      if (nextFocus) windows[nextFocus.id] = { ...windows[nextFocus.id], isFocused: true };
      return { windows };
    });
  },

  maximizeApp: (id) => {
    const win = get().windows[id];
    if (!win) return;

    if (win.isMaximized) {
      // Restore
      set((s) => ({
        windows: {
          ...s.windows,
          [id]: {
            ...s.windows[id],
            isMaximized: false,
            x: s.windows[id].prevX,
            y: s.windows[id].prevY,
            width: s.windows[id].prevWidth,
            height: s.windows[id].prevHeight,
          },
        },
      }));
    } else {
      const workspace = getWindowWorkspace();
      set((s) => ({
        windows: {
          ...s.windows,
          [id]: {
            ...s.windows[id],
            isMaximized: true,
            prevX: s.windows[id].x,
            prevY: s.windows[id].y,
            prevWidth: s.windows[id].width,
            prevHeight: s.windows[id].height,
            x: workspace.left,
            y: workspace.top,
            width: workspace.width,
            height: workspace.height,
          },
        },
      }));
    }
  },

  restoreApp: (id) => {
    const newZ = get().nextZIndex + 1;
    const newWindows = { ...get().windows };
    for (const key of Object.keys(newWindows)) {
      newWindows[key] = { ...newWindows[key], isFocused: key === id };
    }
    newWindows[id] = {
      ...newWindows[id],
      isMinimized: false,
      isFocused: true,
      zIndex: newZ,
    };
    set({ windows: newWindows, nextZIndex: newZ });
  },

  focusApp: (id) => {
    const state = get();
    const newZ = state.nextZIndex + 1;
    const newWindows = { ...state.windows };
    for (const key of Object.keys(newWindows)) {
      newWindows[key] = { ...newWindows[key], isFocused: key === id };
    }
    newWindows[id] = { ...newWindows[id], isFocused: true, zIndex: newZ };
    set({ windows: newWindows, nextZIndex: newZ });
  },

  updatePosition: (id, x, y) => {
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], x, y } },
    }));
  },

  updateSize: (id, w, h) => {
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], width: w, height: h } },
    }));
  },

  getOpenWindows: () => {
    return Object.values(get().windows).filter((w) => w.isOpen);
  },

  getFocusedWindow: () => {
    return Object.values(get().windows).find((w) => w.isFocused && w.isOpen);
  },
}));
