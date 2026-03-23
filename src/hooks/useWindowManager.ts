'use client';

import { useState, useCallback } from 'react';

export interface WindowState {
  id: string;
  isVisible: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface UseWindowManagerReturn {
  windows: WindowState[];
  openWindow: (id: string, initialProps?: Partial<WindowState>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  isWindowOpen: (id: string) => boolean;
  getWindow: (id: string) => WindowState | undefined;
}

let nextZIndex = 1000;

export const useWindowManager = (): UseWindowManagerReturn => {
  const [windows, setWindows] = useState<WindowState[]>([]);

const openWindow = useCallback((id: string, initialProps?: Partial<WindowState>) => {
  setWindows(prev => {
    const existingWindow = prev.find(w => w.id === id);
    
    if (existingWindow) {
      return prev.map(w => 
        w.id === id 
          ? { 
              ...w, 
              ...initialProps,
              isVisible: true, 
              isMinimized: false, 
              zIndex: ++nextZIndex 
            }
          : w
      );
    }

    const defaultWindow: WindowState = {
      id,
      isVisible: true,
      isMinimized: false,
      isMaximized: false,
      position: { x: 100 + (prev.length * 30), y: 100 + (prev.length * 30) },
      size: { width: 600, height: 400 },
      zIndex: ++nextZIndex,
      ...initialProps,
    };

    return [...prev, defaultWindow];
  });
}, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, isMinimized: true } : w
      )
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, isMaximized: true, isMinimized: false } : w
      )
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, isMaximized: false, isMinimized: false } : w
      )
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => 
        w.id === id ? { ...w, zIndex: ++nextZIndex } : w
      )
    );
  }, []);

  const isWindowOpen = useCallback((id: string) => {
    return windows.some(w => w.id === id && w.isVisible);
  }, [windows]);

  const getWindow = useCallback((id: string) => {
    return windows.find(w => w.id === id);
  }, [windows]);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    isWindowOpen,
    getWindow,
  };
};

export default useWindowManager;
