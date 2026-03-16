'use client';

import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ContextMenuProvider, useContextMenu, ContextMenuItem } from './ContextMenuContext';
import { MenuItem } from './MenuItem';
import styles from './ContextMenu.module.css';

interface ContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenuContent: React.FC<ContextMenuProps> = ({ position, items, onClose }) => {
  const { submenuStack, closeAll } = useContextMenu();

  const safePosition = useMemo(() => {
    const vW = window.innerWidth;
    const vH = window.innerHeight;
    const expectedWidth = 220;
    const expectedHeight = items.length * 38;
    const padding = 15;

    let x = position.x;
    let y = position.y;

    // Перевірка правої межі
    if (x + expectedWidth > vW - padding) {
      x = vW - expectedWidth - padding;
    }
    // Перевірка нижньої межі
    if (y + expectedHeight > vH - padding) {
      y = vH - expectedHeight - padding;
    }

    return { 
      x: Math.max(padding, x), 
      y: Math.max(padding, y) 
    };
  }, [position, items]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && closeAll();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeAll]);

  return (
    <>
      <div
        className={styles['context-menu']}
        style={{ 
          left: safePosition.x, 
          top: safePosition.y, 
          position: 'fixed', 
          zIndex: 10000 
        }}
      >
        <div className={styles['context-menu-content']}>
          {items.map(item => <MenuItem key={item.id} item={item} level={0} />)}
        </div>
      </div>

      {submenuStack.map(sub => (
        createPortal(
          <div
            key={sub.id}
            className={`${styles['context-menu']} ${styles.submenu}`}
            style={{ 
              left: sub.position.x, 
              top: sub.position.y, 
              position: 'fixed', 
              zIndex: 10000 + sub.level,
              maxHeight: sub.maxHeight 
            }}
          >
            <div className={styles['context-menu-content']} style={{ maxHeight: 'inherit', overflowY: 'auto' }}>
              {sub.items.map(item => <MenuItem key={item.id} item={item} level={sub.level} />)}
            </div>
          </div>,
          document.body
        )
      ))}
      
      <div className={styles['context-menu-backdrop']} onClick={closeAll} />
    </>
  );
};

export const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  if (!props.isVisible) return null;
  return (
    <ContextMenuProvider onClose={props.onClose}>
      <ContextMenuContent {...props} />
    </ContextMenuProvider>
  );
};