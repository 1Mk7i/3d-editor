'use client';

import { useState, useCallback } from 'react';

export interface UseContextMenuReturn {
  isVisible: boolean;
  position: { x: number; y: number };
  showContextMenu: (event: React.MouseEvent) => void;
  hideContextMenu: () => void;
  clearSubmenuStack?: () => void;
}

export const useContextMenu = (): UseContextMenuReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const showContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Спочатку ховаємо попереднє меню (це очистить стек підменю)
    setIsVisible(false);
    
    // Потім показуємо нове меню на новій позиції
    setTimeout(() => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setIsVisible(true);
    }, 0);
  }, []);

  const hideContextMenu = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    position,
    showContextMenu,
    hideContextMenu,
  };
};

export default useContextMenu;
