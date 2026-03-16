'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export interface ContextMenuItem {
  id: string;
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
  onClick?: () => void;
}

interface SubmenuState {
  id: string;
  items: ContextMenuItem[];
  position: { x: number; y: number };
  level: number;
  maxHeight?: number;
}

interface ContextMenuContextType {
  submenuStack: SubmenuState[];
  openSubmenu: (item: ContextMenuItem, rect: DOMRect, level: number) => void;
  closeAll: () => void;
  calculatePosition: (
    target: DOMRect | { x: number; y: number }, 
    isSubmenu: boolean,
    itemsCount?: number
  ) => { x: number; y: number; maxHeight: number };
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error('useContextMenu must be used within ContextMenuProvider');
  return context;
};

export const ContextMenuProvider: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => {
  const [submenuStack, setSubmenuStack] = useState<SubmenuState[]>([]);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = useCallback((
    target: DOMRect | { x: number; y: number }, 
    isSubmenu: boolean,
    itemsCount: number = 8
  ) => {
    const vW = window.innerWidth;
    const vH = window.innerHeight;
    const gap = isSubmenu ? 4 : 0;
    const padding = 15;
    const expectedWidth = 240; 
    const itemHeight = 38;
    const expectedHeight = Math.min(itemsCount * itemHeight + 10, 400);

    const isRect = (t: any): t is DOMRect => 'left' in t && 'top' in t;

    let targetX: number;
    let targetY: number;
    let parentLeft: number;

    if (isRect(target)) {
      targetX = isSubmenu ? target.right : target.left;
      targetY = target.top;
      parentLeft = target.left;
    } else {
      targetX = target.x;
      targetY = target.y;
      parentLeft = target.x;
    }

    let x = targetX + gap;
    if (x + expectedWidth > vW - padding) {
      x = isSubmenu ? parentLeft - expectedWidth - gap : vW - expectedWidth - padding;
    }

    let y = targetY;
    if (y + expectedHeight > vH - padding) {
      y = vH - expectedHeight - padding;
    }
    
    y = Math.max(padding, y);

    const maxHeight = vH - y - padding;

    return { 
      x: Math.max(padding, x), 
      y, 
      maxHeight 
    };
  }, []);

  const openSubmenu = useCallback((item: ContextMenuItem, rect: DOMRect, level: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    const pos = calculatePosition(rect, true, item.submenu?.length);
    
    setSubmenuStack(prev => {
      const filtered = prev.filter(s => s.level < level);
      const newSubmenu: SubmenuState = {
        id: item.id,
        items: item.submenu || [],
        level: level,
        position: { x: pos.x, y: pos.y },
        maxHeight: pos.maxHeight
      };
      return [...filtered, newSubmenu];
    });
  }, [calculatePosition]);

  const closeAll = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setSubmenuStack([]);
    onClose();
  }, [onClose]);

  return (
    <ContextMenuContext.Provider value={{ submenuStack, openSubmenu, closeAll, calculatePosition }}>
      {children}
    </ContextMenuContext.Provider>
  );
};